import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';
import { extractText, getDocumentProxy } from 'unpdf';

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
    const type = formData.get('type') as string;
    let contentBody = formData.get('contentBody') as string | null;
    const file = formData.get('file') as File | null;
    const thumbnail = formData.get('thumbnail') as File | null;
    
    if (!type) {
      return NextResponse.json({ error: 'Type is required' }, { status: 400 });
    }
    if (type === 'ARTICLE' && !title) {
      return NextResponse.json({ error: 'Title is required for articles' }, { status: 400 });
    }

    let contentUrl = '';
    let thumbnailUrl = '';

    const uploadDir = path.join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Process thumbnail
    if (thumbnail && thumbnail.size > 0) {
      const bytes = await thumbnail.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${Date.now()}-thumb-${thumbnail.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);
      thumbnailUrl = `/uploads/${fileName}`;
    }

    // Process main file
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);
      contentUrl = `/uploads/${fileName}`;

      // PDF text extraction for ARTICLE type
      if (type === 'ARTICLE' && !contentBody && (file.type === 'application/pdf' || file.name.endsWith('.pdf'))) {
        try {
          const pdf = await getDocumentProxy(new Uint8Array(buffer));
          const { text } = await extractText(pdf, { mergePages: true });
          contentBody = text;
        } catch (pdfError) {
          console.error('Failed to parse PDF:', pdfError);
        }
      }
      
      // For INFOGRAPHIC type, use file URL as thumbnail if none provided
      if (type === 'INFOGRAPHIC' && !thumbnailUrl) {
          thumbnailUrl = contentUrl;
      }
    }

    const insight = await prisma.insight.create({
      data: {
        title,
        description: description || '',
        type,
        contentUrl,
        thumbnailUrl,
        contentBody: contentBody || '',
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
