"use client";

import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

/* ─── Hero Carousel for Infographics ─── */
function InfographicCarousel({ items }) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [items.length, next]);

  if (items.length === 0) return null;

  return (
    <section className={styles.carouselSection}>
      <div className={styles.carouselContainer}>
        <AnimatePresence mode="wait">
          <motion.div
            key={items[current].id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className={styles.carouselSlide}
          >
            <img 
              src={items[current].contentUrl} 
              alt={items[current].title || "Infographic"}
              className={styles.carouselImage}
            />
          </motion.div>
        </AnimatePresence>

        {/* Dot indicators */}
        {items.length > 1 && (
          <div className={styles.carouselDots}>
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── Article Cards Grid ─── */
function ArticleCards({ items }) {
  if (items.length === 0) {
    return (
      <p style={{ color: 'var(--slate)', textAlign: 'center', padding: '3rem 0' }}>
        No articles available yet.
      </p>
    );
  }

  return (
    <motion.div 
      className={styles.articlesGrid}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={staggerContainer}
    >
      {items.map((item) => (
        <motion.div variants={fadeUp} key={item.id}>
          <Link href={`/insights/${item.id}`} className={styles.articleCard}>
            <div className={styles.articleThumb}>
              {item.thumbnailUrl ? (
                <img src={item.thumbnailUrl} alt={item.title} />
              ) : (
                <div className={styles.articleThumbPlaceholder}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
              )}
            </div>
            <div className={styles.articleContent}>
              <span className={styles.articleEyebrow}>Research Article</span>
              <h3 className={styles.articleTitle}>{item.title}</h3>
              {item.description && (
                <p className={styles.articleDesc}>{item.description}</p>
              )}
              <div className={styles.articleMeta}>
                <span>{new Date(item.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span className={styles.readMore}>Read Article →</span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ─── Main Insights Page ─── */
export default function Insights() {
  const [infographics, setInfographics] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/insights')
      .then(r => r.json())
      .then(d => {
        const all = d.insights || [];
        setInfographics(all.filter(i => i.type === 'INFOGRAPHIC'));
        setArticles(all.filter(i => i.type === 'ARTICLE'));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <main>
        {/* Page Header */}
        <section className={`section-light ${styles.header}`}>
          <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <motion.div variants={fadeUp} initial="hidden" animate="visible" className="eyebrow">Market Intelligence</motion.div>
            <motion.h1 variants={fadeUp} initial="hidden" animate="visible" className={styles.title}>Insights & Perspectives</motion.h1>
            <motion.p variants={fadeUp} initial="hidden" animate="visible" className={styles.subtitle}>
              Our latest thinking on markets, wealth strategy, and portfolio architecture.
            </motion.p>
          </div>
        </section>

        {/* Hero Carousel — Infographics */}
        {!loading && infographics.length > 0 && (
          <InfographicCarousel items={infographics} />
        )}

        {/* Article Cards */}
        <section className="section-light-2" style={{ paddingTop: '4rem', paddingBottom: '6rem' }}>
          <div className="container">
            <div className="eyebrow">Library</div>
            <h2 style={{ marginBottom: '32px' }}>Research & Articles</h2>
            {loading ? (
              <p style={{ color: 'var(--slate)' }}>Loading insights...</p>
            ) : (
              <ArticleCards items={articles} />
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
