"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import styles from '../page.module.css';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

export default function InsightDetailPage() {
  const params = useParams();
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/v1/insights/${params.id}`)
      .then(r => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then(d => setInsight(d.insight))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className={styles.detailPage}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: 'var(--slate)' }}>
            Loading article...
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !insight) {
    return (
      <>
        <Navbar />
        <main className={styles.detailPage}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '16px' }}>
            <h2 style={{ color: 'var(--ink)' }}>Article not found</h2>
            <Link href="/insights" className={styles.backLink}>← Back to Insights</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className={styles.detailPage}>
        {/* Hero Image */}
        {insight.thumbnailUrl && (
          <motion.div
            className={styles.detailHero}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <img src={insight.thumbnailUrl} alt={insight.title} />
          </motion.div>
        )}

        {/* Article Content */}
        <motion.div 
          className={styles.detailContainer}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          style={!insight.thumbnailUrl ? { marginTop: '40px' } : undefined}
        >
          <span className={styles.detailEyebrow}>Research Article</span>
          <h1 className={styles.detailTitle}>{insight.title}</h1>
          <div className={styles.detailDate}>
            {insight.publishedAt && new Date(insight.publishedAt).toLocaleDateString('en-IN', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </div>
          
          {insight.contentBody ? (
            <div 
              className={`${styles.detailBody} quill-content`}
              dangerouslySetInnerHTML={{ __html: insight.contentBody }}
            />
          ) : insight.description ? (
            <div className={styles.detailBody}>
              <p>{insight.description}</p>
            </div>
          ) : (
            <p style={{ color: 'var(--slate-soft)', fontStyle: 'italic' }}>
              Article content is being prepared. Please check back soon.
            </p>
          )}
        </motion.div>

        {/* Back Link */}
        <div className={styles.detailBottom}>
          <Link href="/insights" className={styles.backLink}>
            ← Back to all insights
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
