import http from 'node:http';
import assert from 'node:assert/strict';
import { WebSocket } from 'ws';
import { createApp } from '../src/app.js';
import { memDb, pgPool } from '../src/db.js';
import { hashCode } from '../src/auth.js';

// TEST_DATABASE_URL=postgres://... прогоняет те же проверки на настоящем PostgreSQL (схема пересоздаётся)
let db;
if (process.env.TEST_DATABASE_URL) {
  const { default: pg } = await import('pg'); const c = new pg.Client({ connectionString: process.env.TEST_DATABASE_URL }); await c.connect();
  await c.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public'); await c.end(); db = await pgPool(process.env.TEST_DATABASE_URL);
} else db = await memDb();
let lastSms = null; const pushed = [];
const mockPush = { publicKey: 'PUBKEY', send: async (s, p) => { if (s.endpoint.includes('/gone/')) { const e = new Error('gone'); e.gone = true; throw e; } pushed.push({ s, p }); } };
const app = createApp({ db, secret: 'x'.repeat(40), sms: { send: async (p, t) => { lastSms = { p, t }; } }, demo: { phone: '+79990000000', code: '123456' }, phoneAuth: true, push: mockPush });
const server = http.createServer(app.handler); const wsh = app.attachWs(server);
await new Promise((r) => server.listen(0, r));
const base = 'http://127.0.0.1:' + server.address().port;
const CODE = 'Test-Coach-Code-1';
const { salt, hash } = hashCode(CODE);
await db.query('INSERT INTO coach_codes(label,salt,hash,max_uses) VALUES($1,$2,$3,2)', ['test', salt, hash]);

async function api(method, path, token, body) {
  const r = await fetch(base + path, { method, headers: { 'content-type': 'application/json', ...(token ? { authorization: 'Bearer ' + token } : {}) }, body: body ? JSON.stringify(body) : undefined });
  return { s: r.status, b: await r.json() };
}
const dev = async (n) => { const r = await api('POST', '/v1/auth/device', null, { deviceId: ('dev' + n).padEnd(20, 'x') }); assert.equal(r.s, 200); return r.b; };
function wsOpen(token, since = 0) {
  return new Promise((res) => {
    const ws = new WebSocket(base.replace('http', 'ws') + '/v1/ws'); const got = [];
    ws.on('open', () => ws.send(JSON.stringify({ t: 'auth', token, since })));
    ws.on('message', (m) => { const o = JSON.parse(m); if (o.t === 'ready') res({ ws, got }); else got.push(o); });
  });
}
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const until = async (f, ms = 1500) => { const t = Date.now(); while (Date.now() - t < ms) { if (f()) return true; await wait(10); } return false; };
let n = 0; const ok = (name) => console.log('  ✓ ' + name + ' (' + ++n + ')');

// 1. вход устройства, идемпотентность
const A = await dev(1); const A2 = await dev(1);
assert.equal(A.userId, A2.userId); assert.equal(A.role, 'client'); ok('устройство получает один и тот же аккаунт');
assert.equal((await api('GET', '/v1/me')).s, 401); assert.equal((await api('GET', '/v1/me', 'bad.token')).s, 401); ok('без токена и с подделкой: 401');

// 2. код тренера
let r = await api('POST', '/v1/coach/claim', A.token, { code: 'wrong-code-1' });
assert.equal(r.s, 403); assert.equal(r.b.error, 'bad_code'); assert.equal(r.b.attemptsLeft, 4); ok('неверный код: 403 и счётчик попыток');
r = await api('POST', '/v1/coach/claim', A.token, { code: CODE.toLowerCase() });
assert.equal(r.s, 403); ok('регистр кода важен');
for (let i = 0; i < 3; i++) await api('POST', '/v1/coach/claim', A.token, { code: 'wrong-code-' + i });
r = await api('POST', '/v1/coach/claim', A.token, { code: CODE });
assert.equal(r.s, 429); assert.equal(r.b.error, 'locked'); ok('после 5 ошибок блокировка, даже верный код не проходит');
const B = await dev(2);
r = await api('POST', '/v1/coach/claim', B.token, { code: CODE, displayName: 'Валерий' });
assert.equal(r.s, 200); assert.equal(r.b.role, 'coach'); assert.match(r.b.invite, /^[A-Z2-9]{8}$/); const INV = r.b.invite;
assert.equal((await api('GET', '/v1/me', B.token)).b.role, 'coach'); ok('верный код: роль тренера и приглашение клиентам');
r = await api('POST', '/v1/coach/claim', B.token, { code: CODE }); assert.equal(r.s, 200); assert.equal(r.b.invite, INV); ok('повторный ввод тем же тренером идемпотентен');
assert.equal((await api('GET', '/v1/coach/clients', A.token)).s, 403); ok('клиент не попадает в методы тренера');

