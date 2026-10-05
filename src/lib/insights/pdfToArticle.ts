import sharp from 'sharp';
import { z } from 'zod';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getDocumentProxy, extractText, renderPageAsImage } from 'unpdf';
import { saveFile } from '@/lib/storage';
import { Article, ArticleFigureSchema, ArticleSchema } from './articleTypes';

// ────────────────────────────────────────────────────────────────
// PDF → structured article.
//
// 1. Render every page to an image and extract its text layer.
// 2. Gemini reads the page images (layout, tables, photos) alongside the
//    text layer (exact wording) and returns the article as typed blocks,
//    with bounding boxes for photos/charts.
// 3. Figures are cropped from the high-resolution page renders and stored.
//
// The author's wording is kept verbatim — the model restructures, it does
// not rewrite. Only the key takeaways are a summary.
// ────────────────────────────────────────────────────────────────

const MODELS = ['gemini-3.5-flash', 'gemini-flash-latest'];
const RENDER_SCALE = 2.5;     // crops come from this render
const MODEL_IMAGE_WIDTH = 1400; // page images sent to the model

const RawFigureSchema = ArticleFigureSchema.extend({
  page: z.coerce.number(),
  box: z.array(z.coerce.number()).length(4),
});

const PROMPT = `You convert a designed investment newsletter / research PDF into a clean, structured web article for a premium research page (in the style of Goldman Sachs or BlackRock insights).

You receive each page as an image plus the page's extracted text layer. Use the images to understand layout (columns, sidebars, tables, photos, charts) and reading order. Use the text layer for exact wording and numbers.

STRICT RULES
- Keep the author's wording verbatim. Do not paraphrase, shorten, embellish or add facts. You may only: join lines broken by the PDF layout, fix obvious hyphenation, and fix capitalisation of ALL-CAPS headings into Title Case.
- Copy every number, percentage and date exactly as printed. Never invent data.
- Omit repeated page furniture: running headers/footers, page numbers, personal email addresses, phone/WhatsApp numbers, "click here to open account" links, and platform logos/wordmarks.
- Keep sidebar/box content, but place it where it reads naturally, as a "callout" block (title = the box heading).
- Tables: rebuild as "table" blocks with every row and column. If the table has a grouping column (e.g. asset class), make it the first column and repeat the group label on each row. Put footnotes under "note".
- Photos, charts and diagrams that carry meaning become figures. Charts must be figures (do not convert chart data into a table). Small decorative icons, logos and clip-art are NOT figures. Several related photos shown side by side are separate figures (one box per photo — never one box around several photos) grouped by a single "gallery" block.
- For portrait photos of named people, the caption is the printed name and title.

FIGURES
For each figure give: id ("f1", "f2", …), page (1-based), box = [ymin, xmin, ymax, xmax] normalised 0-1000 on that page image, tightly around the image/chart only (exclude its caption text and any surrounding frame or drop-shadow), kind ("photo" | "chart" | "diagram"), caption (the printed caption if there is one; for charts/diagrams without one, their printed title; for photos without a printed caption, an empty string — never invent captions like \"Photo 1\"), alt (concise accessible description).

OUTPUT — a single JSON object:
{
  "series": "newsletter/publication name if printed (e.g. masthead), else empty",
  "title": "the article's main title — use the masthead if there is no separate headline",
  "dek": "one-sentence standfirst taken from the printed tagline/intro (verbatim if a tagline exists)",
  "keyTakeaways": ["3-5 short takeaways summarising the article, faithful to its content"],
  "coverFigureId": "id of the best lead photo for the article header, or omit",
  "figures": [ { "id", "page", "box", "kind", "caption", "alt" } ],
  "blocks": [ ... in reading order ... ]
}

BLOCK TYPES (use only these fields):
- { "type": "heading", "level": 2 | 3, "text": "…" }   (level 2 = section, 3 = sub-section)
- { "type": "paragraph", "text": "…" }   (inline **bold** / *italic* allowed where the PDF emphasises text)
- { "type": "list", "ordered": false, "items": ["…"] }
- { "type": "callout", "title": "…", "text": "optional paragraph", "items": ["optional bullets"] }
- { "type": "quote", "text": "…", "attribution": "optional" }   (only for genuinely quoted or pulled-out emphatic lines)
- { "type": "table", "caption": "…", "columns": ["…"], "rows": [["…"]], "note": "optional" }
- { "type": "figure", "figureId": "f1" }
- { "type": "gallery", "figureIds": ["f2","f3"], "caption": "optional" }
- { "type": "stats", "stats": [ { "value": "14.88%", "label": "Equities CAGR" } ] }   (only for headline figures printed in the PDF)

Do not use the cover figure again as a figure block. Respond with JSON only.`;

