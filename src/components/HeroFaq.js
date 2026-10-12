"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import defaultFaqs from '@/lib/content/faqs';
import styles from './HeroFaq.module.css';

export default function HeroFaq() {
  // Starts with the built-in questions and swaps in the list managed in Admin → FAQs
  const [faqs, setFaqs] = useState(defaultFaqs);
  const [open, setOpen] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/v1/faqs')
      .then(res => (res.ok ? res.json() : null))
      .then(json => {
        if (!cancelled && Array.isArray(json?.faqs) && json.faqs.length > 0) setFaqs(json.faqs);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // Show a fade at the bottom while there is more to scroll to
  const updateHasMore = useCallback(() => {
    const el = listRef.current;
    if (el) setHasMore(el.scrollHeight - el.scrollTop - el.clientHeight > 8);
  }, []);

  useEffect(() => {
    updateHasMore();
    const el = listRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(updateHasMore);
    ro.observe(el);
    return () => ro.disconnect();
  }, [faqs, open, updateHasMore]);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.liveDot} aria-hidden />
        Investors are asking
      </div>

      <div className={`${styles.listWrap} ${hasMore ? styles.hasMore : ''}`}>
        <ul className={styles.list} ref={listRef} onScroll={updateHasMore} tabIndex={0} aria-label="Frequently asked questions">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={`${i}-${item.q}`} className={`${styles.item} ${isOpen ? styles.itemOpen : ''}`}>
                <button
                  type="button"
                  className={styles.question}
                  aria-expanded={isOpen}
                  aria-controls={`hero-faq-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span className={styles.qIcon} aria-hidden>?</span>
                  <span className={styles.qText}>{item.q}</span>
                  <span className={styles.chevron} aria-hidden>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`hero-faq-${i}`}
                      className={styles.answerWrap}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                    >
                      <div className={styles.answer}>
                        <p>{item.a}</p>
                        <Link href="/contact" className={styles.cta}>
                          For more details, book a consultation →
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
