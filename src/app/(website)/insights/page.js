"use client";

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

import React, { useState, useEffect } from 'react';

function InsightsList() {
  const [items, setItems] = useState([]);
  
  useEffect(() => {
    fetch('/api/v1/insights').then(r => r.json()).then(d => {
      if (d.insights) setItems(d.insights);
    });
  }, []);

  return (
    <motion.div 
      className={`hairline-grid hairline-grid-light ${styles.grid}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
    >
      {items.length === 0 && <p style={{ gridColumn: '1 / -1', color: 'var(--slate)' }}>No insights available yet.</p>}
      {items.map((item, i) => {
        if (item.type === 'INFOGRAPHIC') {
          return (
            <motion.div variants={fadeUp} key={item.id} className={`hairline-cell-light ${styles.card}`} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '200px', width: '100%', background: `url(${item.contentUrl}) center/cover no-repeat`, borderBottom: '1px solid var(--border-light)' }}></div>
              <div className={styles.content}>
                <div className="eyebrow" style={{marginBottom: 0}}>Infographic</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <a href={item.contentUrl} target="_blank" rel="noreferrer" className={styles.readLink}>View Full Image &rarr;</a>
              </div>
            </motion.div>
          );
        } else {
          return (
            <motion.div variants={fadeUp} key={item.id} className={`hairline-cell-light ${styles.card}`} style={{ background: '#f8fafc' }}>
              <div className={styles.content} style={{ padding: '2.5rem' }}>
                <div className="eyebrow" style={{marginBottom: 0}}>Research Article</div>
                <h3 style={{ fontSize: '1.8rem', margin: '1rem 0' }}>{item.title}</h3>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem' }}>{item.description}</p>
                <a href={item.contentUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-block', padding: '0.75rem 1.5rem', background: 'var(--ink)', color: 'white', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }}>Read PDF Report</a>
              </div>
            </motion.div>
          );
        }
      })}
    </motion.div>
  );
}

export default function Insights() {
  return (
    <>
      <Navbar />
      <main>

        <section className={`section-light ${styles.header}`}>
          <div className="container" style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <motion.div variants={fadeUp} initial="hidden" animate="visible" className="eyebrow">Market Intelligence</motion.div>
            <motion.h1 variants={fadeUp} initial="hidden" animate="visible" className={styles.title}>Insights & Perspectives</motion.h1>
            <motion.p variants={fadeUp} initial="hidden" animate="visible" className={styles.subtitle}>
              Our latest thinking on markets, wealth strategy, and portfolio architecture.
            </motion.p>
          </div>
        </section>

        {/* Uploaded Insights (Articles & Infographics) */}
        <section className="section-light-2" style={{paddingTop: '2rem', paddingBottom: '6rem'}}>
          <div className="container">
            <div className="eyebrow">Library</div>
            <h2 style={{marginBottom: '24px'}}>Research & Infographics</h2>
            
            <InsightsList />

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