interface RenderedPage {
  page: number;
  png: Buffer;      // full-resolution render for cropping
  width: number;
  height: number;
  text: string;
}

async function renderPages(pdfBytes: Buffer): Promise<RenderedPage[]> {
  const pdf = await getDocumentProxy(new Uint8Array(pdfBytes));
  const { text } = await extractText(pdf, { mergePages: false });
  const pages: RenderedPage[] = [];
  for (let p = 1; p <= pdf.numPages; p++) {
    const img = await renderPageAsImage(pdf, p, {
      canvasImport: () => import('@napi-rs/canvas'),
      scale: RENDER_SCALE,
    });
    const png = Buffer.from(img);
    const meta = await sharp(png).metadata();
    pages.push({ page: p, png, width: meta.width ?? 0, height: meta.height ?? 0, text: text[p - 1] ?? '' });
  }
  return pages;
}

async function callModel(pages: RenderedPage[]): Promise<unknown> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  const parts: ({ text: string } | { inlineData: { mimeType: string; data: string } })[] = [];
  for (const p of pages) {
    const jpeg = await sharp(p.png).resize({ width: MODEL_IMAGE_WIDTH }).jpeg({ quality: 82 }).toBuffer();
    parts.push({ text: `--- PAGE ${p.page} (image follows, then its text layer) ---` });
    parts.push({ inlineData: { mimeType: 'image/jpeg', data: jpeg.toString('base64') } });
    parts.push({ text: `PAGE ${p.page} TEXT LAYER:\n${p.text}` });
  }

  let lastError: unknown;
  for (const modelName of MODELS) {
    // Retry transient overload/rate-limit errors with backoff before falling back
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName, systemInstruction: PROMPT });
        const result = await model.generateContent({
          contents: [{ role: 'user', parts }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 32768, responseMimeType: 'application/json' },
        });
        const raw = result.response.text().replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
        return JSON.parse(raw);
      } catch (err) {
        lastError = err;
        const message = (err as Error).message ?? '';
        console.warn(`[pdfToArticle] ${modelName} attempt ${attempt} failed:`, message.slice(0, 200));
        if (!/(429|500|503)|overloaded|high demand/i.test(message)) break;
        await new Promise(r => setTimeout(r, attempt * 5000));
      }
    }
  }
  throw new Error(`AI conversion failed: ${(lastError as Error)?.message ?? 'unknown error'}`);
}

/** Longest run of indices where `isContent` holds, tolerating short gaps. */
function longestRun(length: number, isContent: (i: number) => boolean, maxGap = 3): [number, number] {
  let best: [number, number] = [0, length - 1];
  let bestLen = 0;
  let start = -1;
  let gap = 0;
  for (let i = 0; i <= length; i++) {
    if (i < length && isContent(i)) {
      if (start < 0) start = i;
      gap = 0;
    } else if (start >= 0 && (i === length || ++gap > maxGap)) {
      const end = i === length ? length - 1 - gap : i - gap;
      if (end - start > bestLen) { bestLen = end - start; best = [start, end]; }
      start = -1;
      gap = 0;
    }
  }
  return best;
}

/**
 * Photos are solid blocks of non-white pixels. Snap a (slightly padded)
 * model box to the largest such block, which drops stray caption/header
 * text strips caught by an imprecise box.
 */
async function snapToPhoto(region: Buffer): Promise<Buffer> {
  const { data, info } = await sharp(region).greyscale().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const ink = (x: number, y: number) => data[y * width + x] < 236;
  const rowFill = (y: number, x0 = 0, x1 = width - 1) => {
    let n = 0;
    for (let x = x0; x <= x1; x++) if (ink(x, y)) n++;
    return n / (x1 - x0 + 1);
  };
  const [top, bottom] = longestRun(height, y => rowFill(y) > 0.45);
  const colFill = (x: number) => {
    let n = 0;
    for (let y = top; y <= bottom; y++) if (ink(x, y)) n++;
    return n / (bottom - top + 1);
  };
  const [left, right] = longestRun(width, x => colFill(x) > 0.45);
  const w = right - left + 1;
  const h = bottom - top + 1;
  // Safety: if the snap removed most of the box, the heuristic misfired — keep the original
  if (w * h < 0.45 * width * height || w < 40 || h < 40) return region;
  return sharp(region).extract({ left, top, width: w, height: h }).toBuffer();
}

