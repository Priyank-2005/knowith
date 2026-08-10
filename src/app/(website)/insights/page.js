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

const insights = [
  { tag: 'Market Update', title: 'Navigating Volatility in Q3', desc: 'How structured asset allocation protects against downside risk during global market corrections and inflation fears.' },
  { tag: 'Taxation', title: 'New LTCG Rules Explained', desc: 'Adjusting your portfolio for optimal tax harvesting in light of the recent budget announcements.' },
  { tag: 'Retirement', title: 'The 4% Rule in India', desc: 'Why standard withdrawal rates need adjustment for domestic inflation and currency depreciation.' },
  { tag: 'Philosophy', title: 'The Cost of Chasing Alpha', desc: 'Why index funds and passive strategies are increasingly forming the core of institutional portfolios.' },
];

const faqs = [
  { q: 'How often is my portfolio reviewed?', a: 'We employ algorithmic tracking combined with quarterly human reviews. Rebalancing is strictly rules-based and occurs dynamically when asset classes drift beyond a 5% threshold.' },
  { q: 'What is your fee structure?', a: 'We operate on a transparent, fee-only model. You pay a fixed percentage based on Assets Under Management (AUM) with zero hidden commission grabs from mutual fund houses.' },
  { q: 'Do you offer direct equity advisory?', a: 'Yes. While mutual funds form the core of wealth distribution, we offer bespoke direct equity portfolios (PMS style) for High Net Worth Individuals.' },
  { q: 'How do I start the onboarding process?', a: 'The first step is a confidential discovery meeting. We will audit your existing assets, understand your liabilities, and architect a generational roadmap.' },
];

const newsItems = [
  { title: 'RBI maintains status quo', desc: 'The central bank keeps repo rate unchanged at 6.5% for the 8th consecutive meeting.' },
  { title: 'SEBI tightens derivative norms', desc: 'New regulations aim to curb excessive retail speculation in F&O segments.' },
  { title: 'Tech stocks rally globally', desc: 'AI-driven earnings propel major technology indices to record highs.' },
  { title: 'Gold prices stabilize', desc: 'Bullion finds support around ₹72,500 amid global geopolitical tensions.' },
];

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

        {/* 1. Moving News Cards (The UI requested) */}
        <section className="section-light" style={{paddingTop: '2rem'}}>
          <div className="container">
            <div className="eyebrow">Latest Updates</div>
            <h2 style={{marginBottom: '24px'}}>Breaking Financial News</h2>
          </div>
          <div className={styles.marqueeWrapper}>
            <div className={styles.marqueeTrack}>
              {[...newsItems, ...newsItems].map((news, i) => (
                <div key={i} className={styles.newsCard}>
                  <div className="eyebrow" style={{marginBottom: '8px'}}>JUST IN</div>
                  <h4>{news.title}</h4>
                  <p>{news.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 2. Static Long-form Blogs */}
        <section className="section-light-2">
          <div className="container">
            <div className="eyebrow">Deep Dives</div>
            <h2 style={{marginBottom: '24px'}}>Research Notes</h2>
            <motion.div 
              className={`hairline-grid hairline-grid-light ${styles.grid}`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              {insights.map((article, i) => (
                <motion.div variants={fadeUp} key={i} className={`hairline-cell-light ${styles.card}`}>
                  <div className={styles.media}></div>
                  <div className={styles.content}>
                    <div className="eyebrow" style={{marginBottom: 0}}>{article.tag}</div>
                    <h3>{article.title}</h3>
                    <p>{article.desc}</p>
                    <a href="#" className={styles.readLink}>Read the note &rarr;</a>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* 3. Moving FAQs (The old requested UI) */}
        <section className="section-dark">
          <div className="container">
            <div className="eyebrow">Clarity</div>
            <h2 style={{color: 'var(--marble)'}}>Client Inquiries</h2>
            <p style={{color: 'var(--on-dark-soft)', marginBottom: '40px'}}>Answers to the most common questions our advisors receive.</p>
          </div>
          
          <div className={styles.marqueeWrapper}>
            {/* We use reverse scroll direction here for visual variety */}
            <div className={`${styles.marqueeTrack} ${styles.reverse}`}>
              {[...faqs, ...faqs].map((faq, i) => (
                <div key={i} className={styles.faqCard}>
                  <h4>{faq.q}</h4>
                  <p>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
