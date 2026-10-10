// Тонкая обёртка: в проде pg.Pool, в тестах PGlite (настоящий Postgres в WASM). Единый интерфейс: query(sql, params) -> {rows}
import { readFileSync } from 'node:fs';
const SCHEMA = readFileSync(new URL('./schema.sql', import.meta.url), 'utf8');

export async function pgPool(url) {
  const { default: pg } = await import('pg');
  const pool = new pg.Pool({ connectionString: url, max: 10 });
  pool.on('error', (e) => console.error('pg pool', e.message));   // обрыв соединения не должен ронять процесс
  await pool.query(SCHEMA);
  return {
    query: (s, p) => pool.query(s, p),
    // транзакция: fn получает {query}; при ошибке откат
    tx: async (fn) => {
      const c = await pool.connect();
      try { await c.query('BEGIN'); const r = await fn({ query: (s, p) => c.query(s, p) }); await c.query('COMMIT'); return r; }
      catch (e) { try { await c.query('ROLLBACK'); } catch {} throw e; }
      finally { c.release(); }
    },
    close: () => pool.end(),
  };
}

export async function memDb() {
  const { PGlite } = await import('@electric-sql/pglite');
  const pg = new PGlite();
  await pg.exec(SCHEMA);
  return {
    query: (s, p) => pg.query(s, p),
    tx: (fn) => pg.transaction((t) => fn({ query: (s, p) => t.query(s, p) })),
    close: () => pg.close(),
  };
}
