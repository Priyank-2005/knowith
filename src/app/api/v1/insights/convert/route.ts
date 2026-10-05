import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { readFile, deleteFiles } from '@/lib/storage';
import { convertPdfToArticle } from '@/lib/insights/pdfToArticle';
import { ArticleSchema } from '@/lib/insights/articleTypes';
import { requireAdmin } from '@/lib/auth/guards';

export const dynamic = 'force-dynamic';
// Rendering + AI conversion of a multi-page PDF takes ~1-2 minutes
export const maxDuration = 300;

/**
 * POST /api/v1/insights/convert
 * Body: { pdfUrl: string, insightId?: string }
 *
 * Converts an uploaded PDF into a structured article. Without insightId a new
 * REPORT insight is created as an unpublished draft so the admin can preview
 * it; with insightId the existing report is re-converted in place.
 */
export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const { pdfUrl, insightId } = await req.json();
    if (typeof pdfUrl !== 'string' || !pdfUrl) {
      return NextResponse.json({ error: 'pdfUrl is required' }, { status: 400 });
    }

    const existing = insightId ? await prisma.insight.findUnique({ where: { id: insightId } }) : null;
    if (insightId && !existing) {
      return NextResponse.json({ error: 'Insight not found' }, { status: 404 });
    }

    const pdfBytes = await readFile(pdfUrl);
    if (pdfBytes.subarray(0, 5).toString() !== '%PDF-') {
      return NextResponse.json({ error: 'The uploaded file is not a PDF' }, { status: 400 });
    }

    const article = await convertPdfToArticle(pdfBytes, {
      sourcePdfUrl: pdfUrl,
      storagePrefix: `insights/${Date.now()}`,
    });
    const cover = article.figures.find(f => f.id === article.coverFigureId) ?? article.figures.find(f => f.kind === 'photo');
    const articleJson = article as Prisma.InputJsonValue;

    let insight;
    if (existing) {
      // Keep any manual title/description edits; replace the converted content
      const previous = ArticleSchema.safeParse(existing.article);
      insight = await prisma.insight.update({
        where: { id: existing.id },
        data: { article: articleJson, contentUrl: pdfUrl, thumbnailUrl: cover?.url ?? existing.thumbnailUrl },
      });
      await deleteFiles([
        ...(previous.success ? previous.data.figures.map(f => f.url) : []),
        existing.contentUrl !== pdfUrl ? existing.contentUrl : null,
      ]);
    } else {
      insight = await prisma.insight.create({
        data: {
          type: 'REPORT',
          title: article.title,
          description: article.dek,
          contentUrl: pdfUrl,
          thumbnailUrl: cover?.url ?? null,
          article: articleJson,
          isActive: false,
          publishedAt: new Date(),
        },
      });
    }

    return NextResponse.json({ success: true, insight });
  } catch (error) {
    console.error('[InsightsConvert] Failed:', error);
    return NextResponse.json({ error: (error as Error).message || 'Conversion failed' }, { status: 500 });
  }
}
