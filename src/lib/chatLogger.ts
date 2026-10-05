import { randomUUID } from 'crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getAdminSession, getMemberSession } from '@/lib/auth/guards';

/** Who is using a tool, from the signed session cookies (never from the request body). */
export interface ChatActor {
  clientId: string | null;
  email: string | null;
  name: string | null;
}

export async function getChatActor(): Promise<ChatActor> {
  const member = await getMemberSession();
  if (member) return { clientId: member.cid, email: member.email, name: member.name ?? null };
  const admin = await getAdminSession();
  if (admin) return { clientId: null, email: admin.email, name: admin.name ? `${admin.name} (staff)` : 'Staff' };
  return { clientId: null, email: null, name: null };
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Returns the conversation id to use: the client's id when it is a valid
 * session of the same feature that belongs to the same person, otherwise a
 * new one. Keeps all turns of one conversation in a single session.
 */
export async function resolveSessionId(requested: unknown, feature: string, actor: ChatActor): Promise<string> {
  if (typeof requested === 'string' && UUID_RE.test(requested)) {
    const existing = await prisma.session.findUnique({
      where: { id: requested },
      select: { feature: true, clientId: true, actorEmail: true },
    });
    if (!existing) return requested; // created on first log
    const sameOwner = existing.clientId === actor.clientId && (existing.actorEmail ?? null) === actor.email;
    if (existing.feature === feature && sameOwner) return requested;
  }
  return randomUUID();
}

interface ChatTurn {
  sessionId: string;
  feature: string;
  actor: ChatActor;
  /** null for system-triggered steps (e.g. report generation) with no user text */
  userMessage: string | null;
  assistantMessage: string;
  /** Latest collected profile (age, income, goals…) */
  profile?: unknown;
  /** Generated blueprint/report, when produced on this turn */
  report?: unknown;
  promptVersion?: string;
}

/** Appends one user/assistant exchange to the conversation. Never throws. */
export async function logChatTurn(turn: ChatTurn): Promise<void> {
  const { sessionId, feature, actor } = turn;
  const json = (v: unknown) => (v === undefined ? undefined : (v as Prisma.InputJsonValue));
  try {
    await prisma.session.upsert({
      where: { id: sessionId },
      create: {
        id: sessionId,
        feature,
        promptVersion: turn.promptVersion ?? 'v1.0.0',
        clientId: actor.clientId,
        actorEmail: actor.email,
        actorName: actor.name,
        profile: json(turn.profile),
        report: json(turn.report),
      },
      update: {
        // updatedAt moves on every turn so the admin list sorts by recent activity
        updatedAt: new Date(),
        ...(turn.profile !== undefined ? { profile: json(turn.profile) } : {}),
        ...(turn.report !== undefined ? { report: json(turn.report) } : {}),
      },
    });

    const now = Date.now();
    await prisma.message.createMany({
      data: [
        ...(turn.userMessage ? [{ sessionId, role: 'user', content: turn.userMessage, createdAt: new Date(now) }] : []),
        // +1 ms so ordering by createdAt is always user → assistant
        { sessionId, role: 'assistant', content: turn.assistantMessage, createdAt: new Date(now + 1) },
      ],
    });
  } catch (error) {
    console.error(`[ChatLogger] Failed to log ${feature} turn for session ${sessionId}:`, error);
  }
}
