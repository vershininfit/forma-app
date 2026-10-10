// Управление кодами доступа тренера. Код выдаёт владелец лично, в базе хранится только хеш.
//   node src/cli.js add "Валерий" 1        (спросит код в терминале)
//   node src/cli.js list
//   node src/cli.js revoke 3
import readline from 'node:readline/promises';
import { pgPool } from './db.js';
import { hashCode } from './auth.js';

const db = await pgPool(process.env.DATABASE_URL);
const [cmd, a, b] = process.argv.slice(2);
if (cmd === 'add') {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const code = (await rl.question('Код доступа (виден при вводе): ')).trim(); rl.close();
  if (code.length < 8) { console.error('Минимум 8 символов'); process.exit(1); }
  const { salt, hash } = hashCode(code);
  const r = await db.query('INSERT INTO coach_codes(label,salt,hash,max_uses) VALUES($1,$2,$3,$4) RETURNING id', [a || 'тренер', salt, hash, +b || 1]);
  console.log('Создан код #' + r.rows[0].id);
} else if (cmd === 'list') {
  console.table((await db.query('SELECT id,label,max_uses,uses,expires_at,revoked_at FROM coach_codes ORDER BY id')).rows);
} else if (cmd === 'revoke') {
  // отзыв: код перестаёт работать, все тренеры, активированные им, теряют роль, привязки закрываются
  const id = +a;
  await db.query('UPDATE coach_codes SET revoked_at=now() WHERE id=$1', [id]);
  const us = (await db.query('SELECT user_id FROM coaches WHERE code_id=$1', [id])).rows.map((r) => r.user_id);
  for (const u of us) {
    await db.query("UPDATE links SET status='removed_by_coach', ended_at=now() WHERE coach_id=$1 AND status='active'", [u]);
    await db.query("UPDATE users SET role='client' WHERE id=$1", [u]);
    await db.query('DELETE FROM coaches WHERE user_id=$1', [u]);
  }
  console.log('Отозван код #' + id + ', тренеров потеряли роль: ' + us.length);
} else console.log('add <метка> [макс.устройств] | list | revoke <id>');
await db.close();