/** Crops a 0-1000 normalised box out of a page render; trims a few px of frame/shadow. */
async function cropFigure(page: RenderedPage, box: number[], kind: string): Promise<{ data: Buffer; width: number; height: number } | null> {
  const pad = kind === 'photo' ? 12 : 4; // tolerate imprecise model boxes
  const [ymin, xmin, ymax, xmax] = [box[0] - pad, box[1] - pad, box[2] + pad, box[3] + pad].map(v => Math.min(1000, Math.max(0, v)));
  const left = Math.round((xmin / 1000) * page.width);
  const top = Math.round((ymin / 1000) * page.height);
  const width = Math.round(((xmax - xmin) / 1000) * page.width);
  const height = Math.round(((ymax - ymin) / 1000) * page.height);
  if (width < 40 || height < 40) return null;

  // Two passes: sharp applies trim() before extract() when chained
  let region: Buffer = await sharp(page.png)
    .extract({ left, top, width: Math.min(width, page.width - left), height: Math.min(height, page.height - top) })
    .toBuffer();
  if (kind === 'photo') region = await snapToPhoto(region);
  const data = await sharp(region)
    .trim({ background: '#ffffff', threshold: 12 })
    .webp({ quality: 86 })
    .toBuffer({ resolveWithObject: true });
  return { data: data.data, width: data.info.width, height: data.info.height };
}

function estimateReadingMinutes(article: Article): number {
  const words = article.blocks
    .flatMap(b => [b.text, b.title, b.caption, b.note, ...(b.items ?? []), ...(b.rows?.flat() ?? [])])
    .filter(Boolean)
    .join(' ')
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

export async function convertPdfToArticle(pdfBytes: Buffer, opts: { sourcePdfUrl?: string; storagePrefix?: string } = {}): Promise<Article> {
  const pages = await renderPages(pdfBytes);
  if (pages.length === 0) throw new Error('The PDF has no pages');

  const raw = (await callModel(pages)) as Record<string, unknown>;
  const rawFigures = Array.isArray(raw.figures) ? raw.figures : [];
  if (process.env.DEBUG_PDF_ARTICLE) console.log('[pdfToArticle] raw figures', JSON.stringify(rawFigures));

  // Crop and store figures
  const prefix = opts.storagePrefix ?? `insights/${Date.now()}`;
  const figures: Article['figures'] = [];
  for (const f of rawFigures) {
    const parsed = RawFigureSchema.safeParse(f);
    if (!parsed.success) continue;
    const { page, box, ...fig } = parsed.data;
    const rendered = pages.find(p => p.page === page);
    if (!rendered) continue;
    try {
      const crop = await cropFigure(rendered, box, fig.kind);
      if (!crop) continue;
      const url = await saveFile(`${prefix}/${fig.id}.webp`, crop.data, 'image/webp');
      figures.push({ ...fig, url, width: crop.width, height: crop.height });
    } catch (err) {
      console.warn(`[pdfToArticle] Could not crop figure ${fig.id}:`, (err as Error).message);
    }
  }

  const article = ArticleSchema.parse({ ...raw, figures });

  // Drop references to figures that failed to crop
  const ok = new Set(figures.map(f => f.id));
  article.blocks = article.blocks
    .map(b => (b.type === 'gallery' ? { ...b, figureIds: (b.figureIds ?? []).filter(id => ok.has(id)) } : b))
    .filter(b => (b.type === 'figure' ? ok.has(b.figureId ?? '') : b.type === 'gallery' ? (b.figureIds?.length ?? 0) > 0 : true));
  if (article.coverFigureId && !ok.has(article.coverFigureId)) article.coverFigureId = undefined;

  article.readingMinutes = estimateReadingMinutes(article);
  article.pageCount = pages.length;
  article.sourcePdfUrl = opts.sourcePdfUrl;
  return article;
}
