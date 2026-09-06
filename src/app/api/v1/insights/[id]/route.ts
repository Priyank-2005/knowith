import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';
import { extractText, getDocumentProxy } from 'unpdf';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    const insight = await prisma.insight.findUnique({
      where: { id }
    });

    if (!insight) {
      return NextResponse.json({ error: 'Insight not found' }, { status: 404 });
    }

    return NextResponse.json({ insight });
  } catch (error) {
    console.error('Failed to fetch insight:', error);
    return NextResponse.json({ error: 'Failed to fetch insight' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    const formData = await req.formData();
    const title = formData.get('title') as string | null;
    const description = formData.get('description') as string | null;
    const type = formData.get('type') as string | null;
    let contentBody = formData.get('contentBody') as string | null;
    const thumbnail = formData.get('thumbnail') as File | null;
    const file = formData.get('file') as File | null;

    const existingInsight = await prisma.insight.findUnique({ where: { id } });
    if (!existingInsight) {
      return NextResponse.json({ error: 'Insight not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (title) updateData.title = title;
    if (description !== null) updateData.description = description;
    if (type) updateData.type = type;
    if (contentBody !== null) updateData.contentBody = contentBody;

    const uploadDir = path.join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    if (thumbnail && thumbnail.size > 0) {
      const bytes = await thumbnail.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${Date.now()}-thumb-${thumbnail.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);
      updateData.thumbnailUrl = `/uploads/${fileName}`;
    }

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);
      updateData.contentUrl = `/uploads/${fileName}`;

      // Extract text from PDF if no manual content was provided
      if ((file.type === 'application/pdf' || file.name.endsWith('.pdf')) && !contentBody) {
        try {
          const pdf = await getDocumentProxy(new Uint8Array(buffer));
          const { text } = await extractText(pdf, { mergePages: true });
          updateData.contentBody = text;
        } catch (pdfError) {
          console.error('Failed to parse PDF:', pdfError);
        }
      }
    }

    const updatedInsight = await prisma.insight.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ success: true, insight: updatedInsight });
  } catch (error) {
    console.error('Failed to update insight:', error);
    return NextResponse.json({ error: 'Failed to update insight' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    
    const existingInsight = await prisma.insight.findUnique({ where: { id } });
    if (!existingInsight) {
      return NextResponse.json({ error: 'Insight not found' }, { status: 404 });
    }

    // Clean up uploaded files
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    if (existingInsight.contentUrl) {
      const filePath = path.join(uploadDir, path.basename(existingInsight.contentUrl));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    if (existingInsight.thumbnailUrl && existingInsight.thumbnailUrl !== existingInsight.contentUrl) {
      const filePath = path.join(uploadDir, path.basename(existingInsight.thumbnailUrl));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await prisma.insight.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete insight:', error);
    return NextResponse.json({ error: 'Failed to delete insight' }, { status: 500 });
  }
}
