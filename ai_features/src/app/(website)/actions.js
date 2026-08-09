"use server";

import { PrismaClient } from '@prisma/client';

// In Next.js App Router, it's best to instantiate Prisma Client safely to avoid connection limits in dev
const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export async function submitInquiry(formData) {
  try {
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const message = formData.get('message');

    if (!name || !email || !message) {
      return { success: false, error: 'Name, email, and message are required.' };
    }

    const newInquiry = await prisma.inquiry.create({
      data: {
        name,
        email,
        phone: phone || null,
        message,
      },
    });

    return { success: true, inquiry: newInquiry };
  } catch (error) {
    console.error('Failed to submit inquiry:', error);
    return { success: false, error: 'Failed to submit inquiry. Please try again.' };
  }
}
