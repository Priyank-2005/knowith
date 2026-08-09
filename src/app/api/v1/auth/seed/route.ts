import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    // Create Admin user
    await prisma.user.upsert({
      where: { email: 'admin@knowith.com' },
      update: {},
      create: {
        email: 'admin@knowith.com',
        password: 'admin@123',
        name: 'Admin',
        role: 'ADMIN',
      },
    });

    // Create Client user
    await prisma.user.upsert({
      where: { email: 'client@knowith.com' },
      update: {},
      create: {
        email: 'client@knowith.com',
        password: 'client@123',
        name: 'Ayushi Sainani',
        role: 'CLIENT',
      },
    });

    // Create Non-Client user
    await prisma.user.upsert({
      where: { email: 'user@knowith.com' },
      update: {},
      create: {
        email: 'user@knowith.com',
        password: 'user@123',
        name: 'Demo User',
        role: 'NON_CLIENT',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Users seeded successfully',
      users: [
        { email: 'admin@knowith.com', password: 'admin@123', role: 'ADMIN' },
        { email: 'client@knowith.com', password: 'client@123', role: 'CLIENT' },
        { email: 'user@knowith.com', password: 'user@123', role: 'NON_CLIENT' },
      ],
    });
  } catch (error: any) {
    console.error('[Seed Users Error]:', error);
    return NextResponse.json({ error: 'Failed to seed users', details: error.message }, { status: 500 });
  }
}
