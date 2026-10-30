import crypto from 'node:crypto';

// Вход по номеру телефона без платных SMS и звонков:
//   1) Telegram-бот: человек вводит номер, открывается бот, кнопка «Поделиться номером»; сервер сверяет contact.user_id с автором сообщения и номер с введённым;
//   2) VK ID и Яндекс ID (OAuth): номер берётся из профиля провайдера.
// Профиль человека (анкета) хранится на сервере по номеру: GET/PUT /v1/me/profile.
// Всё выключено, пока не заданы ключи (см. server.js и deploy/README.md); без ключей маршруты отвечают 404.

const PROFILE_KEYS = ['name', 'sex', 'birth', 'h', 'w', 'bf', 'neck', 'waist', 'hip', 'act', 'fm', 'fz', 'goal', 'clar', 'where', 'eq', 'lvl', 'cau', 'cx', 'preg', 'hm', 'coach', 'rem'];
const PROFILE_MAX = 30 * 1024;
const rnd = (n) => crypto.randomBytes(n).toString('base64url');
const sha256b64u = (s) => crypto.createHash('sha256').update(s).digest('base64url');
const eqSecret = (a, b) => { const x = Buffer.from(String(a)), y = Buffer.from(String(b)); return x.length === y.length && crypto.timingSafeEqual(x, y); };

// Оставляем только известные поля анкеты, чужие ключи и мусор отбрасываем.
export function cleanProfile(p) {
  if (!p || typeof p !== 'object' || Array.isArray(p)) return null;
  const o = {};
  for (const k of PROFILE_KEYS) if (p[k] !== undefined) o[k] = p[k];
  if (typeof o.name === 'string') o.name = o.name.slice(0, 60);
  if (o.coach && typeof o.coach === 'object') o.coach = { mode: String(o.coach.mode || 'self').slice(0, 10), code: String(o.coach.code || '').slice(0, 12), name: String(o.coach.name || '').slice(0, 60) };
  const json = JSON.stringify(o);
  return json.length > PROFILE_MAX ? null : o;
}

