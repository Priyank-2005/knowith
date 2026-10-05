import { NextResponse } from 'next/server';
import { SupportEngine } from '@/lib/ai/features/support/engines/SupportEngine';
import { prisma } from '@/lib/prisma';
import { getChatActor } from '@/lib/chatLogger';

const engine = new SupportEngine();

export async function POST(req: Request) {
  try {
    const { message, sessionId } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Continue the visitor's conversation only if it still exists and is a support chat
    // (a stale id in localStorage would otherwise break saving the messages).
    const existing = typeof sessionId === 'string' && sessionId
      ? await prisma.session.findUnique({ where: { id: sessionId }, select: { id: true, feature: true } })
      : null;

    let currentSessionId = existing?.feature === 'SUPPORT' ? existing.id : null;
    if (!currentSessionId) {
      const actor = await getChatActor();
      const newSession = await prisma.session.create({
        data: {
          feature: 'SUPPORT',
          promptVersion: 'v1.0.0',
          clientId: actor.clientId,
          actorEmail: actor.email,
          actorName: actor.name,
        },
      });
      currentSessionId = newSession.id;
    }

    const response = await engine.processMessage(currentSessionId, message);

    return NextResponse.json({
      sessionId: currentSessionId,
      ...response
    });
  } catch (error: any) {
    console.error('[Support API Error]:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing the support message.' },
      { status: 500 }
    );
  }
}