// 3. привязка клиента, realtime тренеру
const C = await dev(3);
const wB = await wsOpen(B.token);
r = await api('POST', '/v1/link', C.token, { code: INV }); assert.equal(r.s, 400); assert.equal(r.b.error, 'consent_required'); ok('привязка без согласия отклонена');
assert.equal((await api('POST', '/v1/link', C.token, { code: 'ZZZZZZZZ', consent: 'v1' })).s, 404); ok('несуществующий код: 404');
r = await api('POST', '/v1/sync', C.token, { docs: { profile: { rev: 0, value: { name: 'Анна', w: 62 } } } }); assert.equal(r.s, 403); assert.equal(r.b.error, 'sync_not_enabled'); ok('клиент без тренера и без включённой копии: данные на сервер не принимаются');
r = await api('POST', '/v1/link', C.token, { code: inv(INV), consent: 'v1' });
function inv(x) { return ' ' + x.toLowerCase() + ' '; }
assert.equal(r.s, 200); ok('привязка по коду (регистр и пробелы не важны)');
await api('POST', '/v1/sync', C.token, { docs: { profile: { rev: 0, value: { name: 'Анна', w: 62 } } } });
assert.ok(await until(() => wB.got.some((e) => e.type === 'client.linked'))); ok('тренер увидел подключение в реальном времени');
const D = await dev(4);
assert.equal((await api('POST', '/v1/link', C.token, { code: INV, consent: 'v1' })).b.again, true); ok('повторная привязка к тому же тренеру безопасна');

// 4. синхронизация клиента → тренер мгновенно
const t0 = Date.now(); wB.got.length = 0;
const sess = { id: 's1', d: new Date().toISOString().slice(0, 10), name: 'Ноги', ex: [{ id: 'sq', pain: 1 }] };
r = await api('POST', '/v1/sync', C.token, { sessions: [sess], weights: [{ d: sess.d, v: 61.4 }] });
assert.equal(r.s, 200); assert.equal(r.b.sessions, 1);
assert.ok(await until(() => wB.got.some((e) => e.type === 'client.updated' && e.payload.sessions === 1)));
ok('тренер получил обновление клиента за ' + (Date.now() - t0) + ' мс');
r = await api('POST', '/v1/sync', C.token, { sessions: [sess] }); assert.equal(r.b.sessions, 0);
await wait(100); assert.equal(wB.got.filter((e) => e.type === 'client.updated').length, 1); ok('повторная отправка той же тренировки не дублируется и не шумит');
r = await api('GET', '/v1/coach/clients', B.token);
const row = r.b.clients[0]; assert.equal(row.name, 'Анна'); assert.equal(row.n7, 1); assert.equal(row.pain7, 1); assert.equal(row.weight, 61.4); ok('список клиентов: имя, неделя, сигнал боли, вес');
r = await api('GET', '/v1/coach/clients/' + C.userId, B.token); assert.equal(r.b.sessions.length, 1); assert.equal(r.b.docs.profile.value.name, 'Анна'); ok('карточка клиента с историей');
assert.equal((await api('GET', '/v1/coach/clients/' + D.userId, B.token)).s, 403); ok('чужой (не привязанный) клиент недоступен');

// 5. конфликты версий документа
r = await api('POST', '/v1/sync', C.token, { docs: { profile: { rev: 1, value: { name: 'Анна', w: 61 } } } }); assert.deepEqual(r.b.docs.profile, { rev: 2 });
r = await api('POST', '/v1/sync', C.token, { docs: { profile: { rev: 1, value: { name: 'Устар', w: 1 } } } }); assert.deepEqual(r.b.conflicts, ['profile']); assert.equal(r.b.docs.profile.value.w, 61); ok('устаревшая версия профиля: конфликт, сервер отдаёт актуальную');
assert.equal((await api('POST', '/v1/sync', C.token, { docs: { evil: { rev: 0, value: {} } } })).s, 400); ok('неизвестный ключ документа отклонён');
assert.equal((await api('POST', '/v1/sync', C.token, { sessions: [{ id: 'x', d: 'вчера' }] })).s, 400); ok('кривая дата тренировки отклонена');
assert.equal((await api('POST', '/v1/sync', C.token, { weights: [{ d: sess.d, v: 5 }] })).s, 400); ok('нереальный вес отклонён');

