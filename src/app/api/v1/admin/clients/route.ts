import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth/guards';

export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** GET /api/v1/admin/clients?q= — approved client emails */
export async function GET(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const q = req.nextUrl.searchParams.get('q')?.trim();
  const where = q
    ? { OR: [{ email: { contains: q, mode: 'insensitive' as const } }, { name: { contains: q, mode: 'insensitive' as const } }] }
    : {};
  const [clients, total, active] = await Promise.all([
    prisma.approvedClient.findMany({ where, orderBy: [{ name: 'asc' }, { email: 'asc' }], take: 1000 }),
    prisma.approvedClient.count(),
    prisma.approvedClient.count({ where: { isActive: true } }),
  ]);
  return NextResponse.json({ clients, total, active });
}

/** POST /api/v1/admin/clients — { name?, email } (single add) or { rows: [{ name, email }] } (bulk import) */
export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json();
  const rows: { name?: string; email?: string }[] = Array.isArray(body.rows) ? body.rows : [body];

  const valid = new Map<string, string | null>();
  const invalid: string[] = [];
  for (const r of rows) {
    const email = String(r.email ?? '').trim().toLowerCase();
    if (!EMAIL_RE.test(email)) {
      if (email || r.name) invalid.push(email || String(r.name));
      continue;
    }
    // Duplicate rows for the same email keep the first non-empty name
    valid.set(email, valid.get(email) || String(r.name ?? '').trim() || null);
  }

  if (valid.size === 0) {
    return NextResponse.json({ error: 'No valid email addresses found', invalid }, { status: 400 });
  }

  const existing = new Set(
    (await prisma.approvedClient.findMany({ where: { email: { in: [...valid.keys()] } }, select: { email: true } })).map(c => c.email)
  );

  // New emails are added; existing ones are re-activated and their name refreshed if provided
  await prisma.$transaction([
    prisma.approvedClient.createMany({
      data: [...valid].filter(([e]) => !existing.has(e)).map(([email, name]) => ({ email, name })),
      skipDuplicates: true,
    }),
    ...[...valid].filter(([e]) => existing.has(e)).map(([email, name]) =>
      prisma.approvedClient.update({ where: { email }, data: { isActive: true, ...(name ? { name } : {}) } })
    ),
  ]);

  return NextResponse.json({
    success: true,
    added: [...valid.keys()].filter(e => !existing.has(e)).length,
    updated: [...valid.keys()].filter(e => existing.has(e)).length,
    invalid,
  });
}
