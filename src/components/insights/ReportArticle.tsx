import Link from 'next/link';
import { Fragment, type ReactNode } from 'react';
import { Article, ArticleBlock, ArticleFigure, slugify } from '@/lib/insights/articleTypes';
import { ReadingProgress, ShareButton, TableOfContents } from './ArticleChrome';
import styles from './ReportArticle.module.css';

interface RelatedInsight {
  id: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  publishedAt: Date | null;
}

interface Props {
  article: Article;
  title: string;
  description: string | null;
  publishedAt: Date | null;
  pdfUrl: string | null;
  isDraft: boolean;
  related: RelatedInsight[];
}

const formatDate = (d: Date | null) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

/** Renders **bold** and *italic* markers; everything else is plain text (no HTML injection). */
function Inline({ text }: { text?: string }) {
  if (!text) return null;
  const parts: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\*(.+?)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(m[1] ? <strong key={m.index}>{m[1]}</strong> : <em key={m.index}>{m[2]}</em>);
    last = re.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

function FigureImage({ figure, className }: { figure: ArticleFigure; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- files live in Blob storage; dimensions are known
    <img
      src={figure.url}
      alt={figure.alt || figure.caption}
      width={figure.width}
      height={figure.height}
      loading="lazy"
      className={className}
    />
  );
}

function DataTable({ block }: { block: ArticleBlock }) {
  const columns = block.columns ?? [];
  const rows = block.rows ?? [];
  // A repeated first-column value is a group label (e.g. asset class) — show it once per group
  const grouped = rows.length > 2 && new Set(rows.map(r => r[0])).size < rows.length * 0.6;

  return (
    <div className={styles.tableScroll}>
      <table className={styles.table}>
        <thead>
          <tr>{columns.map((c, i) => <th key={i}><Inline text={c} /></th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, r) => {
            const startsGroup = grouped && (r === 0 || rows[r - 1][0] !== row[0]);
            return (
              <tr key={r} className={startsGroup && r > 0 ? styles.groupStart : undefined}>
                {row.map((cell, c) => (
                  <td key={c} className={c === 0 && grouped ? styles.groupCell : undefined}>
                    {c === 0 && grouped && !startsGroup ? '' : <Inline text={cell} />}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Exhibit({ n, caption, note, children }: { n: number; caption?: string; note?: string; children: ReactNode }) {
  return (
    <figure className={styles.exhibit}>
      <figcaption className={styles.exhibitHead}>
        <span className={styles.exhibitNo}>Exhibit {n}</span>
        {caption && <span className={styles.exhibitTitle}><Inline text={caption} /></span>}
      </figcaption>
      {children}
      {note && <p className={styles.exhibitNote}><Inline text={note} /></p>}
    </figure>
  );
}

export default function ReportArticle({ article, title, description, publishedAt, pdfUrl, isDraft, related }: Props) {
  const figures = new Map(article.figures.map(f => [f.id, f]));
  const cover = article.coverFigureId ? figures.get(article.coverFigureId) : undefined;
  const dek = description || article.dek;

  // Stable anchors for section headings
  const used = new Set<string>();
  const anchorFor = (text: string) => {
    let id = slugify(text) || 'section';
    while (used.has(id)) id += '-2';
    used.add(id);
    return id;
  };
  const toc: { id: string; text: string }[] = [];
  let exhibit = 0;
  let firstParagraph = true;

  const renderBlock = (b: ArticleBlock, i: number): ReactNode => {
    switch (b.type) {
      case 'heading': {
        if (!b.text) return null;
        if ((b.level ?? 2) <= 2) {
          const id = anchorFor(b.text);
          toc.push({ id, text: b.text.replace(/\*/g, '') });
          return <h2 key={i} id={id} className={styles.h2}><Inline text={b.text} /></h2>;
        }
        return <h3 key={i} className={styles.h3}><Inline text={b.text} /></h3>;
      }
      case 'paragraph': {
        const lead = firstParagraph;
        firstParagraph = false;
        return <p key={i} className={lead ? styles.lead : styles.p}><Inline text={b.text} /></p>;
      }
      case 'list': {
        const Tag = b.ordered ? 'ol' : 'ul';
        return <Tag key={i} className={styles.list}>{b.items?.map((it, j) => <li key={j}><Inline text={it} /></li>)}</Tag>;
      }
      case 'callout':
        return (
          <aside key={i} className={styles.callout}>
            {b.title && <div className={styles.calloutTitle}><Inline text={b.title} /></div>}
            {b.text && <p><Inline text={b.text} /></p>}
            {b.items && b.items.length > 0 && <ul>{b.items.map((it, j) => <li key={j}><Inline text={it} /></li>)}</ul>}
          </aside>
        );
      case 'quote':
        return (
          <blockquote key={i} className={styles.quote}>
            <p><Inline text={b.text} /></p>
            {b.attribution && <cite>— {b.attribution}</cite>}
          </blockquote>
        );
      case 'stats':
        return (
          <div key={i} className={styles.stats}>
            {b.stats?.map((s, j) => (
              <div key={j} className={styles.stat}>
                <div className={styles.statValue}>{s.value}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        );
      case 'table':
        return <Exhibit key={i} n={++exhibit} caption={b.caption} note={b.note}><DataTable block={b} /></Exhibit>;
      case 'figure': {
        const f = b.figureId ? figures.get(b.figureId) : undefined;
        if (!f?.url) return null;
        // Charts/diagrams are numbered exhibits; photos are illustrations with a plain caption
        if (f.kind === 'photo') {
          return (
            <figure key={i} className={styles.photo}>
              <FigureImage figure={f} />
              {f.caption && <figcaption><Inline text={f.caption} /></figcaption>}
            </figure>
          );
        }
        return (
          <Exhibit key={i} n={++exhibit} caption={f.caption} note={b.note}>
            <div className={styles.chartFrame}><FigureImage figure={f} /></div>
          </Exhibit>
        );
      }
      case 'gallery': {
        const items = (b.figureIds ?? []).map(id => figures.get(id)).filter((f): f is ArticleFigure => Boolean(f?.url));
        if (items.length === 0) return null;
        // Per-photo captions only when they say something (e.g. names), not "Photo 1", "Photo 2"…
        const stem = (c: string) => c.replace(/\s*\d+\s*$/, '').trim().toLowerCase();
        const showCaptions = items.every(f => f.caption) && new Set(items.map(f => stem(f.caption))).size === items.length;
        return (
          <figure key={i} className={styles.gallery}>
            <div className={items.length >= 4 ? styles.galleryGrid4 : styles.galleryGrid}>
              {items.map(f => (
                <div key={f.id} className={styles.galleryItem}>
                  <FigureImage figure={f} />
                  {showCaptions && <span><Inline text={f.caption} /></span>}
                </div>
              ))}
            </div>
            {b.caption && <figcaption className={styles.galleryCaption}><Inline text={b.caption} /></figcaption>}
          </figure>
        );
      }
      default:
        return null;
    }
  };
  // Built in a plain loop: rendering assigns exhibit numbers and anchors in order
  const body: ReactNode[] = [];
  for (let i = 0; i < article.blocks.length; i++) body.push(renderBlock(article.blocks[i], i));

  return (
    <article className={styles.page}>
      <ReadingProgress />

      {isDraft && (
        <div className={styles.draftBanner}>Draft preview — this report is not yet published.</div>
      )}

      {/* ── Masthead ───────────────────────────────────── */}
      <header className={styles.masthead}>
        <div className={styles.container}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/insights">Insights</Link>
            <span aria-hidden>/</span>
            <span>Research</span>
          </nav>
          <div className={styles.eyebrow}>{article.series || 'Research Report'}</div>
          <h1 className={styles.title}>{title}</h1>
          {dek && <p className={styles.dek}>{dek}</p>}
          <div className={styles.metaBar}>
            <div className={styles.meta}>
              <span className={styles.byline}>Knowith Capital</span>
              {publishedAt && <span>{formatDate(publishedAt)}</span>}
              {article.readingMinutes && <span>{article.readingMinutes} min read</span>}
              {article.pageCount && <span>{article.pageCount}-page report</span>}
            </div>
            <div className={styles.actions}>
              {pdfUrl && (
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className={styles.btnPrimary}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                  Download PDF
                </a>
              )}
              <ShareButton title={title} />
            </div>
          </div>
        </div>
      </header>

      {cover?.url && (
        <div className={styles.coverWrap}>
          <figure className={styles.cover}>
            <FigureImage figure={cover} />
          </figure>
        </div>
      )}

      {/* ── Body ───────────────────────────────────────── */}
      <div className={`${styles.container} ${styles.layout}`} id="report-body">
        <aside className={styles.aside}>
          <div className={styles.asideSticky}>
            {toc.length > 1 && <TableOfContents items={toc} />}
            {pdfUrl && (
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className={styles.asideDownload}>
                Download full report (PDF) →
              </a>
            )}
          </div>
        </aside>

        <div className={styles.main}>
          {article.keyTakeaways.length > 0 && (
            <section className={styles.takeaways} aria-label="Key takeaways">
              <div className={styles.takeawaysLabel}>Key takeaways</div>
              <ol>
                {article.keyTakeaways.map((t, i) => (
                  <li key={i}><span className={styles.takeawayNo}>{String(i + 1).padStart(2, '0')}</span><span>{t}</span></li>
                ))}
              </ol>
            </section>
          )}

          {body.map((node, i) => <Fragment key={i}>{node}</Fragment>)}

          <section className={styles.disclaimer}>
            <strong>Important information.</strong> This material is for educational purposes only and does not constitute investment advice or
            a recommendation to buy or sell any security. Mutual fund investments are subject to market risks; read all scheme-related documents
            carefully. Past performance is not indicative of future returns. Figures are as stated in the original publication and may have changed since.
          </section>
        </div>
      </div>

      {/* ── Call to action ─────────────────────────────── */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <div className={styles.ctaInner}>
            <div>
              <div className={styles.ctaEyebrow}>Put this into practice</div>
              <h2>Discuss what this means for your portfolio</h2>
              <p>Our advisors can help you translate these ideas into an allocation that fits your goals.</p>
            </div>
            <div className={styles.ctaActions}>
              <Link href="/contact" className={styles.btnGold}>Book a consultation</Link>
              {pdfUrl && <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className={styles.btnOnDark}>Download PDF</a>}
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className={styles.related}>
          <div className={styles.container}>
            <div className={styles.relatedHead}>
              <h2>More insights</h2>
              <Link href="/insights">View all →</Link>
            </div>
            <div className={styles.relatedGrid}>
              {related.map(r => (
                <Link key={r.id} href={`/insights/${r.id}`} className={styles.relatedCard}>
                  <div className={styles.relatedThumb}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {r.thumbnailUrl && <img src={r.thumbnailUrl} alt="" loading="lazy" />}
                  </div>
                  <div className={styles.relatedDate}>{formatDate(r.publishedAt)}</div>
                  <h3>{r.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
