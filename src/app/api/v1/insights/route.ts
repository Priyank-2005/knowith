import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const insights = await prisma.insight.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ insights });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch insights' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const type = formData.get('type') as string; // 'ARTICLE' or 'INFOGRAPHIC'
    const file = formData.get('file') as File;
    
    if (!title || !type) {
      return NextResponse.json({ error: 'Title and type are required' }, { status: 400 });
    }

    let contentUrl = '';

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uploadDir = path.join(process.cwd(), 'public/uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = path.join(uploadDir, fileName);
      
      fs.writeFileSync(filePath, buffer);
      contentUrl = `/uploads/${fileName}`;
    }

    const insight = await prisma.insight.create({
      data: {
        title,
        description,
        type,
        contentUrl,
        publishedAt: new Date(),
        isActive: true,
      }
    });
    
    return NextResponse.json({ success: true, insight });
  } catch (error) {
    console.error('Failed to create insight:', error);
    return NextResponse.json({ error: 'Failed to create insight' }, { status: 500 });
  }
}
