import crypto from 'node:crypto';

const b64 = (b) => Buffer.from(b).toString('base64url');

export function signToken(secret, payload) {
  const body = b64(JSON.stringify(payload));
  const mac = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  return body + '.' + mac;
}
export function readToken(secret, tok) {
  if (typeof tok !== 'string') return null;
  const [body, mac] = tok.split('.');
  if (!body || !mac) return null;
  const want = crypto.createHmac('sha256', secret).update(body).digest();
  let got; try { got = Buffer.from(mac, 'base64url'); } catch { return null; }
  if (got.length !== want.length || !crypto.timingSafeEqual(got, want)) return null;
  let p; try { p = JSON.parse(Buffer.from(body, 'base64url').toString()); } catch { return null; }
  if (!p || typeof p.sub !== 'string' || !(p.exp > Date.now() / 1000)) return null;
  return p;
}

// scrypt-хеш кода доступа. Код чувствителен к регистру, пробелы по краям обрезаются.
export function hashCode(code, salt = crypto.randomBytes(16).toString('hex')) {
  const h = crypto.scryptSync(String(code).trim(), salt, 32, { N: 16384, r: 8, p: 1 }).toString('hex');
  return { salt, hash: h };
}
export function checkCode(code, salt, hash) {
  const h = crypto.scryptSync(String(code).trim(), salt, 32, { N: 16384, r: 8, p: 1 });
  const w = Buffer.from(hash, 'hex');
  return h.length === w.length && crypto.timingSafeEqual(h, w);
}

const ALPHA = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export function inviteCode() {
  let s = ''; for (let i = 0; i < 8; i++) s += ALPHA[crypto.randomInt(ALPHA.length)];
  return s;
}

// скользящее окно в памяти. При нескольких экземплярах заменить на Redis/таблицу.
export class Limiter {
  constructor() { this.m = new Map(); }
  hit(key, max, windowMs) {
    const now = Date.now(); const a = (this.m.get(key) || []).filter((t) => now - t < windowMs);
    if (a.length >= max) { this.m.set(key, a); return false; }
    a.push(now); this.m.set(key, a); return true;
  }
  left(key, max, windowMs) { const now = Date.now(); return Math.max(0, max - (this.m.get(key) || []).filter((t) => now - t < windowMs).length); }
  reset(key) { this.m.delete(key); }
  sweep() { const now = Date.now(); for (const [k, a] of this.m) if (!a.some((t) => now - t < 3600e3)) this.m.delete(k); }
}
