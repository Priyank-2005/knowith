#!/usr/bin/env node
// Create an admin account, or reset an existing admin's password.
//
//   npm run admin:create -- admin@knowithcapital.com "Abhinav Mehta"
//
// Uses the database in POSTGRES_PRISMA_URL (.env / .env.local). The password is
// typed at a hidden prompt and stored as a scrypt hash.
import { randomBytes, scrypt as scryptCb } from 'node:crypto';
import { promisify } from 'node:util';
import readline from 'node:readline';
import { PrismaClient } from '@prisma/client';

const scrypt = promisify(scryptCb);

function askHidden(question) {
  return new Promise(resolve => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = (s) => { if (s.includes(question)) rl.output.write(s); };
    rl.question(question, answer => { rl.close(); process.stdout.write('\n'); resolve(answer); });
  });
}

const [email, ...nameParts] = process.argv.slice(2);
if (!email || !email.includes('@')) {
  console.error('Usage: npm run admin:create -- <email> [full name]');
  process.exit(1);
}

const password = await askHidden('Password (min 12 characters): ');
if (password.length < 12) {
  console.error('Password must be at least 12 characters.');
  process.exit(1);
}
if ((await askHidden('Confirm password: ')) !== password) {
  console.error('Passwords do not match.');
  process.exit(1);
}

const salt = randomBytes(16);
const hash = await scrypt(password, salt, 64);
const stored = `scrypt$${salt.toString('base64')}$${hash.toString('base64')}`;

const prisma = new PrismaClient();
const normalized = email.trim().toLowerCase();
const name = nameParts.join(' ') || undefined;
const user = await prisma.user.upsert({
  where: { email: normalized },
  create: { email: normalized, password: stored, name, role: 'ADMIN' },
  update: { password: stored, role: 'ADMIN', ...(name ? { name } : {}) },
});
await prisma.$disconnect();
console.log(`Admin ready: ${user.email}. Sign in at /admin.`);
