import { z } from 'zod';

// ────────────────────────────────────────────────────────────────
// Structured article produced from an uploaded research PDF.
// Stored on Insight.article and rendered by the insights detail page.
// Inline text may contain **bold** and *italic* markers only.
// ────────────────────────────────────────────────────────────────

export const ArticleFigureSchema = z.object({
  id: z.string(),
  kind: z.enum(['photo', 'chart', 'diagram']),
  caption: z.string().optional().default(''),
  alt: z.string().optional().default(''),
  /** Set after cropping; omitted in the raw model output */
  url: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
});

export const ArticleBlockSchema = z.object({
  type: z.enum(['heading', 'paragraph', 'list', 'callout', 'quote', 'table', 'figure', 'gallery', 'stats']),
  text: z.string().optional(),
  level: z.number().optional(),
  title: z.string().optional(),
  ordered: z.boolean().optional(),
  items: z.array(z.string()).optional(),
  attribution: z.string().optional(),
  caption: z.string().optional(),
  note: z.string().optional(),
  columns: z.array(z.string()).optional(),
  rows: z.array(z.array(z.string())).optional(),
  figureId: z.string().optional(),
  figureIds: z.array(z.string()).optional(),
  stats: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
});

export const ArticleSchema = z.object({
  series: z.string().optional().default(''),
  title: z.string(),
  dek: z.string().optional().default(''),
  keyTakeaways: z.array(z.string()).optional().default([]),
  coverFigureId: z.string().optional(),
  figures: z.array(ArticleFigureSchema).optional().default([]),
  blocks: z.array(ArticleBlockSchema),
  readingMinutes: z.number().optional(),
  pageCount: z.number().optional(),
  sourcePdfUrl: z.string().optional(),
});

export type ArticleFigure = z.infer<typeof ArticleFigureSchema>;
export type ArticleBlock = z.infer<typeof ArticleBlockSchema>;
export type Article = z.infer<typeof ArticleSchema>;

/** URL-safe anchor for a section heading */
export function slugify(text: string): string {
  return text.toLowerCase().replace(/\*/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
}