// 6. заметка и программа тренера → клиент (онлайн и после обрыва)
const wC = await wsOpen(C.token);
r = await api('POST', '/v1/coach/clients/' + C.userId + '/notes', B.token, { text: 'Следи за коленом' }); assert.equal(r.s, 200);
assert.ok(await until(() => wC.got.some((e) => e.type === 'coach.note' && e.payload.text === 'Следи за коленом'))); ok('заметка тренера дошла клиенту онлайн');
wC.ws.close(); await wait(50);
r = await api('POST', '/v1/coach/clients/' + C.userId + '/programs', B.token, { program: { name: 'Низ тела', days: [] } }); assert.equal(r.s, 200);
r = await api('POST', '/v1/sync', C.token, { since: 0 }); assert.ok(r.b.events.some((e) => e.type === 'coach.program')); ok('программа тренера получена после возвращения в сеть (по курсору)');
const last = r.b.cursor; const w2 = await wsOpen(C.token, last); await wait(100); assert.equal(w2.got.length, 0); ok('повтор по курсору не дублирует уже полученное');
assert.equal((await api('POST', '/v1/coach/clients/' + D.userId + '/notes', B.token, { text: 'hi' })).s, 403); ok('чужому клиенту заметку отправить нельзя');
assert.equal((await api('POST', '/v1/coach/clients/' + C.userId + '/notes', B.token, { text: ' ' })).s, 400); ok('пустая заметка отклонена');

// 7. отзыв доступа клиентом
wB.got.length = 0;
r = await api('DELETE', '/v1/link', C.token); assert.equal(r.b.was, true);
assert.ok(await until(() => wB.got.some((e) => e.type === 'client.unlinked'))); ok('отзыв клиентом: тренер получил событие');
assert.equal((await api('GET', '/v1/coach/clients/' + C.userId, B.token)).s, 403); assert.equal((await api('GET', '/v1/coach/clients', B.token)).b.clients.length, 0); ok('после отзыва данные клиента закрыты для тренера сразу');
r = await api('POST', '/v1/sync', C.token, { sessions: [{ id: 's2', d: sess.d }] }); assert.equal(r.b.error, 'sync_not_enabled'); await wait(100);
assert.equal(wB.got.filter((e) => e.type === 'client.updated').length, 0); ok('после отзыва тренер не получает обновления клиента, сервер новые данные не принимает');
assert.equal((await db.query('SELECT (SELECT count(*) FROM docs WHERE user_id=$1)+(SELECT count(*) FROM sessions WHERE user_id=$1)+(SELECT count(*) FROM weights WHERE user_id=$1) AS n', [C.userId])).rows[0].n | 0, 0); ok('после отзыва данные клиента удалены с сервера (основная копия остаётся на телефоне)');

// 8. тренер убирает клиента, смена тренера
await api('POST', '/v1/link', C.token, { code: INV, consent: 'v1' });
const E = await dev(5); const rr = await api('POST', '/v1/coach/claim', E.token, { code: CODE, displayName: 'Второй' }); assert.equal(rr.s, 200);
r = await api('POST', '/v1/link', C.token, { code: rr.b.invite, consent: 'v1' }); assert.equal(r.s, 409); assert.equal(r.b.error, 'already_linked'); ok('второго тренера без отвязки от первого не подключить');
assert.equal((await api('DELETE', '/v1/coach/clients/' + C.userId, B.token)).s, 200);
assert.equal((await api('POST', '/v1/link', C.token, { code: rr.b.invite, consent: 'v1' })).s, 200); ok('тренер убрал клиента, клиент перешёл ко второму');
const F = await dev(6); r = await api('POST', '/v1/coach/claim', F.token, { code: CODE }); assert.equal(r.b.error, 'code_used'); ok('лимит устройств на код: третье устройство отклонено');
assert.equal((await api('POST', '/v1/link', E.token, { code: INV, consent: 'v1' })).b.error, 'coach_cannot_be_client'); ok('тренер не может быть клиентом');

// 9. отзыв кода тренера и удаление аккаунта
await db.query("UPDATE coach_codes SET revoked_at=now()"); const D2 = await dev(7);
r = await api('POST', '/v1/coach/claim', D2.token, { code: CODE }); assert.equal(r.s, 403); ok('отозванный код не работает');
const wCc = await wsOpen(C.token); const wE = await wsOpen(E.token); wE.got.length = 0;
r = await api('DELETE', '/v1/account', C.token); assert.equal(r.s, 200);
assert.ok(await until(() => wE.got.some((e) => e.type === 'client.unlinked' && e.payload.by === 'deleted'))); ok('удаление аккаунта клиента: тренеру пришло событие');
assert.equal((await api('GET', '/v1/me', C.token)).s, 401); ok('удалённый аккаунт: токен больше не работает');
assert.equal((await db.query('SELECT count(*)::int AS n FROM sessions WHERE user_id=$1', [C.userId])).rows[0].n | 0, 0); ok('данные клиента удалены из базы');

