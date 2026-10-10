// Локальный сервер для разработки: PostgreSQL в памяти (PGlite), данные пропадают при остановке.
//   COACH_CODE="..." node src/dev.js   (по умолчанию тестовый код, не настоящий)
import http from 'node:http';
import { createApp } from './app.js';
import { memDb } from './db.js';
import { hashCode } from './auth.js';
import { makePush } from './push.js';
const db = await memDb();
const code = process.env.COACH_CODE || 'Dev-Coach-Code-1';
const { salt, hash } = hashCode(code);
await db.query('INSERT INTO coach_codes(label,salt,hash,max_uses) VALUES($1,$2,$3,$4)', ['dev', salt, hash, 50]);
// тестовые ключи VAPID, только для разработки; настоящие задаются переменными VAPID_PUBLIC / VAPID_PRIVATE
const push = makePush({ publicKey: process.env.VAPID_PUBLIC || 'BIdl5jLYwKuJCN-3cNxxcC6m-qN8JHV4jb9_lTad43cWJi15SfG6tIqrAMmMsjs70qFo9AJ8-_yu73TDvBkuAVI', privateKey: process.env.VAPID_PRIVATE || 'I0Q3n8a1Febwk_jy1C71f-Zs117kEdNT7NG5-1yOOmc' });
const app = createApp({ db, push, secret: 'dev-secret-'.padEnd(40, 'x'), log: (...a) => console.error(...a) });
const server = http.createServer(app.handler); app.attachWs(server);
server.listen(+(process.env.PORT || 8787), () => console.log('dev-сервер :' + (process.env.PORT || 8787) + ', код тренера: ' + code));
