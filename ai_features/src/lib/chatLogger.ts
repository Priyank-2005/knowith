import { prisma } from '@/lib/prisma';

export async function logChatSequence(
  sessionId: string,
  feature: string,
  userId: string | null,
  userMessage: string,
  assistantMessage: string,
  promptVersion: string = 'v1.0.0'
) {
  try {
    // Check if session exists, if not, create it.
    let session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      session = await prisma.session.create({
        data: {
          id: sessionId,
          feature,
          promptVersion,
          userId,
        },
      });
    }

    // Save the User's message
    await prisma.message.create({
      data: {
        sessionId: session.id,
        role: 'user',
        content: userMessage,
      },
    });

    // Save the Assistant's message
    await prisma.message.create({
      data: {
        sessionId: session.id,
        role: 'assistant',
        content: assistantMessage,
      },
    });

    console.log(`[ChatLogger] Successfully logged conversation for session ${session.id} (${feature})`);
  } catch (error) {
    console.error(`[ChatLogger] Error logging chat sequence:`, error);
  }
}