// 10. сокеты: без авторизации закрывается
const lone = await new Promise((res) => { const ws = new WebSocket(base.replace('http', 'ws') + '/v1/ws'); ws.on('close', (c) => res(c)); ws.on('open', () => ws.send(JSON.stringify({ t: 'auth', token: 'bad' }))); });
assert.equal(lone, 4401); ok('сокет с поддельным токеном закрыт');
await api('POST', '/v1/me/backup', E.token, { on: true });
assert.equal((await api('POST', '/v1/sync', E.token, { docs: { profile: { rev: 0, value: { x: 'x'.repeat(210000) } } } })).s, 413); ok('слишком большой документ: 413');

// 11. вход по телефону
r = await api('POST', '/v1/auth/phone/start', null, { phone: '123' }); assert.equal(r.s, 400); ok('кривой номер отклонён');
r = await api('POST', '/v1/auth/phone/start', null, { phone: '8 (916) 123-45-67' }); assert.equal(r.s, 200);
assert.equal(lastSms.p, '+79161234567'); const otp1 = lastSms.t.match(/\d{6}/)[0]; ok('номер нормализуется к +7…, код ушёл в SMS');
assert.equal((await api('POST', '/v1/auth/phone/start', null, { phone: '+79161234567' })).b.error, 'wait'); ok('повторная отправка раньше чем через минуту запрещена');
r = await api('POST', '/v1/auth/phone/verify', null, { phone: '+79161234567', code: otp1 === '000000' ? '111111' : '000000' }); assert.equal(r.s, 403); assert.equal(r.b.attemptsLeft, 4); ok('неверный код входа: 403 и счётчик');
const G = await dev(8);
r = await api('POST', '/v1/auth/phone/verify', G.token, { phone: '+79161234567', code: otp1 }); assert.equal(r.s, 200); assert.equal(r.b.userId, G.userId); assert.equal(r.b.restored, false); ok('телефон привязан к текущему аккаунту устройства');
assert.equal((await api('POST', '/v1/auth/phone/verify', null, { phone: '+79161234567', code: otp1 })).s, 403); ok('использованный код повторно не работает');
// новая установка, тот же телефон: вернулся тот же аккаунт
lim_reset();
function lim_reset() { app._lim.reset('otp:cool:+79161234567'); }
await api('POST', '/v1/auth/phone/start', null, { phone: '+7 916 123 45 67' }); const otp2 = lastSms.t.match(/\d{6}/)[0];
const G2 = await dev(9);
r = await api('POST', '/v1/auth/phone/verify', G2.token, { phone: '+79161234567', code: otp2 }); assert.equal(r.b.userId, G.userId); assert.equal(r.b.restored, true); ok('после переустановки вход по телефону возвращает прежний аккаунт');
// тренер восстанавливает роль по телефону
// бриут-форс кода входа: 5 неверных и код сгорает
app._lim.reset('otp:cool:+79165550000'); await api('POST', '/v1/auth/phone/start', null, { phone: '+79165550000' }); const otp3 = lastSms.t.match(/\d{6}/)[0]; const wrong = otp3 === '999999' ? '888888' : '999999';
for (let i = 0; i < 5; i++) await api('POST', '/v1/auth/phone/verify', null, { phone: '+79165550000', code: wrong });
r = await api('POST', '/v1/auth/phone/verify', null, { phone: '+79165550000', code: otp3 }); assert.equal(r.s, 403); assert.equal(r.b.error, 'code_expired'); ok('после 5 неверных вводов код сгорает, верный уже не принимается');
lastSms = null; r = await api('POST', '/v1/auth/phone/start', null, { phone: '+79990000000' }); assert.equal(r.s, 200); assert.equal(lastSms, null);
r = await api('POST', '/v1/auth/phone/verify', null, { phone: '+79990000000', code: '123456' }); assert.equal(r.s, 200); ok('демо-номер для проверки App Store работает без SMS');

