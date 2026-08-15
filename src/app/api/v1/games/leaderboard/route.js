import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const topScores = await prisma.gameScore.findMany({
      orderBy: {
        totalScore: 'desc'
      },
      take: 10
    });
    
    return NextResponse.json(topScores);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { playerName, totalScore } = await req.json();

    if (!playerName || typeof totalScore !== 'number') {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const newScore = await prisma.gameScore.create({
      data: {
        playerName,
        totalScore
      }
    });

    return NextResponse.json(newScore);
  } catch (error) {
    console.error('Error saving score:', error);
    return NextResponse.json({ error: 'Failed to save score' }, { status: 500 });
  }
}
