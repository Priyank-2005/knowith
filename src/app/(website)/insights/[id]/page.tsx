import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import sanitizeHtml from 'sanitize-html';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth/guards';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ReportArticle from '@/components/insights/ReportArticle';
import { ArticleSchema } from '@/lib/insights/articleTypes';
import styles from '../page.module.css';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ preview?: string }>;
};

// Editor HTML is stored as-is; strip scripts/handlers before rendering
const cleanHtml = (html: string) =>
  sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'span', 'u', 's', 'sub', 'sup']),
    allowedAttributes: { '*': ['style', 'class'], a: ['href', 'target', 'rel'], img: ['src', 'alt', 'width', 'height'] },
  });

const getInsight = cache((id: string) => prisma.insight.findUnique({ where: { id } }));

async function loadVisible(props: PageProps) {
  const [{ id }, { preview }] = await Promise.all([props.params, props.searchParams]);
  const insight = await getInsight(id);
  if (!insight) return null;
  // Drafts are visible only to signed-in admins previewing them
  if (!insight.isActive && !(preview === '1' && (await getAdminSession()))) return null;
  return insight;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const insight = await loadVisible(props);
  if (!insight) return { title: 'Insight not found | Knowith Capital' };
  return {
    title: `${insight.title} | Knowith Capital Insights`,
    description: insight.description || undefined,
    robots: insight.isActive ? undefined : { index: false, follow: false },
    openGraph: {
      type: 'article',
      title: insight.title,
      description: insight.description || undefined,
      images: insight.thumbnailUrl ? [{ url: insight.thumbnailUrl }] : undefined,
    },
  };
}

export default async function InsightDetailPage(props: PageProps) {
  const insight = await loadVisible(props);
  if (!insight) notFound();

  const article = insight.type === 'REPORT' ? ArticleSchema.safeParse(insight.article) : null;

  if (article?.success) {
    const related = await prisma.insight.findMany({
      where: { isActive: true, id: { not: insight.id }, type: { in: ['REPORT', 'ARTICLE'] } },
      orderBy: { publishedAt: 'desc' },
      take: 3,
      select: { id: true, title: true, description: true, thumbnailUrl: true, publishedAt: true },
    });
    return (
      <>
        <Navbar />
        <main>
          <ReportArticle
            article={article.data}
            title={insight.title}
            description={insight.description}
            publishedAt={insight.publishedAt}
            pdfUrl={insight.contentUrl}
            isDraft={!insight.isActive}
            related={related}
          />
        </main>
        <Footer />
      </>
    );
  }

  // Articles written in the admin editor (HTML body)
  return (
    <>
      <Navbar />
      <main className={styles.detailPage}>
        {insight.thumbnailUrl && (
          <div className={styles.detailHero}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={insight.thumbnailUrl} alt={insight.title} />
          </div>
        )}

        <div className={styles.detailContainer} style={!insight.thumbnailUrl ? { marginTop: '40px' } : undefined}>
          <span className={styles.detailEyebrow}>Research Article</span>
          <h1 className={styles.detailTitle}>{insight.title}</h1>
          <div className={styles.detailDate}>
            {insight.publishedAt?.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>

          {insight.contentBody ? (
            <div className={`${styles.detailBody} quill-content`} dangerouslySetInnerHTML={{ __html: cleanHtml(insight.contentBody) }} />
          ) : insight.description ? (
            <div className={styles.detailBody}><p>{insight.description}</p></div>
          ) : (
            <p style={{ color: 'var(--slate-soft)', fontStyle: 'italic' }}>Article content is being prepared. Please check back soon.</p>
          )}

          {insight.contentUrl?.toLowerCase().includes('.pdf') && (
            <p style={{ marginTop: '32px' }}>
              <a href={insight.contentUrl} target="_blank" rel="noopener noreferrer" className={styles.backLink}>Download PDF →</a>
            </p>
          )}
        </div>

        <div className={styles.detailBottom}>
          <Link href="/insights" className={styles.backLink}>← Back to all insights</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
