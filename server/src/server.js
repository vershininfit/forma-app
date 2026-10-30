import http from 'node:http';
import { createApp } from './app.js';
import { pgPool } from './db.js';
import { makePush } from './push.js';

const { DATABASE_URL, SECRET, PORT = '8787', TRUST_PROXY, PHONE_AUTH, VAPID_PUBLIC, VAPID_PRIVATE, VAPID_SUBJECT, ALLOWED_ORIGINS,
  PUBLIC_URL, TG_BOT_NAME, TG_BOT_TOKEN, TG_SECRET, TG_API_BASE, VK_CLIENT_ID, YANDEX_CLIENT_ID, YANDEX_CLIENT_SECRET } = process.env;
if (!DATABASE_URL || !SECRET) { console.error('Нужны переменные DATABASE_URL и SECRET (32+ символов)'); process.exit(1); }
const db = await pgPool(DATABASE_URL);
const push = makePush({ publicKey: VAPID_PUBLIC, privateKey: VAPID_PRIVATE, subject: VAPID_SUBJECT || undefined });
const origins = ALLOWED_ORIGINS ? ALLOWED_ORIGINS.split(',').map((x) => x.trim()).filter(Boolean) : null;
// Вход без платных SMS (необязательно): Telegram-бот, VK ID, Яндекс ID. Без ключей эти способы выключены.
const tgApi = TG_BOT_TOKEN ? async (method, payload) => {
  const r = await fetch((TG_API_BASE || 'https://api.telegram.org') + '/bot' + TG_BOT_TOKEN + '/' + method, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload), signal: AbortSignal.timeout(10000) });
  const j = await r.json().catch(() => ({})); if (!r.ok || j.ok === false) throw new Error('telegram ' + method + ' ' + r.status + ' ' + (j.description || '')); return j.result;
} : null;
const login = {
  tg: TG_BOT_NAME && TG_SECRET && TG_BOT_TOKEN ? { botName: TG_BOT_NAME.replace(/^@/, ''), secret: TG_SECRET, api: tgApi } : null,
  oauth: {
    redirect: PUBLIC_URL ? PUBLIC_URL.replace(/\/+$/, '') + '/' : '',
    vk: VK_CLIENT_ID ? { clientId: VK_CLIENT_ID } : null,
    yandex: YANDEX_CLIENT_ID && YANDEX_CLIENT_SECRET ? { clientId: YANDEX_CLIENT_ID, clientSecret: YANDEX_CLIENT_SECRET } : null,
  },
};
const app = createApp({ db, push, origins, login, secret: SECRET, trustProxy: TRUST_PROXY === '1', phoneAuth: PHONE_AUTH === '1', log: (...a) => console.error(...a) });
const server = http.createServer(app.handler);
app.attachWs(server);
server.listen(+PORT, () => console.log('forma-backend на порту ' + PORT));
if (login.tg && PUBLIC_URL) {   // адрес webhook содержит секрет; ошибка не мешает работе (Telegram может быть недоступен с сервера)
  tgApi('setWebhook', { url: PUBLIC_URL.replace(/\/+$/, '') + '/v1/tg/hook/' + TG_SECRET, secret_token: TG_SECRET, allowed_updates: ['message'] }).then(() => console.log('telegram webhook установлен'), (e) => console.error('telegram webhook:', e.message));
}

// аккуратная остановка при обновлении контейнера
for (const sig of ['SIGTERM', 'SIGINT']) process.on(sig, async () => { console.log('остановка…'); server.close(); app.close(); try { await db.close(); } catch {} process.exit(0); });
process.on('unhandledRejection', (e) => console.error('unhandledRejection', e && e.message));
