import http from 'node:http';
import { createApp } from './app.js';
import { pgPool } from './db.js';
import { makePush } from './push.js';

const { DATABASE_URL, SECRET, PORT = '8787', TRUST_PROXY, PHONE_AUTH, VAPID_PUBLIC, VAPID_PRIVATE, VAPID_SUBJECT, ALLOWED_ORIGINS } = process.env;
if (!DATABASE_URL || !SECRET) { console.error('Нужны переменные DATABASE_URL и SECRET (32+ символов)'); process.exit(1); }
const db = await pgPool(DATABASE_URL);
const push = makePush({ publicKey: VAPID_PUBLIC, privateKey: VAPID_PRIVATE, subject: VAPID_SUBJECT || undefined });
const origins = ALLOWED_ORIGINS ? ALLOWED_ORIGINS.split(',').map((x) => x.trim()).filter(Boolean) : null;
const app = createApp({ db, push, origins, secret: SECRET, trustProxy: TRUST_PROXY === '1', phoneAuth: PHONE_AUTH === '1', log: (...a) => console.error(...a) });
const server = http.createServer(app.handler);
app.attachWs(server);
server.listen(+PORT, () => console.log('forma-backend на порту ' + PORT));

// аккуратная остановка при обновлении контейнера
for (const sig of ['SIGTERM', 'SIGINT']) process.on(sig, async () => { console.log('остановка…'); server.close(); app.close(); try { await db.close(); } catch {} process.exit(0); });
process.on('unhandledRejection', (e) => console.error('unhandledRejection', e && e.message));