// 12. персональные промокоды программ
await db.query("UPDATE coach_codes SET revoked_at=NULL, max_uses=10");
const T = await dev(11); r = await api('POST', '/v1/coach/claim', T.token, { code: CODE, displayName: 'Валерий' }); assert.equal(r.s, 200);
const P1 = { name: 'Ноги дома', days: [{ ex: ['sq'] }] };
app._lim.reset('otp:cool:+79160001122'); await api('POST', '/v1/auth/phone/start', null, { phone: '+79160001122' }); const otp5 = lastSms.t.match(/\d{6}/)[0];
await api('POST', '/v1/auth/phone/verify', T.token, { phone: '+79160001122', code: otp5 });
app._lim.reset('otp:cool:+79160001122'); await api('POST', '/v1/auth/phone/start', null, { phone: '+79160001122' }); const otp6 = lastSms.t.match(/\d{6}/)[0];
const T2 = await dev(17); r = await api('POST', '/v1/auth/phone/verify', T2.token, { phone: '+79160001122', code: otp6 });
assert.equal(r.b.userId, T.userId); assert.equal(r.b.role, 'coach'); ok('тренер после переустановки входит по телефону и сразу получает роль и своих клиентов');
assert.equal((await api('POST', '/v1/coach/codes', G.token, { code: 'anna-legs-1', program: P1 })).s, 403); ok('клиент не создаёт промокоды');
r = await api('POST', '/v1/coach/codes', T.token, { code: 'anna-legs-1', label: 'Анна, ноги', program: P1 }); assert.equal(r.s, 200); assert.equal(r.b.code, 'ANNA-LEGS-1'); const pid = r.b.id; ok('тренер придумал код для клиента (хранится в верхнем регистре)');
assert.equal((await api('POST', '/v1/coach/codes', T.token, { code: 'ANNA-LEGS-1', program: P1 })).s, 409); ok('занятый код: 409');
assert.equal((await api('POST', '/v1/coach/codes', T.token, { code: 'abc', program: P1 })).s, 400); ok('слишком короткий код отклонён');
r = await api('POST', '/v1/coach/codes', T.token, { program: P1 }); assert.match(r.b.code, /^[A-Z2-9]{10}$/); ok('без кода сервер генерирует случайный');
const K = await dev(12); const wK = await wsOpen(K.token); const wT = await wsOpen(T.token);
r = await api('POST', '/v1/redeem', K.token, { code: ' anna-legs-1 ' }); assert.equal(r.s, 200); assert.equal(r.b.program.name, 'Ноги дома');
assert.ok(await until(() => wK.got.some((e) => e.type === 'coach.program' && e.payload.source === 'code' && e.payload.program.name === 'Ноги дома'))); ok('клиент ввёл код: программа пришла в приложение (событие в «Мои»)');
assert.ok(await until(() => wT.got.some((e) => e.type === 'code.redeemed' && e.payload.label === 'Анна, ноги'))); ok('тренер увидел, что код активирован');
assert.equal((await api('POST', '/v1/redeem', K.token, { code: 'ANNA-LEGS-1' })).b.again, true); ok('повторный ввод тем же клиентом безопасен');
const K2 = await dev(13); r = await api('POST', '/v1/redeem', K2.token, { code: 'ANNA-LEGS-1' }); assert.equal(r.s, 409); ok('код одноразовый: у другого человека не работает');
wK.got.length = 0; r = await api('PUT', '/v1/coach/codes/' + pid + '/program', T.token, { program: { name: 'Ноги дома v2', days: [] } }); assert.equal(r.b.delivered, true);
assert.ok(await until(() => wK.got.some((e) => e.payload.update && e.payload.ver === 2))); ok('тренер обновил программу: клиент получил версию 2');
r = await api('GET', '/v1/coach/codes', T.token); assert.equal(r.b.codes.find((c) => c.id === pid).status, 'redeemed'); ok('список кодов тренера со статусами');
r = await api('POST', '/v1/coach/codes', T.token, { code: 'REVOKE-ME-1', program: P1 }); await api('DELETE', '/v1/coach/codes/' + r.b.id, T.token);
assert.equal((await api('POST', '/v1/redeem', K2.token, { code: 'REVOKE-ME-1' })).s, 410); ok('отозванный код: 410');
r = await api('POST', '/v1/coach/codes', T.token, { code: 'OLD-CODE-1', program: P1 }); await db.query("UPDATE program_codes SET expires_at=now()-interval '1 day' WHERE code='OLD-CODE-1'");
assert.equal((await api('POST', '/v1/redeem', K2.token, { code: 'OLD-CODE-1' })).s, 410); ok('просроченный код: 410');
// привязка к телефону
await api('POST', '/v1/coach/codes', T.token, { code: 'ONLY-FOR-OLGA', program: P1, bindPhone: '8 916 777 00 11' });
const L = await dev(14); r = await api('POST', '/v1/redeem', L.token, { code: 'ONLY-FOR-OLGA' }); assert.equal(r.s, 403); assert.equal(r.b.error, 'phone_mismatch'); ok('код, выданный под номер, у чужого человека не работает (даже если подобран)');
app._lim.reset('otp:cool:+79167770011'); await api('POST', '/v1/auth/phone/start', null, { phone: '+79167770011' }); const otp4 = lastSms.t.match(/\d{6}/)[0];
await api('POST', '/v1/auth/phone/verify', L.token, { phone: '+79167770011', code: otp4 });
assert.equal((await api('POST', '/v1/redeem', L.token, { code: 'ONLY-FOR-OLGA' })).s, 200); ok('тот же код у клиента с нужным телефоном работает');
// подключение вместе с кодом
await api('POST', '/v1/coach/codes', T.token, { code: 'LINK-AND-GO-1', program: P1, autoLink: true });
const M = await dev(15); r = await api('POST', '/v1/redeem', M.token, { code: 'LINK-AND-GO-1' }); assert.equal(r.b.linked, false); assert.equal(r.b.linkNote, 'consent_required');
ok('программа выдана, а подключение к тренеру без согласия не произошло');
await api('POST', '/v1/coach/codes', T.token, { code: 'LINK-AND-GO-2', program: P1, autoLink: true });
const M2 = await dev(16); r = await api('POST', '/v1/redeem', M2.token, { code: 'LINK-AND-GO-2', consent: 'v1' }); assert.equal(r.b.linked, true);
assert.ok((await api('GET', '/v1/coach/clients', T.token)).b.clients.some((c) => c.id === M2.userId)); ok('код с подключением и согласием: клиент появился у тренера');
assert.equal((await api('POST', '/v1/redeem', T.token, { code: 'ANNA-LEGS-1' })).s, 409); ok('тренер не вводит промокоды как клиент');
let lastS = 0; for (let i = 0; i < 9; i++) lastS = (await api('POST', '/v1/redeem', K2.token, { code: 'GUESS-' + i + 'ABC' })).s;
assert.equal(lastS, 429); ok('перебор кодов ограничен: 8 попыток за 10 минут');