export function installLogin({ db, route, auth, bad, HttpError, lim, ip, normPhone, phoneSession, audit, cfg = {}, log = () => {} }) {
  const tg = cfg.tg && cfg.tg.botName && cfg.tg.secret ? cfg.tg : null;
  const oa = cfg.oauth || {};
  const fetchFn = oa.fetch || globalThis.fetch;
  const redirect = oa.redirect || '';
  const providers = {
    vk: oa.vk && oa.vk.clientId && redirect ? oa.vk : null,
    yandex: oa.yandex && oa.yandex.clientId && oa.yandex.clientSecret && redirect ? oa.yandex : null,
  };

  // что включено: приложение по этому ответу рисует экран входа
  route('GET', /^\/v1\/auth\/methods$/, async () => ({ telegram: !!tg, vk: !!providers.vk, yandex: !!providers.yandex }));

  // ---------- Telegram ----------
  route('POST', /^\/v1\/auth\/tg\/start$/, async ({ req, body }) => {
    if (!tg) throw new HttpError(404, 'tg_disabled');
    const phone = normPhone(body.phone); if (!phone) throw bad('bad_phone');
    if (!lim.hit('tg:ip:' + ip(req), 20, 3600e3) || !lim.hit('tg:ph:' + phone, 6, 3600e3)) throw new HttpError(429, 'rate_limited', { retryAfterSec: 3600 });
    const nonce = rnd(16);
    await db.query("INSERT INTO tg_logins(nonce, phone, expires_at) VALUES($1,$2, now() + interval '10 minutes')", [nonce, phone]);
    return { nonce, url: 'https://t.me/' + tg.botName + '?start=' + nonce, ttlSec: 600 };
  });

  async function tgSend(chatId, text, markup) {
    if (!tg || !tg.api) return;
    try { await tg.api('sendMessage', { chat_id: chatId, text, ...(markup ? { reply_markup: markup } : {}) }); } catch (e) { log('tg send', e && e.message); }
  }
  // Webhook от Telegram. Адрес содержит секрет, чужие запросы получают 404.
  route('POST', /^\/v1\/tg\/hook\/([A-Za-z0-9_-]{16,64})$/, async ({ m, req, body }) => {
    if (!tg || !eqSecret(m[1], tg.secret)) throw new HttpError(404, 'not_found');
    const hdr = req.headers['x-telegram-bot-api-secret-token'];
    if (hdr !== undefined && !eqSecret(hdr, tg.secret)) throw new HttpError(404, 'not_found');
    const msg = body && body.message; if (!msg || !msg.from || !msg.chat) return { ok: true };
    const chat = String(msg.chat.id), from = String(msg.from.id);
    if (msg.chat.type !== 'private') return { ok: true };
    const start = typeof msg.text === 'string' && msg.text.match(/^\/start(?:\s+([A-Za-z0-9_-]{16,64}))?$/);
    if (start) {
      const nonce = start[1];
      if (!nonce) { await tgSend(chat, 'Это бот входа в Forma. Откройте приложение и нажмите «Далее» после ввода номера.'); return { ok: true }; }
      const r = await db.query("UPDATE tg_logins SET chat_id=$2, from_id=$3 WHERE nonce=$1 AND status='wait' AND expires_at>now() RETURNING nonce", [nonce, chat, from]);
      if (!r.rows.length) { await tgSend(chat, 'Ссылка устарела. Вернитесь в Forma и нажмите «Далее» ещё раз.'); return { ok: true }; }
      await tgSend(chat, 'Чтобы подтвердить вход в Forma, нажмите кнопку «Поделиться номером».', { keyboard: [[{ text: 'Поделиться номером', request_contact: true }]], resize_keyboard: true, one_time_keyboard: true });
      return { ok: true };
    }
    if (msg.contact) {
      // номер принимается только свой: contact.user_id совпадает с автором сообщения
      if (String(msg.contact.user_id || '') !== from) { await tgSend(chat, 'Поделитесь именно своим номером кнопкой ниже.'); return { ok: true }; }
      const row = (await db.query("SELECT nonce, phone FROM tg_logins WHERE chat_id=$1 AND from_id=$2 AND status='wait' AND expires_at>now() ORDER BY created_at DESC LIMIT 1", [chat, from])).rows[0];
      if (!row) { await tgSend(chat, 'Нет ожидающего входа. Вернитесь в Forma и нажмите «Далее».', { remove_keyboard: true }); return { ok: true }; }
      const shared = normPhone(msg.contact.phone_number);
      if (shared && shared === row.phone) {
        await db.query("UPDATE tg_logins SET status='ok', tg_phone=$2 WHERE nonce=$1 AND status='wait'", [row.nonce, shared]);
        await tgSend(chat, 'Готово. Вернитесь в Forma.', { remove_keyboard: true });
      } else {
        await db.query("UPDATE tg_logins SET status='mismatch' WHERE nonce=$1 AND status='wait'", [row.nonce]);
        await tgSend(chat, 'Номер в Telegram не совпал с введённым в Forma. Вернитесь в приложение и проверьте номер.', { remove_keyboard: true });
      }
      return { ok: true };
    }
    return { ok: true };
  });

  route('POST', /^\/v1\/auth\/tg\/check$/, async ({ req, body }) => {
    if (!tg) throw new HttpError(404, 'tg_disabled');
    const nonce = typeof body.nonce === 'string' && /^[A-Za-z0-9_-]{16,64}$/.test(body.nonce) ? body.nonce : null; if (!nonce) throw bad('bad_nonce');
    if (!lim.hit('tgc:ip:' + ip(req), 400, 600e3)) throw new HttpError(429, 'rate_limited', { retryAfterSec: 60 });
    const row = (await db.query('SELECT status, tg_phone, (expires_at > now()) AS live FROM tg_logins WHERE nonce=$1', [nonce])).rows[0];
    if (!row || !row.live || row.status === 'used') throw new HttpError(410, 'expired');
    if (row.status === 'mismatch') throw new HttpError(403, 'mismatch');
    if (row.status !== 'ok') return { status: 'wait' };
    const taken = await db.query("UPDATE tg_logins SET status='used' WHERE nonce=$1 AND status='ok' RETURNING tg_phone", [nonce]);   // одноразово
    if (!taken.rows.length) throw new HttpError(410, 'expired');
    return { status: 'ok', ...(await phoneSession(req, taken.rows[0].tg_phone, 'telegram')) };
  });

  // ---------- VK ID и Яндекс ID ----------
  route('POST', /^\/v1\/auth\/oauth\/start$/, async ({ req, body }) => {
    const p = body.provider === 'vk' || body.provider === 'yandex' ? body.provider : null; if (!p) throw bad('bad_provider');
    const cf = providers[p]; if (!cf) throw new HttpError(404, 'provider_disabled');
    if (!lim.hit('oa:ip:' + ip(req), 30, 3600e3)) throw new HttpError(429, 'rate_limited', { retryAfterSec: 3600 });
    const state = rnd(24), verifier = p === 'vk' ? rnd(48) : null;
    await db.query("INSERT INTO oauth_states(state, provider, verifier, expires_at) VALUES($1,$2,$3, now() + interval '15 minutes')", [state, p, verifier]);
    const q = new URLSearchParams(p === 'vk'
      ? { response_type: 'code', client_id: String(cf.clientId), redirect_uri: redirect, state, code_challenge: sha256b64u(verifier), code_challenge_method: 'S256', scope: 'phone' }
      : { response_type: 'code', client_id: String(cf.clientId), redirect_uri: redirect, state, scope: 'login:default_phone' });
    return { url: (p === 'vk' ? 'https://id.vk.com/authorize?' : 'https://oauth.yandex.ru/authorize?') + q, state };
  });

  async function post(url, form, headers = {}) {
    const r = await fetchFn(url, { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded', ...headers }, body: new URLSearchParams(form), signal: AbortSignal.timeout(10000) });
    const j = await r.json().catch(() => ({})); if (!r.ok) { log('oauth http', url, r.status, JSON.stringify(j).slice(0, 200)); throw new HttpError(502, 'provider_failed'); } return j;
  }
  async function vkPhone(cf, code, verifier, deviceId, state) {
    const t = await post('https://id.vk.com/oauth2/auth', { grant_type: 'authorization_code', code, code_verifier: verifier, redirect_uri: redirect, client_id: String(cf.clientId), device_id: deviceId, state });
    if (!t.access_token) throw new HttpError(502, 'provider_failed');
    const u = await post('https://id.vk.com/oauth2/user_info', { client_id: String(cf.clientId), access_token: t.access_token });
    return u && u.user && u.user.phone;
  }
  async function yandexPhone(cf, code) {
    const t = await post('https://oauth.yandex.ru/token', { grant_type: 'authorization_code', code, client_id: String(cf.clientId), client_secret: String(cf.clientSecret) });
    if (!t.access_token) throw new HttpError(502, 'provider_failed');
    const r = await fetchFn('https://login.yandex.ru/info?format=json', { headers: { authorization: 'OAuth ' + t.access_token }, signal: AbortSignal.timeout(10000) });
    const j = await r.json().catch(() => ({})); if (!r.ok) throw new HttpError(502, 'provider_failed');
    return j && j.default_phone && j.default_phone.number;
  }
  route('POST', /^\/v1\/auth\/oauth\/finish$/, async ({ req, body }) => {
    const state = typeof body.state === 'string' && /^[A-Za-z0-9_-]{16,80}$/.test(body.state) ? body.state : null;
    const code = typeof body.code === 'string' && body.code.length > 0 && body.code.length < 2000 ? body.code : null;
    if (!state || !code) throw bad('bad_oauth');
    if (!lim.hit('oaf:ip:' + ip(req), 30, 3600e3)) throw new HttpError(429, 'rate_limited', { retryAfterSec: 3600 });
    const st = (await db.query('DELETE FROM oauth_states WHERE state=$1 RETURNING provider, verifier, (expires_at > now()) AS live', [state])).rows[0];   // одноразово
    if (!st || !st.live) throw new HttpError(410, 'expired');
    const cf = providers[st.provider]; if (!cf) throw new HttpError(404, 'provider_disabled');
    const raw = st.provider === 'vk'
      ? await vkPhone(cf, code, st.verifier, typeof body.deviceId === 'string' ? body.deviceId.slice(0, 200) : '', state)
      : await yandexPhone(cf, code);
    const phone = normPhone(raw);
    if (!phone) throw new HttpError(422, 'no_phone');   // провайдер не отдал номер: человек не разрешил или номера нет в аккаунте
    return { ...(await phoneSession(req, phone, st.provider)) };
  });

  // ---------- анкета по номеру ----------
  route('GET', /^\/v1\/me\/profile$/, async ({ req }) => {
    const u = await auth(req);
    const r = (await db.query('SELECT phone, pprofile, pprofile_at FROM users WHERE id=$1', [u.id])).rows[0];
    return { phone: r.phone || null, profile: r.pprofile || null, at: r.pprofile_at ? new Date(r.pprofile_at).toISOString() : null };
  });
  route('PUT', /^\/v1\/me\/profile$/, async ({ req, body }) => {
    const u = await auth(req);
    const has = (await db.query('SELECT phone FROM users WHERE id=$1', [u.id])).rows[0];
    if (!has || !has.phone) throw new HttpError(403, 'phone_required');
    const p = cleanProfile(body.profile); if (!p) throw bad('bad_profile');
    await db.query('UPDATE users SET pprofile=$2::jsonb, pprofile_at=now() WHERE id=$1', [u.id, JSON.stringify(p)]);
    if (typeof p.name === 'string' && p.name) await db.query('UPDATE users SET name=$2 WHERE id=$1', [u.id, p.name]);
    return { ok: true };
  });
}
