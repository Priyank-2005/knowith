import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { deleteFiles, isStoredFileUrl } from '@/lib/storage';
import { ArticleSchema } from '@/lib/insights/articleTypes';
import { getAdminSession, requireAdmin } from '@/lib/auth/guards';

export const dynamic = 'force-dynamic';

/** GET /api/v1/insights/:id — drafts are only returned with ?preview=1 */
export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    const insight = await prisma.insight.findUnique({ where: { id } });
    const preview = req.nextUrl.searchParams.get('preview') === '1' && Boolean(await getAdminSession());

    if (!insight || (!insight.isActive && !preview)) {
      return NextResponse.json({ error: 'Insight not found' }, { status: 404 });
    }
    return NextResponse.json({ insight });
  } catch (error) {
    console.error('Failed to fetch insight:', error);
    return NextResponse.json({ error: 'Failed to fetch insight' }, { status: 500 });
  }
}

/** Partial update. File fields are URLs from /api/v1/uploads; replaced files are deleted. */
export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const { id } = await ctx.params;
    const body = await req.json();

    const existing = await prisma.insight.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Insight not found' }, { status: 404 });
    }

    const data: Prisma.InsightUpdateInput = {};
    if (typeof body.title === 'string') data.title = body.title;
    if (typeof body.description === 'string') data.description = body.description;
    if (typeof body.contentBody === 'string') data.contentBody = body.contentBody;
    if (typeof body.contentUrl === 'string' && isStoredFileUrl(body.contentUrl)) data.contentUrl = body.contentUrl;
    if (typeof body.thumbnailUrl === 'string' && isStoredFileUrl(body.thumbnailUrl)) data.thumbnailUrl = body.thumbnailUrl;
    if (typeof body.isActive === 'boolean') {
      data.isActive = body.isActive;
      // Publishing a draft dates it to the moment it goes live
      if (body.isActive && !existing.isActive) data.publishedAt = new Date();
    }
    if (body.article) {
      const parsed = ArticleSchema.safeParse(body.article);
      if (!parsed.success) return NextResponse.json({ error: 'Invalid article structure' }, { status: 400 });
      data.article = parsed.data as Prisma.InputJsonValue;
    }

    const updated = await prisma.insight.update({ where: { id }, data });

    // Clean up files that were replaced
    const replaced = [];
    if (data.contentUrl && existing.contentUrl !== data.contentUrl) replaced.push(existing.contentUrl);
    if (data.thumbnailUrl && existing.thumbnailUrl !== data.thumbnailUrl && existing.thumbnailUrl !== existing.contentUrl) {
      replaced.push(existing.thumbnailUrl);
    }
    await deleteFiles(replaced);

    return NextResponse.json({ success: true, insight: updated });
  } catch (error) {
    console.error('Failed to update insight:', error);
    return NextResponse.json({ error: 'Failed to update insight' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const { id } = await ctx.params;
    const existing = await prisma.insight.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Insight not found' }, { status: 404 });
    }

    await prisma.insight.delete({ where: { id } });

    const article = ArticleSchema.safeParse(existing.article);
    const figureUrls = article.success ? article.data.figures.map(f => f.url) : [];
    await deleteFiles([existing.contentUrl, existing.thumbnailUrl, ...figureUrls]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete insight:', error);
    return NextResponse.json({ error: 'Failed to delete insight' }, { status: 500 });
  }
}
