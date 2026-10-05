import { randomBytes, scrypt as scryptCb, timingSafeEqual, createHmac } from 'crypto';
import { promisify } from 'util';
import { authSecret } from './session';

const scrypt = promisify(scryptCb) as (pw: string, salt: Buffer, keylen: number) => Promise<Buffer>;

/** "scrypt$<salt b64>$<hash b64>" */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, 64);
  return `scrypt$${salt.toString('base64')}$${hash.toString('base64')}`;
}

/**
 * Verifies a password. Accounts created before hashing was introduced store
 * plain text; those still verify, and `needsRehash` tells the caller to upgrade.
 */
export async function verifyPassword(password: string, stored: string | null): Promise<{ ok: boolean; needsRehash: boolean }> {
  if (!stored) return { ok: false, needsRehash: false };
  if (stored.startsWith('scrypt$')) {
    const [, saltB64, hashB64] = stored.split('$');
    const expected = Buffer.from(hashB64, 'base64');
    const actual = await scrypt(password, Buffer.from(saltB64, 'base64'), expected.length);
    return { ok: actual.length === expected.length && timingSafeEqual(actual, expected), needsRehash: false };
  }
  const a = Buffer.from(password);
  const b = Buffer.from(stored);
  return { ok: a.length === b.length && timingSafeEqual(a, b), needsRehash: true };
}

/** Keyed hash for one-time codes (never store codes in plain text). */
export function hashOtp(email: string, code: string): string {
  return createHmac('sha256', authSecret()).update(`${email}:${code}`).digest('hex');
}

export function generateOtp(): string {
  // 6 digits, uniform
  return (randomBytes(4).readUInt32BE(0) % 1_000_000).toString().padStart(6, '0');
}
