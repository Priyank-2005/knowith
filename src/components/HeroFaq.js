"use client";

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import faqs from '@/lib/content/faqs';
import styles from './HeroFaq.module.css';

export default function HeroFaq() {
  const [open, setOpen] = useState(null);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.liveDot} aria-hidden />
        Investors are asking
      </div>

      <ul className={styles.list}>
        {faqs.map((item, i) => {
          const isOpen = open === i;
          return (
            <li key={item.q} className={`${styles.item} ${isOpen ? styles.itemOpen : ''}`}>
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
  );
}
