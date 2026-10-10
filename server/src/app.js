import crypto from 'node:crypto';
import { WebSocketServer } from 'ws';
import { signToken, readToken, checkCode, inviteCode, Limiter } from './auth.js';

const TOKEN_TTL = 60 * 24 * 3600;        // 60 дней, обновляется при каждом заходе в /v1/me
const MAX_BODY = 512 * 1024;
const MAX_DOC = 200 * 1024;
const DOC_LIMIT = { nutr: 60 * 1024, nsum: 40 * 1024 };   // питание: только итоги по дням, не журнал продуктов
const DOC_KEYS = new Set(['profile', 'plan', 'progs', 'set', 'nutr', 'nsum']);   // cnorm пишет только тренер (отдельный маршрут)
const CONSENT_V = 'v1';
const ISO = /^\d{4}-\d{2}-\d{2}$/;

class HttpError extends Error {
  constructor(status, code, extra) { super(code); this.status = status; this.code = code; this.extra = extra; }
}
const bad = (code, extra) => new HttpError(400, code, extra);

export function createApp({ db, secret, trustProxy = false, log = () => {}, sms = { send: async () => {} }, demo = null, smsDailyCap = 500, phoneAuth = false, push = null, origins = null }) {
  if (!secret || secret.length < 32) throw new Error('SECRET must be at least 32 chars');
  const lim = new Limiter();
  const sockets = new Map();             // userId -> Set<ws>
  const sweeper = setInterval(() => lim.sweep(), 600e3); sweeper.unref?.();

  // ---------- события: запись в журнал + доставка онлайн ----------
  async function emit(q, to, type, payload = {}) {
    const r = await q.query('INSERT INTO events(to_user,type,payload) VALUES($1,$2,$3::jsonb) RETURNING id, created_at', [to, type, JSON.stringify(payload)]);
    const ev = { id: Number(r.rows[0].id), type, payload, at: new Date(r.rows[0].created_at).toISOString() };
    return ev;
  }
  function deliver(to, ev) {          // вызывается ПОСЛЕ коммита
    const set = sockets.get(to); if (!set) return;
    const msg = JSON.stringify({ t: 'event', ...ev });
    for (const ws of set) if (ws.readyState === 1) ws.send(msg);
  }
  async function emitTx(to, type, payload) {      // отдельная запись + доставка
    const ev = await emit(db, to, type, payload); deliver(to, ev); return ev;
  }
  function kick(userId, reason) {     // закрыть сокеты (удаление аккаунта, отзыв роли)
    const set = sockets.get(userId); if (!set) return;
    for (const ws of set) { try { ws.send(JSON.stringify({ t: 'bye', reason })); ws.close(4001, reason); } catch {} }
  }

  // push: не блокирует ответ, ошибки не ломают запрос. Мёртвые подписки удаляются.
  async function notify(to, payload) {
    if (!push) return 0;
    let subs; try { subs = (await db.query('SELECT endpoint, p256dh, auth FROM push_subs WHERE user_id=$1', [to])).rows; } catch { return 0; }
    let n = 0;
    await Promise.all(subs.map(async (s) => {
      try { await push.send(s, payload); n++; }
      catch (e) { if (e && e.gone) db.query('DELETE FROM push_subs WHERE endpoint=$1', [s.endpoint]).catch(() => {}); }
    }));
    return n;
  }

  // ---------- вспомогательное ----------
  const audit = (actor, action, target, meta = {}) =>
    db.query('INSERT INTO audit_log(actor,action,target,meta) VALUES($1,$2,$3,$4::jsonb)', [actor, action, target, JSON.stringify(meta)]).catch(() => {});

  async function userFromToken(tok) {
    const p = readToken(secret, tok); if (!p) return null;
    const r = await db.query('SELECT id, role, name FROM users WHERE id=$1 AND deleted_at IS NULL', [p.sub]);
    return r.rows[0] || null;
  }
  async function auth(req) {
    const h = req.headers.authorization || '';
    const u = await userFromToken(h.startsWith('Bearer ') ? h.slice(7) : '');
    if (!u) throw new HttpError(401, 'unauthorized');
    return u;
  }
  // Минимизация данных: на сервер попадает только то, что нужно тренеру (или клиент сам включил копию).
  async function syncAllowed(q, userId) {
    const r = (await q.query("SELECT backup, EXISTS (SELECT 1 FROM links WHERE client_id=$1 AND status='active') AS linked FROM users WHERE id=$1", [userId])).rows[0];
    return !!r && (r.backup || r.linked);
  }
  // После разрыва связи данные клиента с сервера удаляются (если копия не включена): основная копия у клиента на телефоне.
  async function purgeIfNoBackup(q, userId) {
    const r = (await q.query('SELECT backup FROM users WHERE id=$1', [userId])).rows[0];
    if (!r || r.backup) return false;
    await q.query('DELETE FROM docs WHERE user_id=$1', [userId]);
    await q.query('DELETE FROM sessions WHERE user_id=$1', [userId]);
    await q.query('DELETE FROM weights WHERE user_id=$1', [userId]);
    return true;
  }
  const needCoach = (u) => { if (u.role !== 'coach') throw new HttpError(403, 'coach_only'); };
  const ip = (req) => (trustProxy && req.headers['x-forwarded-for'] ? String(req.headers['x-forwarded-for']).split(',')[0].trim() : req.socket.remoteAddress) || '?';
  const mint = (id) => signToken(secret, { sub: id, exp: Math.floor(Date.now() / 1000) + TOKEN_TTL });

  async function activeLink(coachId, clientId) {
    const r = await db.query("SELECT id FROM links WHERE coach_id=$1 AND client_id=$2 AND status='active'", [coachId, clientId]);
    return r.rows.length > 0;
  }

  function validDate(s) { return typeof s === 'string' && ISO.test(s) && !isNaN(Date.parse(s)); }

  // ---------- обработчики ----------
  const routes = [];
  const route = (method, re, fn) => routes.push({ method, re, fn });

  route('POST', /^\/v1\/auth\/device$/, async ({ req, body }) => {
    if (!lim.hit('dev:' + ip(req), 30, 3600e3)) throw new HttpError(429, 'rate_limited');
    const id = typeof body.deviceId === 'string' && /^[A-Za-z0-9_-]{16,64}$/.test(body.deviceId) ? body.deviceId : null;
    if (!id) throw bad('bad_device');
    const found = await db.query('SELECT id, role FROM users WHERE device_id=$1 AND deleted_at IS NULL', [id]);
    let u = found.rows[0];
    if (!u) {
      const uid = crypto.randomUUID();
      await db.query("INSERT INTO users(id, device_id) VALUES($1,$2) ON CONFLICT (device_id) DO NOTHING", [uid, id]);
      u = (await db.query('SELECT id, role FROM users WHERE device_id=$1', [id])).rows[0];
    }
    return { token: mint(u.id), userId: u.id, role: u.role };
  });

  route('GET', /^\/v1\/me$/, async ({ req }) => {
    const u = await auth(req);
    const out = { userId: u.id, role: u.role, name: u.name, token: mint(u.id) };
    if (u.role === 'coach') {
      const c = await db.query('SELECT invite_code, display_name FROM coaches WHERE user_id=$1', [u.id]);
      out.invite = c.rows[0]?.invite_code || null; out.displayName = c.rows[0]?.display_name || '';
    } else {
      const l = await db.query("SELECT l.coach_id, c.display_name, c.invite_code FROM links l JOIN coaches c ON c.user_id=l.coach_id WHERE l.client_id=$1 AND l.status='active'", [u.id]);
      out.coach = l.rows[0] ? { id: l.rows[0].coach_id, name: l.rows[0].display_name, code: l.rows[0].invite_code } : null;
    }
    return out;
  });

  route('POST', /^\/v1\/me\/backup$/, async ({ req, body }) => {
    const u = await auth(req); const on = body.on === true;
    await db.query('UPDATE users SET backup=$2 WHERE id=$1', [u.id, on]);
    let purged = false;
    if (!on && !(await activeLinkOf(u.id))) purged = await purgeIfNoBackup(db, u.id);
    return { ok: true, backup: on, purged };
  });
  async function activeLinkOf(clientId) { return (await db.query("SELECT 1 FROM links WHERE client_id=$1 AND status='active'", [clientId])).rows.length > 0; }

  // Секретный код тренера: проверка только на сервере, лимит попыток, журнал.
  route('POST', /^\/v1\/coach\/claim$/, async ({ req, body }) => {
    const u = await auth(req);
    const code = typeof body.code === 'string' ? body.code.trim() : '';
    if (code.length < 6 || code.length > 64) throw new HttpError(403, 'bad_code');
    const kU = 'claim:u:' + u.id, kI = 'claim:ip:' + ip(req);
    if (lim.left(kU, 5, 900e3) === 0 || lim.left(kI, 20, 900e3) === 0) throw new HttpError(429, 'locked', { retryAfterSec: 900 });
    const name = typeof body.displayName === 'string' ? body.displayName.trim().slice(0, 60) : '';
    const codes = (await db.query("SELECT * FROM coach_codes WHERE revoked_at IS NULL AND (expires_at IS NULL OR expires_at>now())")).rows;
    let hit = null;
    for (const c of codes) if (checkCode(code, c.salt, c.hash)) { hit = c; break; }   // перебор всех кодов, время не зависит от попадания
    if (!hit) {
      lim.hit(kU, 5, 900e3); lim.hit(kI, 20, 900e3);
      await audit(u.id, 'coach.claim.fail', null, { ip: ip(req) });
      throw new HttpError(403, 'bad_code', { attemptsLeft: lim.left(kU, 5, 900e3) });
    }
    const out = await db.tx(async (t) => {
      const already = (await t.query('SELECT invite_code FROM coaches WHERE user_id=$1', [u.id])).rows[0];
      if (already) return { invite: already.invite_code, again: true };
      const upd = await t.query('UPDATE coach_codes SET uses=uses+1 WHERE id=$1 AND uses<max_uses RETURNING id', [hit.id]);
      if (!upd.rows.length) throw new HttpError(403, 'code_used');
      // клиент, у которого был тренер, при переходе в роль тренера отвязывается
      const prev = await t.query("UPDATE links SET status='revoked_by_client', ended_at=now() WHERE client_id=$1 AND status='active' RETURNING coach_id", [u.id]);
      let inv, tries = 0;
      for (;;) {
        inv = inviteCode();
        try { await t.query('INSERT INTO coaches(user_id, code_id, invite_code, display_name) VALUES($1,$2,$3,$4)', [u.id, hit.id, inv, name || u.name]); break; }
        catch (e) { if (++tries > 5 || !/unique|duplicate/i.test(String(e.message))) throw e; }
      }
      await t.query("UPDATE users SET role='coach' WHERE id=$1", [u.id]);
      return { invite: inv, notify: prev.rows.map((r) => r.coach_id) };
    });
    lim.reset(kU);
    await audit(u.id, 'coach.claim.ok', null, { codeId: hit.id, label: hit.label });
    for (const cid of out.notify || []) await emitTx(cid, 'client.unlinked', { clientId: u.id, by: 'client' });
    return { role: 'coach', invite: out.invite, token: mint(u.id) };
  });

  // Клиент вводит публичный код тренера. Ввод = согласие на доступ (текст версии CONSENT_V показывает приложение).
  route('POST', /^\/v1\/link$/, async ({ req, body }) => {
    const u = await auth(req);
    if (u.role === 'coach') throw new HttpError(409, 'coach_cannot_be_client');
    if (body.consent !== CONSENT_V) throw bad('consent_required');
    const code = typeof body.code === 'string' ? body.code.trim().toUpperCase() : '';
    if (!/^[A-Z0-9]{4,12}$/.test(code)) throw new HttpError(404, 'code_not_found');
    if (!lim.hit('link:u:' + u.id, 10, 600e3) || !lim.hit('link:ip:' + ip(req), 60, 600e3)) throw new HttpError(429, 'rate_limited');
    const c = (await db.query('SELECT c.user_id, c.display_name FROM coaches c JOIN users x ON x.id=c.user_id AND x.deleted_at IS NULL WHERE c.invite_code=$1', [code])).rows[0];
    if (!c) throw new HttpError(404, 'code_not_found');
    if (c.user_id === u.id) throw bad('self_link');
    const cur = (await db.query("SELECT coach_id FROM links WHERE client_id=$1 AND status='active'", [u.id])).rows[0];
    if (cur && cur.coach_id === c.user_id) return { ok: true, coach: { id: c.user_id, name: c.display_name }, again: true };
    if (cur) throw new HttpError(409, 'already_linked');
    const prof = (await db.query("SELECT value->>'name' AS n FROM docs WHERE user_id=$1 AND key='profile'", [u.id])).rows[0];
    await db.query("INSERT INTO links(coach_id, client_id, status, consent_v) VALUES($1,$2,'active',$3)", [c.user_id, u.id, CONSENT_V]);
    await audit(u.id, 'link.create', c.user_id);
    await emitTx(c.user_id, 'client.linked', { clientId: u.id, name: (prof && prof.n) || u.name || 'Клиент' });
    return { ok: true, coach: { id: c.user_id, name: c.display_name } };
  });

  route('DELETE', /^\/v1\/link$/, async ({ req }) => {
    const u = await auth(req);
    const r = await db.query("UPDATE links SET status='revoked_by_client', ended_at=now() WHERE client_id=$1 AND status='active' RETURNING coach_id", [u.id]);
    for (const row of r.rows) { await audit(u.id, 'link.revoke', row.coach_id); await emitTx(row.coach_id, 'client.unlinked', { clientId: u.id, by: 'client' }); }
    const purged = r.rows.length ? await purgeIfNoBackup(db, u.id) : false;
    return { ok: true, was: r.rows.length > 0, purged };
  });

  // Единая синхронизация клиента: отправить накопленное, получить события после курсора.
  route('POST', /^\/v1\/sync$/, async ({ req, body }) => {
    const u = await auth(req);
    const docs = body.docs && typeof body.docs === 'object' ? body.docs : {};
    const sess = Array.isArray(body.sessions) ? body.sessions : [];
    const wts = Array.isArray(body.weights) ? body.weights : [];
    if (sess.length > 200 || wts.length > 400) throw new HttpError(413, 'batch_too_large');
    if ((Object.keys(docs).length || sess.length || wts.length) && !(await syncAllowed(db, u.id))) throw new HttpError(403, 'sync_not_enabled');
    const res = { docs: {}, conflicts: [], sessions: 0, weights: 0 };
    const touched = [], newSess = [];
    const evs = await db.tx(async (t) => {
      for (const key of Object.keys(docs)) {
        if (!DOC_KEYS.has(key)) throw bad('bad_doc_key', { key });
        const d = docs[key]; if (!d || typeof d !== 'object' || d.value == null) throw bad('bad_doc', { key });
        const json = JSON.stringify(d.value); if (json.length > (DOC_LIMIT[key] || MAX_DOC)) throw new HttpError(413, 'doc_too_large', { key });
        const base = Number.isInteger(d.rev) ? d.rev : 0;
        const cur = (await t.query('SELECT rev, value FROM docs WHERE user_id=$1 AND key=$2 FOR UPDATE', [u.id, key])).rows[0];
        if (!cur) {
          await t.query('INSERT INTO docs(user_id,key,rev,value) VALUES($1,$2,1,$3::jsonb) ON CONFLICT (user_id,key) DO NOTHING', [u.id, key, json]);
          res.docs[key] = { rev: 1 }; touched.push(key);
        } else if (cur.rev === base || d.force === true) {   // профиль/план: побеждает последняя запись; force — осознанная перезапись
          await t.query('UPDATE docs SET rev=rev+1, value=$3::jsonb, updated_at=now() WHERE user_id=$1 AND key=$2', [u.id, key, json]);
          res.docs[key] = { rev: cur.rev + 1 }; touched.push(key);
        } else {                                              // устаревшая версия: отдаём серверную, приложение решает
          res.conflicts.push(key); res.docs[key] = { rev: cur.rev, value: cur.value };
        }
        if (key === 'profile' && typeof d.value.name === 'string') await t.query('UPDATE users SET name=$2 WHERE id=$1', [u.id, d.value.name.slice(0, 60)]);
      }
      for (const s of sess) {
        if (!s || typeof s !== 'object' || typeof s.id !== 'string' || s.id.length > 64 || !validDate(s.d)) throw bad('bad_session');
        const json = JSON.stringify(s); if (json.length > 64 * 1024) throw new HttpError(413, 'session_too_large');
        const r = await t.query('INSERT INTO sessions(user_id,id,d,payload) VALUES($1,$2,$3::date,$4::jsonb) ON CONFLICT (user_id,id) DO NOTHING RETURNING id', [u.id, s.id, s.d, json]);
        res.sessions += r.rows.length; if (r.rows.length) newSess.push(s);
      }
      for (const w of wts) {
        const v = Number(w && w.v); if (!w || !validDate(w.d) || !(v > 20 && v < 400)) throw bad('bad_weight');
        const r = await t.query('INSERT INTO weights(user_id,d,v) VALUES($1,$2::date,$3) ON CONFLICT (user_id,d) DO UPDATE SET v=EXCLUDED.v RETURNING d', [u.id, w.d, Math.round(v * 10) / 10]);
        res.weights += r.rows.length;
      }
      const out = [];
      if (res.sessions || res.weights || touched.length) {
        const lk = (await t.query("SELECT coach_id FROM links WHERE client_id=$1 AND status='active'", [u.id])).rows[0];
        if (lk) out.push([lk.coach_id, await emit(t, lk.coach_id, 'client.updated', { clientId: u.id, sessions: res.sessions, weights: res.weights, docs: touched })]);
      }
      return out;
    });
    for (const [to, ev] of evs) deliver(to, ev);
    if (newSess.length) await sessionDone(u, newSess);
    // входящее клиенту: события после курсора
    const since = Number.isInteger(body.since) ? body.since : 0;
    res.events = await eventsSince(u.id, since);
    const cn = (await db.query("SELECT rev, value FROM docs WHERE user_id=$1 AND key='cnorm'", [u.id])).rows[0];
    if (cn && (await activeLinkOf(u.id))) res.cnorm = cn.value;
    res.cursor = res.events.length ? res.events[res.events.length - 1].id : since;
    return res;
  });

  // Тренеру: клиент завершил тренировку. Пропуск (pct=0) и старые записи (догрузка истории при привязке) пуш не вызывают.
  const todayMsk = () => new Date(Date.now() + 3 * 3600e3).toISOString().slice(0, 10);
  async function sessionDone(u, list) {
    try {
      const lk = (await db.query("SELECT coach_id FROM links WHERE client_id=$1 AND status='active'", [u.id])).rows[0]; if (!lk) return;
      const fresh = list.filter((s) => Number(s.pct) > 0 && s.d >= shift(todayMsk(), -1) && !s.demo);
      if (!fresh.length) return;
      const name = ((await db.query('SELECT name FROM users WHERE id=$1', [u.id])).rows[0] || {}).name || 'Клиент';
      const last = fresh[fresh.length - 1];
      const sessions = fresh.slice(-5).map((s) => ({ id: s.id, d: s.d, wn: String(s.wn || '').slice(0, 80), pct: Math.round(Number(s.pct) || 0) }));
      await emitTx(lk.coach_id, 'client.session', { clientId: u.id, name, sessions });
      const body = fresh.length === 1 ? 'Тренировка «' + (last.wn || 'без названия') + '» завершена · ' + Math.round(Number(last.pct)) + '%' : 'Завершено тренировок: ' + fresh.length;
      await notify(lk.coach_id, { k: 'session', title: name, body: String(body).slice(0, 140), tag: 's-' + u.id, cid: u.id, d: last.d, sid: last.id, url: './?push=session&cid=' + u.id + '&d=' + last.d + '&sid=' + encodeURIComponent(last.id) });
    } catch (e) { log('push session', e && e.message); }
  }

  const PUSH_HOST = /^https:\/\/(fcm\.googleapis\.com|android\.googleapis\.com|updates\.push\.services\.mozilla\.com|[a-z0-9.-]+\.push\.apple\.com|[a-z0-9.-]+\.notify\.windows\.com)\//;
  route('GET', /^\/v1\/push\/key$/, async () => ({ key: push ? push.publicKey : null }));
  route('POST', /^\/v1\/push\/subscribe$/, async ({ req, body }) => {
    const u = await auth(req); if (!push) throw new HttpError(503, 'push_disabled');
    const ep = body && body.endpoint, k = body && body.keys;
    if (typeof ep !== 'string' || ep.length > 700 || !PUSH_HOST.test(ep)) throw bad('bad_endpoint');
    if (!k || typeof k.p256dh !== 'string' || typeof k.auth !== 'string' || k.p256dh.length > 200 || k.auth.length > 64 || !k.p256dh || !k.auth) throw bad('bad_keys');
    await db.query('INSERT INTO push_subs(endpoint,user_id,p256dh,auth) VALUES($1,$2,$3,$4) ON CONFLICT (endpoint) DO UPDATE SET user_id=EXCLUDED.user_id, p256dh=EXCLUDED.p256dh, auth=EXCLUDED.auth', [ep, u.id, k.p256dh, k.auth]);
    await db.query('DELETE FROM push_subs WHERE user_id=$1 AND endpoint NOT IN (SELECT endpoint FROM push_subs WHERE user_id=$1 ORDER BY created_at DESC LIMIT 5)', [u.id]);
    return { ok: true };
  });
  route('POST', /^\/v1\/push\/test$/, async ({ req }) => {       // кнопка «Проверить» в профиле
    const u = await auth(req); if (!push) throw new HttpError(503, 'push_disabled');
    if (!lim.hit('ptest:' + u.id, 5, 600e3)) throw new HttpError(429, 'rate_limited');
    const n = await notify(u.id, { k: 'test', title: 'Forma', body: 'Уведомления работают', tag: 'test', url: './' });
    return { ok: true, sent: n };
  });
  route('POST', /^\/v1\/push\/unsubscribe$/, async ({ req, body }) => {
    const u = await auth(req);
    if (body && typeof body.endpoint === 'string') await db.query('DELETE FROM push_subs WHERE user_id=$1 AND endpoint=$2', [u.id, body.endpoint]); else await db.query('DELETE FROM push_subs WHERE user_id=$1', [u.id]);
    return { ok: true };
  });

  async function eventsSince(userId, since, limit = 200) {
    const r = await db.query('SELECT id, type, payload, created_at FROM events WHERE to_user=$1 AND id>$2 ORDER BY id LIMIT $3', [userId, since, limit]);
    return r.rows.map((e) => ({ id: Number(e.id), type: e.type, payload: e.payload, at: new Date(e.created_at).toISOString() }));
  }
  route('GET', /^\/v1\/events$/, async ({ req, url }) => {
    const u = await auth(req);
    const since = Math.max(0, parseInt(url.searchParams.get('since') || '0', 10) || 0);
    return { events: await eventsSince(u.id, since) };
  });

  // ---------- тренер ----------
  route('GET', /^\/v1\/coach\/clients$/, async ({ req }) => {
    const u = await auth(req); needCoach(u);
    const cl = (await db.query("SELECT l.client_id AS id, l.created_at AS since, x.name FROM links l JOIN users x ON x.id=l.client_id AND x.deleted_at IS NULL WHERE l.coach_id=$1 AND l.status='active'", [u.id])).rows;
    const out = [];
    for (const c of cl) {
      const s = (await db.query(
        `SELECT max(d)::text AS last,
                count(*) FILTER (WHERE d >= msk_today()-6)  AS n7,
                count(*) FILTER (WHERE d >= msk_today()-29) AS n30,
                count(*) FILTER (WHERE d >= msk_today()-6 AND EXISTS (SELECT 1 FROM jsonb_array_elements(COALESCE(payload->'ex','[]'::jsonb)) e WHERE (e->>'pain') IN ('1','true'))) AS pain7
         FROM sessions WHERE user_id=$1`, [c.id])).rows[0];
      const w = (await db.query('SELECT d::text AS d, v::float8 AS v FROM weights WHERE user_id=$1 ORDER BY d DESC LIMIT 60', [c.id])).rows;
      let wt = null, dl = null;
      if (w.length) { wt = w[0].v; const ref = w.find((r) => r.d <= shift(w[0].d, -30)) || w[w.length - 1]; if (ref !== w[0]) dl = Math.round((wt - ref.v) * 10) / 10; }
      const up = (await db.query('SELECT max(updated_at) AS t FROM docs WHERE user_id=$1', [c.id])).rows[0];
      out.push({ id: c.id, name: c.name || 'Клиент', since: new Date(c.since).toISOString(), last: s.last, n7: Number(s.n7), n30: Number(s.n30), pain7: Number(s.pain7), weight: wt, weightDelta30: dl, updated: up.t ? new Date(up.t).toISOString() : null });
    }
    return { clients: out };
  });
  function shift(iso, days) { const d = new Date(iso + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + days); return d.toISOString().slice(0, 10); }

  route('GET', /^\/v1\/coach\/clients\/([0-9a-f-]{36})$/, async ({ req, m, url }) => {
    const u = await auth(req); needCoach(u);
    const id = m[1];
    if (!(await activeLink(u.id, id))) throw new HttpError(403, 'not_your_client');
    const days = Math.min(3650, Math.max(1, parseInt(url.searchParams.get('days') || '90', 10) || 90));
    const docs = (await db.query("SELECT key, rev, value FROM docs WHERE user_id=$1 AND key IN ('profile','plan','nsum','cnorm')", [id])).rows;
    const sessions = (await db.query('SELECT payload FROM sessions WHERE user_id=$1 AND d >= msk_today()-$2::int ORDER BY d DESC, created_at DESC LIMIT 1000', [id, days])).rows.map((r) => r.payload);
    const weights = (await db.query('SELECT d::text AS d, v::float8 AS v FROM weights WHERE user_id=$1 ORDER BY d', [id])).rows;
    await audit(u.id, 'coach.view', id, { days });
    const o = { id, docs: {} }; for (const d of docs) o.docs[d.key] = { rev: d.rev, value: d.value };
    o.sessions = sessions; o.weights = weights;
    return o;
  });

  route('POST', /^\/v1\/coach\/clients\/([0-9a-f-]{36})\/(notes|programs)$/, async ({ req, m, body }) => {
    const u = await auth(req); needCoach(u);
    const id = m[1], kind = m[2] === 'notes' ? 'note' : 'program';
    if (!(await activeLink(u.id, id))) throw new HttpError(403, 'not_your_client');
    let payload;
    if (kind === 'note') {
      const text = typeof body.text === 'string' ? body.text.trim() : '';
      if (!text || text.length > 2000) throw bad('bad_text');
      payload = { text, ref: typeof body.ref === 'string' ? body.ref.slice(0, 64) : undefined };
    } else {
      if (!body.program || typeof body.program !== 'object' || JSON.stringify(body.program).length > 100 * 1024) throw bad('bad_program');
      payload = { program: body.program, title: String(body.title || body.program.name || '').slice(0, 120), text: typeof body.text === 'string' ? body.text.slice(0, 2000) : '', key: typeof body.key === 'string' && body.key ? body.key.slice(0, 64) : undefined };
    }
    let resend = false;
    if (kind === 'program' && payload.key) resend = Number((await db.query("SELECT count(*) AS n FROM coach_items WHERE coach_id=$1 AND client_id=$2 AND kind='program' AND payload->>'key'=$3", [u.id, id, payload.key])).rows[0].n) > 0;
    const r = await db.query('INSERT INTO coach_items(coach_id,client_id,kind,payload) VALUES($1,$2,$3,$4::jsonb) RETURNING id', [u.id, id, kind, JSON.stringify(payload)]);
    await audit(u.id, 'coach.' + kind, id);
    const ev = await emitTx(id, 'coach.' + kind, { itemId: Number(r.rows[0].id), ...payload });
    const cn = ((await db.query('SELECT display_name FROM coaches WHERE user_id=$1', [u.id])).rows[0] || {}).display_name || 'Тренер';
    const snip = (x) => { x = String(x || '').replace(/\s+/g, ' ').trim(); return x.length > 110 ? x.slice(0, 109) + '…' : x; };
    notify(id, kind === 'note'
      ? { k: 'note', title: cn, body: (payload.ref ? 'Комментарий к тренировке: ' : '') + snip(payload.text), tag: 'c-' + u.id, url: './?push=note' }
      : { k: 'program', title: cn, body: (resend ? 'Обновление программы: «' : 'Новая программа: «') + snip(payload.title) + '»', tag: 'c-' + u.id, url: './?push=program' }).catch(() => {});
    return { ok: true, itemId: Number(r.rows[0].id), eventId: ev.id };
  });

  // корректировка калорийной нормы клиента тренером: сдвиг в ккал, клиент получает событие и применяет в дневнике
  route('POST', /^\/v1\/coach\/clients\/([0-9a-f-]{36})\/norm$/, async ({ req, m, body }) => {
    const u = await auth(req); needCoach(u);
    const id = m[1];
    if (!(await activeLink(u.id, id))) throw new HttpError(403, 'not_your_client');
    const adj = Number(body && body.adj);
    if (!Number.isInteger(adj) || adj < -500 || adj > 500 || adj % 10) throw bad('bad_adj');
    const value = { adj, t: Date.now() };
    await db.query("INSERT INTO docs(user_id,key,rev,value) VALUES($1,'cnorm',1,$2::jsonb) ON CONFLICT (user_id,key) DO UPDATE SET rev=docs.rev+1, value=EXCLUDED.value, updated_at=now()", [id, JSON.stringify(value)]);
    await audit(u.id, 'coach.norm', id, { adj });
    const ev = await emitTx(id, 'coach.norm', value);
    return { ok: true, adj, eventId: ev.id };
  });

  route('DELETE', /^\/v1\/coach\/clients\/([0-9a-f-]{36})$/, async ({ req, m }) => {
    const u = await auth(req); needCoach(u);
    const r = await db.query("UPDATE links SET status='removed_by_coach', ended_at=now() WHERE coach_id=$1 AND client_id=$2 AND status='active' RETURNING id", [u.id, m[1]]);
    if (!r.rows.length) throw new HttpError(404, 'not_found');
    await audit(u.id, 'link.remove', m[1]);
    await emitTx(m[1], 'coach.removed', { coachId: u.id });
    await purgeIfNoBackup(db, m[1]);
    return { ok: true };
  });

  // Удаление аккаунта и всех данных (требование App Store).
  route('DELETE', /^\/v1\/account$/, async ({ req }) => {
    const u = await auth(req);
    const lk = (await db.query("SELECT coach_id FROM links WHERE client_id=$1 AND status='active'", [u.id])).rows;
    const cl = (await db.query("SELECT client_id FROM links WHERE coach_id=$1 AND status='active'", [u.id])).rows;
    await db.query('UPDATE users SET deleted_at=now(), device_id=NULL, email=NULL, phone=NULL, name=$2 WHERE id=$1', [u.id, '']);
    await db.query('DELETE FROM docs WHERE user_id=$1', [u.id]);
    await db.query('DELETE FROM sessions WHERE user_id=$1', [u.id]);
    await db.query('DELETE FROM weights WHERE user_id=$1', [u.id]);
    await db.query('DELETE FROM coach_items WHERE client_id=$1 OR coach_id=$1', [u.id]);
    await db.query("UPDATE links SET status=CASE WHEN client_id=$1 THEN 'revoked_by_client' ELSE 'removed_by_coach' END, ended_at=now() WHERE (client_id=$1 OR coach_id=$1) AND status='active'", [u.id]);
    await db.query('DELETE FROM coaches WHERE user_id=$1', [u.id]);
    await audit(u.id, 'account.delete', null);
    for (const r of lk) await emitTx(r.coach_id, 'client.unlinked', { clientId: u.id, by: 'deleted' });
    for (const r of cl) await emitTx(r.client_id, 'coach.removed', { coachId: u.id });
    kick(u.id, 'deleted');
    return { ok: true };
  });

  // ---------- вход по номеру телефона ----------
  // Код отправляет внешний канал (SMS, Telegram Gateway): интерфейс sms.send(phone, text). Хранится только HMAC кода.
  const normPhone = (raw) => {
    let d = String(raw || '').replace(/\D/g, '');
    if (d.length === 11 && d[0] === '8') d = '7' + d.slice(1);
    if (d.length === 10) d = '7' + d;                       // 9XXXXXXXXX → +7
    return d.length >= 8 && d.length <= 15 && !/^0/.test(d) ? '+' + d : null;
  };
  const otpHash = (phone, code) => crypto.createHmac('sha256', secret).update('otp:' + phone + ':' + code).digest('hex');
  let smsDay = { d: '', n: 0 };
  route('POST', /^\/v1\/auth\/phone\/start$/, async ({ req, body }) => {
    if (!phoneAuth) throw new HttpError(404, 'phone_login_disabled');
    const phone = normPhone(body.phone); if (!phone) throw bad('bad_phone');
    if (!lim.hit('otp:ip:' + ip(req), 10, 3600e3)) throw new HttpError(429, 'rate_limited', { retryAfterSec: 3600 });
    if (!lim.hit('otp:cool:' + phone, 1, 60e3)) throw new HttpError(429, 'wait', { retryAfterSec: 60 });
    if (!lim.hit('otp:ph:' + phone, 5, 3600e3)) throw new HttpError(429, 'rate_limited', { retryAfterSec: 3600 });
    const day = new Date().toISOString().slice(0, 10); if (smsDay.d !== day) smsDay = { d: day, n: 0 };
    const isDemo = demo && phone === demo.phone;
    if (!isDemo && ++smsDay.n > smsDailyCap) throw new HttpError(503, 'sms_cap');   // защита от накрутки платных SMS
    const code = isDemo ? demo.code : String(crypto.randomInt(0, 1000000)).padStart(6, '0');
    await db.query('UPDATE otps SET used=true WHERE phone=$1 AND NOT used', [phone]);
    await db.query("INSERT INTO otps(phone, code_hash, expires_at) VALUES($1,$2, now() + interval '5 minutes')", [phone, otpHash(phone, code)]);
    if (!isDemo) { try { await sms.send(phone, 'Forma: код входа ' + code + '. Никому не сообщайте.'); } catch (e) { log('sms', e); throw new HttpError(502, 'sms_failed'); } }
    return { ok: true, ttlSec: 300 };
  });
  route('POST', /^\/v1\/auth\/phone\/verify$/, async ({ req, body }) => {
    if (!phoneAuth) throw new HttpError(404, 'phone_login_disabled');
    const phone = normPhone(body.phone); const code = String(body.code || '').trim();
    if (!phone || !/^\d{6}$/.test(code)) throw bad('bad_code_format');
    if (!lim.hit('otpv:ip:' + ip(req), 30, 3600e3)) throw new HttpError(429, 'rate_limited');
    const o = (await db.query('SELECT id, code_hash, attempts FROM otps WHERE phone=$1 AND NOT used AND expires_at>now() ORDER BY id DESC LIMIT 1', [phone])).rows[0];
    if (!o) throw new HttpError(403, 'code_expired');
    if (o.attempts >= 5) { await db.query('UPDATE otps SET used=true WHERE id=$1', [o.id]); throw new HttpError(403, 'code_expired'); }
    const want = Buffer.from(o.code_hash, 'hex'), got = Buffer.from(otpHash(phone, code), 'hex');
    if (!crypto.timingSafeEqual(want, got)) {
      await db.query('UPDATE otps SET attempts=attempts+1 WHERE id=$1', [o.id]);
      throw new HttpError(403, 'bad_code', { attemptsLeft: Math.max(0, 4 - o.attempts) });
    }
    await db.query('UPDATE otps SET used=true WHERE id=$1', [o.id]);
    // кто входит: аккаунт с этим телефоном (вернулся после переустановки) или текущий гостевой аккаунт устройства, или новый
    let cur = null; const h = req.headers.authorization || '';
    if (h.startsWith('Bearer ')) cur = await userFromToken(h.slice(7));
    const owner = (await db.query('SELECT id, role FROM users WHERE phone=$1 AND deleted_at IS NULL', [phone])).rows[0];
    let uid, restored = false;
    if (owner) { uid = owner.id; restored = !cur || cur.id !== owner.id; }
    else if (cur) { await db.query('UPDATE users SET phone=$2 WHERE id=$1', [cur.id, phone]); uid = cur.id; }
    else { uid = crypto.randomUUID(); await db.query('INSERT INTO users(id, phone) VALUES($1,$2)', [uid, phone]); }
    const u = (await db.query('SELECT role FROM users WHERE id=$1', [uid])).rows[0];
    await audit(uid, 'phone.login', null, { restored });
    return { token: mint(uid), userId: uid, role: u.role, restored };   // restored: аккаунт найден по телефону, данные с сервера побеждают локальные пустые
  });

  // ---------- персональные промокоды программ ----------
  const CODE_RE = /^[A-ZА-ЯЁ0-9_-]{6,24}$/;
  const normCode = (c) => String(c || '').trim().toUpperCase().replace(/\s+/g, '');
  route('POST', /^\/v1\/coach\/codes$/, async ({ req, body }) => {
    const u = await auth(req); needCoach(u);
    let code = normCode(body.code);
    if (!code) { code = ''; const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; for (let i = 0; i < 10; i++) code += A[crypto.randomInt(A.length)]; }
    if (!CODE_RE.test(code)) throw bad('bad_promo', { hint: 'от 6 до 24 символов: буквы, цифры, - и _' });
    if (!body.program || typeof body.program !== 'object' || JSON.stringify(body.program).length > 100 * 1024) throw bad('bad_program');
    const days = Math.min(365, Math.max(1, parseInt(body.expiresDays, 10) || 30));
    const bp = body.bindPhone ? normPhone(body.bindPhone) : null; if (body.bindPhone && !bp) throw bad('bad_phone');
    try {
      const r = await db.query("INSERT INTO program_codes(coach_id,code,label,title,program,bind_phone,auto_link,expires_at) VALUES($1,$2,$3,$4,$5::jsonb,$6,$7, now() + ($8 || ' days')::interval) RETURNING id, expires_at",
        [u.id, code, String(body.label || '').slice(0, 80), String(body.title || body.program.name || '').slice(0, 120), JSON.stringify(body.program), bp, body.autoLink === true, String(days)]);
      await audit(u.id, 'promo.create', null, { id: Number(r.rows[0].id) });
      return { id: Number(r.rows[0].id), code, expiresAt: new Date(r.rows[0].expires_at).toISOString() };
    } catch (e) { if (/unique|duplicate/i.test(String(e.message))) throw new HttpError(409, 'code_taken'); throw e; }
  });
  route('GET', /^\/v1\/coach\/codes$/, async ({ req }) => {
    const u = await auth(req); needCoach(u);
    const r = await db.query("SELECT c.id, c.code, c.label, c.title, c.ver, c.status, c.bind_phone, c.auto_link, c.expires_at, c.redeemed_at, x.name AS client FROM program_codes c LEFT JOIN users x ON x.id=c.redeemed_by WHERE c.coach_id=$1 ORDER BY c.id DESC LIMIT 200", [u.id]);
    return { codes: r.rows.map((c) => ({ id: Number(c.id), code: c.code, label: c.label, title: c.title, ver: c.ver, status: c.status !== 'active' ? c.status : (new Date(c.expires_at) < new Date() ? 'expired' : 'active'), bindPhone: c.bind_phone, autoLink: c.auto_link, expiresAt: new Date(c.expires_at).toISOString(), redeemedAt: c.redeemed_at ? new Date(c.redeemed_at).toISOString() : null, client: c.client || null })) };
  });
  route('DELETE', /^\/v1\/coach\/codes\/(\d+)$/, async ({ req, m }) => {
    const u = await auth(req); needCoach(u);
    const r = await db.query("UPDATE program_codes SET status='revoked' WHERE id=$1 AND coach_id=$2 AND status='active' RETURNING id", [m[1], u.id]);
    if (!r.rows.length) throw new HttpError(404, 'not_found');
    return { ok: true };       // уже выданная программа у клиента остаётся: это его копия
  });
  // Тренер обновил программу: новая версия уходит клиенту, который уже ввёл код.
  route('PUT', /^\/v1\/coach\/codes\/(\d+)\/program$/, async ({ req, m, body }) => {
    const u = await auth(req); needCoach(u);
    if (!body.program || typeof body.program !== 'object' || JSON.stringify(body.program).length > 100 * 1024) throw bad('bad_program');
    const r = await db.query("UPDATE program_codes SET program=$3::jsonb, ver=ver+1, title=COALESCE(NULLIF($4,''), title) WHERE id=$1 AND coach_id=$2 AND status<>'revoked' RETURNING ver, redeemed_by, title", [m[1], u.id, JSON.stringify(body.program), String(body.title || '').slice(0, 120)]);
    if (!r.rows.length) throw new HttpError(404, 'not_found');
    const row = r.rows[0];
    if (row.redeemed_by) await emitTx(row.redeemed_by, 'coach.program', { codeId: Number(m[1]), ver: row.ver, update: true, title: row.title, program: body.program });
    return { ok: true, ver: row.ver, delivered: !!row.redeemed_by };
  });
  route('POST', /^\/v1\/redeem$/, async ({ req, body }) => {
    const u = await auth(req);
    if (u.role === 'coach') throw new HttpError(409, 'coach_cannot_redeem');
    if (!lim.hit('red:u:' + u.id, 8, 600e3) || !lim.hit('red:ip:' + ip(req), 40, 600e3)) throw new HttpError(429, 'rate_limited', { retryAfterSec: 600 });
    const code = normCode(body.code); if (!CODE_RE.test(code)) throw new HttpError(404, 'code_not_found');
    const out = await db.tx(async (t) => {
      const c = (await t.query('SELECT * FROM program_codes WHERE code=$1 FOR UPDATE', [code])).rows[0];
      if (!c) throw new HttpError(404, 'code_not_found');
      if (c.status === 'revoked') throw new HttpError(410, 'code_revoked');
      if (c.status === 'redeemed') { if (c.redeemed_by === u.id) return { again: true, c }; throw new HttpError(409, 'code_used'); }
      if (new Date(c.expires_at) < new Date()) throw new HttpError(410, 'code_expired');
      if (c.bind_phone) {
        const ph = (await t.query('SELECT phone FROM users WHERE id=$1', [u.id])).rows[0];
        if (!ph || ph.phone !== c.bind_phone) throw new HttpError(403, 'phone_mismatch');   // код выдан под другой номер
      }
      await t.query("UPDATE program_codes SET status='redeemed', redeemed_by=$2, redeemed_at=now() WHERE id=$1", [c.id, u.id]);
      const it = await t.query("INSERT INTO coach_items(coach_id,client_id,kind,payload) VALUES($1,$2,'program',$3::jsonb) RETURNING id", [c.coach_id, u.id, JSON.stringify({ title: c.title, program: c.program, codeId: Number(c.id), ver: c.ver })]);
      let linked = false, linkNote = null;
      if (c.auto_link) {
        if (body.consent !== CONSENT_V) linkNote = 'consent_required';
        else {
          const cur = (await t.query("SELECT coach_id FROM links WHERE client_id=$1 AND status='active'", [u.id])).rows[0];
          if (cur) linkNote = cur.coach_id === c.coach_id ? null : 'already_linked';
          if (cur && cur.coach_id === c.coach_id) linked = true;
          else if (!cur) { await t.query("INSERT INTO links(coach_id,client_id,status,consent_v) VALUES($1,$2,'active',$3)", [c.coach_id, u.id, CONSENT_V]); linked = true; }
        }
      }
      const evs = [[u.id, await emit(t, u.id, 'coach.program', { codeId: Number(c.id), ver: c.ver, title: c.title, program: c.program, source: 'code' })],
        [c.coach_id, await emit(t, c.coach_id, 'code.redeemed', { codeId: Number(c.id), label: c.label, clientId: u.id, linked })]];
      return { c, evs, linked, linkNote };
    });
    for (const [to, ev] of out.evs || []) deliver(to, ev);
    await audit(u.id, 'promo.redeem', out.c.coach_id, { id: Number(out.c.id) });
    return { ok: true, again: !!out.again, title: out.c.title, program: out.c.program, ver: out.c.ver, linked: !!out.linked, linkNote: out.linkNote || null };
  });

  route('GET', /^\/health$/, async () => { await db.query('SELECT 1'); return { ok: true }; });

  // ---------- HTTP ----------
  async function readBody(req) {
    const chunks = []; let n = 0;
    for await (const c of req) { n += c.length; if (n > MAX_BODY) throw new HttpError(413, 'body_too_large'); chunks.push(c); }
    if (!n) return {};
    try { const b = JSON.parse(Buffer.concat(chunks).toString('utf8')); return b && typeof b === 'object' ? b : {}; }
    catch { throw bad('bad_json'); }
  }
  async function handler(req, res) {
    const org = req.headers.origin, allow = !origins ? (org || '*') : (org && origins.includes(org) ? org : null);   // origins: список разрешённых адресов сайта; без него (dev) разрешено всё
    const cors = { ...(allow ? { 'access-control-allow-origin': allow } : {}), 'access-control-allow-headers': 'authorization,content-type', 'access-control-allow-methods': 'GET,POST,PUT,DELETE,OPTIONS', 'access-control-max-age': '600', vary: 'origin' };
    if (req.method === 'OPTIONS') { res.writeHead(204, cors); return res.end(); }
    const send = (status, obj, extra = {}) => { const s = JSON.stringify(obj); res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...cors, ...extra }); res.end(s); };
    try {
      const url = new URL(req.url, 'http://x');
      for (const r of routes) {
        if (r.method !== req.method) continue;
        const m = url.pathname.match(r.re); if (!m) continue;
        const body = req.method === 'GET' || req.method === 'DELETE' ? {} : await readBody(req);
        return send(200, await r.fn({ req, url, m, body }));
      }
      send(404, { error: 'not_found' });
    } catch (e) {
      if (e instanceof HttpError) {
        const extra = e.code === 'locked' || e.status === 429 ? { 'retry-after': String(e.extra?.retryAfterSec || 60) } : {};
        return send(e.status, { error: e.code, ...(e.extra || {}) }, extra);
      }
      log('error', e); send(500, { error: 'server_error' });
    }
  }

  // ---------- WebSocket ----------
  function attachWs(server) {
    const wss = new WebSocketServer({ noServer: true, maxPayload: 8 * 1024 });
    server.on('upgrade', (req, socket, head) => {
      if (!/^\/v1\/ws(\?|$)/.test(req.url)) { socket.destroy(); return; }
      wss.handleUpgrade(req, socket, head, (ws) => onConn(ws));
    });
    const beat = setInterval(() => { for (const set of sockets.values()) for (const ws of set) { if (ws.dead) { ws.terminate(); continue; } ws.dead = true; try { ws.ping(); } catch {} } }, 30e3);
    beat.unref?.();
    function onConn(ws) {
      ws.dead = false; ws.on('pong', () => { ws.dead = false; });
      let uid = null;
      const timer = setTimeout(() => { if (!uid) ws.close(4401, 'auth_timeout'); }, 5000);
      ws.on('message', async (raw) => {
        let m; try { m = JSON.parse(raw.toString()); } catch { return; }
        if (m.t === 'auth' && !uid) {
          const u = await userFromToken(m.token);
          if (!u) { ws.close(4401, 'unauthorized'); return; }
          uid = u.id; clearTimeout(timer);
          if (!sockets.has(uid)) sockets.set(uid, new Set());
          sockets.get(uid).add(ws);
          ws.send(JSON.stringify({ t: 'ready', role: u.role }));
          // повтор пропущенного: сначала всё после курсора, затем живые события
          const missed = await eventsSince(uid, Number.isInteger(m.since) ? m.since : 0, 500);
          for (const e of missed) ws.send(JSON.stringify({ t: 'event', ...e }));
        } else if (m.t === 'ping') ws.send(JSON.stringify({ t: 'pong' }));
      });
      ws.on('close', () => { clearTimeout(timer); if (uid) { const s = sockets.get(uid); if (s) { s.delete(ws); if (!s.size) sockets.delete(uid); } } });
      ws.on('error', () => {});
    }
    return { close: () => { clearInterval(beat); wss.close(); for (const set of sockets.values()) for (const ws of set) ws.terminate(); } };
  }

  return { handler, attachWs, emitTx, kick, notify, close: () => clearInterval(sweeper), _lim: lim };
}