// 13. облачная копия по желанию клиента
const Q = await dev(18);
assert.equal((await api('POST', '/v1/sync', Q.token, { weights: [{ d: sess.d, v: 70 }] })).s, 403);
r = await api('POST', '/v1/me/backup', Q.token, { on: true }); assert.equal(r.b.backup, true);
assert.equal((await api('POST', '/v1/sync', Q.token, { weights: [{ d: sess.d, v: 70 }] })).s, 200); ok('клиент без тренера включил копию: данные принимаются');
r = await api('POST', '/v1/me/backup', Q.token, { on: false }); assert.equal(r.b.purged, true);
assert.equal((await db.query('SELECT count(*)::int AS n FROM weights WHERE user_id=$1', [Q.userId])).rows[0].n | 0, 0); ok('копию выключили: данные с сервера удалены');
const Q2 = await dev(19); await api('POST', '/v1/me/backup', Q2.token, { on: true }); await api('POST', '/v1/sync', Q2.token, { weights: [{ d: sess.d, v: 71 }] });
await api('POST', '/v1/link', Q2.token, { code: rr.b.invite, consent: 'v1' }); await api('DELETE', '/v1/link', Q2.token);
assert.equal((await db.query('SELECT count(*)::int AS n FROM weights WHERE user_id=$1', [Q2.userId])).rows[0].n, 1); ok('при включённой копии разрыв связи с тренером данные не удаляет');
r = await api('POST', '/v1/sync', Q2.token, { docs: { nutr: { rev: 0, value: { x: 'y'.repeat(62000) } } } }); assert.equal(r.s, 413); ok('питание: документ больше 60 КБ отклонён (только итоги по дням)');

// 13б. питание: итоги по дням идут тренеру, норму корректирует только тренер
r = await api('POST', '/v1/sync', M2.token, { docs: { nsum: { rev: 0, value: { norm: { k: 1500, p: 100 }, days: { [sess.d]: { k: 1480, p: 95 } } } } } }); assert.equal(r.s, 200);
r = await api('GET', '/v1/coach/clients/' + M2.userId, T.token); assert.equal(r.b.docs.nsum.value.days[sess.d].k, 1480); ok('тренер видит итоги питания клиента по дням');
r = await api('POST', '/v1/sync', M2.token, { docs: { cnorm: { rev: 0, value: { adj: 900 } } } }); assert.equal(r.s, 400); ok('клиент не может сам записать корректировку нормы');
assert.equal((await api('POST', '/v1/coach/clients/' + M2.userId + '/norm', T.token, { adj: 900 })).s, 400);
assert.equal((await api('POST', '/v1/coach/clients/' + M2.userId + '/norm', T.token, { adj: 55 })).s, 400); ok('корректировка нормы: только шаг 10 ккал и не больше ±500');
assert.equal((await api('POST', '/v1/coach/clients/' + M2.userId + '/norm', M2.token, { adj: -100 })).s, 403); ok('клиент не может менять норму через тренерский маршрут');
assert.equal((await api('POST', '/v1/coach/clients/' + K2.userId + '/norm', T.token, { adj: -100 })).s >= 400, true); ok('чужому клиенту норму менять нельзя');
r = await api('POST', '/v1/coach/clients/' + M2.userId + '/norm', T.token, { adj: -100 }); assert.equal(r.s, 200);
r = await api('POST', '/v1/sync', M2.token, { since: 0 }); assert.equal(r.b.cnorm.adj, -100); assert.ok(r.b.events.some((e) => e.type === 'coach.norm' && e.payload.adj === -100)); ok('клиент получил событие и значение нормы при синхронизации');
r = await api('GET', '/v1/coach/clients/' + M2.userId, T.token); assert.equal(r.b.docs.cnorm.value.adj, -100); ok('тренер видит действующую корректировку');

// 13в. push: тренеру о завершённой тренировке, клиенту о новой программе и комментарии
const EP = (x) => 'https://fcm.googleapis.com/fcm/send/' + x, KEYS = { p256dh: 'BNc'.padEnd(40, 'a'), auth: 'au'.padEnd(16, 'b') };
r = await api('GET', '/v1/push/key'); assert.equal(r.b.key, 'PUBKEY'); ok('публичный ключ push отдаётся без входа');
assert.equal((await api('POST', '/v1/push/subscribe', T.token, { endpoint: 'https://evil.example.com/x', keys: KEYS })).s, 400);
assert.equal((await api('POST', '/v1/push/subscribe', T.token, { endpoint: 'http://fcm.googleapis.com/x', keys: KEYS })).s, 400);
assert.equal((await api('POST', '/v1/push/subscribe', T.token, { endpoint: EP('t1'), keys: { p256dh: '', auth: 'x' } })).s, 400); ok('подписка: чужие адреса, http и пустые ключи отклоняются (защита от SSRF)');
assert.equal((await api('POST', '/v1/push/subscribe', null, { endpoint: EP('t1'), keys: KEYS })).s, 401);
assert.equal((await api('POST', '/v1/push/subscribe', T.token, { endpoint: EP('t1'), keys: KEYS })).s, 200);
assert.equal((await api('POST', '/v1/push/subscribe', M2.token, { endpoint: EP('c1'), keys: KEYS })).s, 200); ok('тренер и клиент подписались');
const todayMsk = new Date(Date.now() + 3 * 3600e3).toISOString().slice(0, 10), oldD = '2024-01-05';
const S1 = { id: 'push-s1', d: todayMsk, wn: 'Ноги и ягодицы', pct: 92, sec: 2400 };
pushed.length = 0; r = await api('POST', '/v1/sync', M2.token, { sessions: [S1] }); assert.equal(r.s, 200);
await until(() => pushed.length >= 1);
assert.equal(pushed.length, 1); assert.equal(pushed[0].s.endpoint, EP('t1')); assert.equal(pushed[0].p.k, 'session'); assert.equal(pushed[0].p.cid, M2.userId); assert.equal(pushed[0].p.d, todayMsk); assert.equal(pushed[0].p.sid, 'push-s1');
assert.match(pushed[0].p.body, /Ноги и ягодицы.*92%/); assert.match(pushed[0].p.url, /push=session&cid=/); ok('тренер получил push о завершённой тренировке клиента, с адресом перехода');
pushed.length = 0; await api('POST', '/v1/sync', M2.token, { sessions: [S1] }); await wait(80); assert.equal(pushed.length, 0); ok('повторная отправка той же тренировки push не дублирует');
await api('POST', '/v1/sync', M2.token, { sessions: [{ id: 'push-skip', d: todayMsk, wn: 'Пропуск', pct: 0 }, { id: 'push-old', d: oldD, wn: 'Старая', pct: 100 }] }); await wait(80);
assert.equal(pushed.length, 0); ok('пропуск (0%) и старые записи при догрузке истории push тренеру не вызывают');
await api('POST', '/v1/sync', M2.token, { docs: { profile: { rev: 0, value: { name: 'Анна', note: 'не пришёл' } } } }); await wait(80);
assert.equal(pushed.length, 0); ok('обновление профиля или заметки клиента не вызывает push тренеру');
r = await api('POST', '/v1/sync', T.token, { since: 0 }); assert.ok(r.b.events.some((e) => e.type === 'client.session' && e.payload.sessions[0].id === 'push-s1' && e.payload.clientId === M2.userId)); ok('то же событие приходит в приложение тренера (баннер внутри приложения)');
pushed.length = 0; r = await api('POST', '/v1/coach/clients/' + M2.userId + '/notes', T.token, { text: 'Отлично сработал, добавь вес в приседе', ref: 'push-s1' }); assert.equal(r.s, 200);
await until(() => pushed.length >= 1); assert.equal(pushed[0].s.endpoint, EP('c1')); assert.equal(pushed[0].p.k, 'note'); assert.match(pushed[0].p.body, /Комментарий к тренировке: Отлично/); ok('клиент получил push о комментарии тренера');
pushed.length = 0; r = await api('POST', '/v1/coach/clients/' + M2.userId + '/programs', T.token, { title: 'Сила 4 недели', program: { kind: 'prog', name: 'Сила 4 недели', data: { workouts: [] } } }); assert.equal(r.s, 200);
await until(() => pushed.length >= 1); assert.equal(pushed[0].s.endpoint, EP('c1')); assert.equal(pushed[0].p.k, 'program'); assert.match(pushed[0].p.body, /Сила 4 недели/); ok('клиент получил push о новой программе');
pushed.length = 0; r = await api('POST', '/v1/coach/clients/' + M2.userId + '/programs', T.token, { title: 'Сила 4 недели', key: 'prog:abc', program: { kind: 'prog', name: 'Сила 4 недели', data: { workouts: [] } } }); assert.equal(r.s, 200);
await until(() => pushed.length >= 1); assert.match(pushed[0].p.body, /Новая программа/);
pushed.length = 0; r = await api('POST', '/v1/coach/clients/' + M2.userId + '/programs', T.token, { title: 'Сила 4 недели', key: 'prog:abc', program: { kind: 'prog', name: 'Сила 4 недели', data: { workouts: [] } } }); assert.equal(r.s, 200);
await until(() => pushed.length >= 1); assert.match(pushed[0].p.body, /Обновление программы/);
r = await api('POST', '/v1/sync', M2.token, { since: 0 }); assert.equal(r.b.events.filter((e) => e.type === 'coach.program' && e.payload.key === 'prog:abc').length, 2); ok('повторная отправка программы с тем же ключом: клиент получает ключ в событии, push «Обновление программы»');
pushed.length = 0; await api('POST', '/v1/coach/clients/' + M2.userId + '/norm', T.token, { adj: -50 }); await wait(80); assert.equal(pushed.length, 0); ok('корректировка нормы push не отправляет (только событие)');
assert.equal((await api('POST', '/v1/push/subscribe', M2.token, { endpoint: 'https://fcm.googleapis.com/gone/dead', keys: KEYS })).s, 200);
pushed.length = 0; await api('POST', '/v1/coach/clients/' + M2.userId + '/notes', T.token, { text: 'ещё' }); await until(() => pushed.length >= 1); await wait(80);
assert.equal((await db.query("SELECT count(*)::int AS n FROM push_subs WHERE endpoint LIKE '%/gone/%'")).rows[0].n | 0, 0); ok('мёртвая подписка (410) удаляется, живая продолжает работать');
for (let i = 0; i < 7; i++) await api('POST', '/v1/push/subscribe', M2.token, { endpoint: EP('many' + i), keys: KEYS });
assert.equal((await db.query('SELECT count(*)::int AS n FROM push_subs WHERE user_id=$1', [M2.userId])).rows[0].n, 5); ok('на одного человека не больше 5 подписок');
pushed.length = 0; await api('POST', '/v1/push/subscribe', M2.token, { endpoint: EP('c2'), keys: KEYS }); r = await api('POST', '/v1/push/test', M2.token); assert.equal(r.b.sent >= 1, true); assert.equal(pushed[0].p.k, 'test'); ok('кнопка «Проверить»: тестовый push приходит себе');
await api('POST', '/v1/push/unsubscribe', M2.token, {}); assert.equal((await db.query('SELECT count(*)::int AS n FROM push_subs WHERE user_id=$1', [M2.userId])).rows[0].n | 0, 0); ok('отписка удаляет подписки');
const appNo = createApp({ db, secret: 'z'.repeat(40) }); const srvNo = http.createServer(appNo.handler); await new Promise((rs) => srvNo.listen(0, rs));
const rNo = await fetch('http://127.0.0.1:' + srvNo.address().port + '/v1/push/key'); assert.equal((await rNo.json()).key, null); ok('без ключей VAPID push выключен, сервер работает как раньше');
srvNo.close(); appNo.close();

// 14. вход по телефону выключен по умолчанию
const app2 = createApp({ db, secret: 'y'.repeat(40) }); const srv2 = http.createServer(app2.handler); await new Promise((r) => srv2.listen(0, r));
const r2 = await fetch('http://127.0.0.1:' + srv2.address().port + '/v1/auth/phone/start', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ phone: '+79161234567' }) });
assert.equal(r2.status, 404); assert.equal((await r2.json()).error, 'phone_login_disabled'); ok('без флага вход по телефону недоступен, гостевой вход работает');
srv2.close(); app2.close();
console.log('\nГотово: ' + n + ' проверок');
wsh.close(); app.close(); server.close(); await db.close(); process.exit(0);
