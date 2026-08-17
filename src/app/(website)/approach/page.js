"use client";

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';
import Link from 'next/link';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function Approach() {
  return (
    <>
      <Navbar />
      <main>
        {/* Header Section */}
        <section className={styles.header}>
          <div className="container">
            <motion.div variants={fadeUp} initial="hidden" animate="visible" className="eyebrow" style={{ color: 'var(--gold)' }}>Knowith Capital</motion.div>
            <motion.h1 variants={fadeUp} initial="hidden" animate="visible" className={styles.title}>Fund Selection Philosophy & Process</motion.h1>
            <motion.div variants={fadeUp} initial="hidden" animate="visible" className={styles.fiduciaryBadge}>
              <h3>K</h3>
              <p>Right Knowledge • Right Faith • Right Conduct</p>
              <div style={{ fontSize: '10px', marginTop: '4px', letterSpacing: '0.1em', opacity: 0.7 }}>The Fiduciary Standard</div>
            </motion.div>
          </div>
        </section>

        {/* The 3C Portfolio Architecture */}
        <section className={styles.architectureSection}>
          <div className="container">
            <motion.h2 
              variants={fadeUp} 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }} 
              className={styles.sectionTitle}
            >
              The 3C Portfolio Architecture
            </motion.h2>

            <motion.div 
              className={styles.threeGrid}
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              {/* Pillar 1: Core */}
              <motion.div variants={fadeUp} className={styles.pillarCard}>
                <div className={styles.pillarHeader}>
                  <svg className={styles.pillarIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                  <div>
                    <h3 className={styles.pillarTitle}>CORE</h3>
                    <div className={styles.pillarSubtitle}>(Dynamic Engine)</div>
                  </div>
                </div>
                <ul className={styles.pillarList}>
                  <li>Dynamic & Thematic</li>
                  <li>Funds Doing Well</li>
                  <li>Market Alignment</li>
                </ul>
                <div className={styles.pillarOutcome}>
                  <h4>Dynamic Positioning</h4>
                  <p>Structural Themes</p>
                </div>
              </motion.div>

              {/* Pillar 2: Consistent */}
              <motion.div variants={fadeUp} className={styles.pillarCard}>
                <div className={styles.pillarHeader}>
                  <svg className={styles.pillarIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v20" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                  <div>
                    <h3 className={styles.pillarTitle}>CONSISTENT</h3>
                    <div className={styles.pillarSubtitle}>(Anchor)</div>
                  </div>
                </div>
                <ul className={styles.pillarList}>
                  <li>Unwavering Philosophy</li>
                  <li>Disciplined Communication</li>
                  <li>Avoid "Fads"</li>
                </ul>
                <div className={styles.pillarOutcome}>
                  <h4>Predictable Outcomes</h4>
                  <p>Long Horizons</p>
                </div>
              </motion.div>

              {/* Pillar 3: Contrarian */}
              <motion.div variants={fadeUp} className={styles.pillarCard}>
                <div className={styles.pillarHeader}>
                  <svg className={styles.pillarIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                  <div>
                    <h3 className={styles.pillarTitle}>CONTRARIAN</h3>
                    <div className={styles.pillarSubtitle}>(Catalyst)</div>
                  </div>
                </div>
                <ul className={styles.pillarList}>
                  <li>Temporary Underperformance</li>
                  <li>Mean Reversion Opportunities</li>
                  <li>Catalyst Identification</li>
                </ul>
                <div className={styles.pillarOutcome}>
                  <h4>Turnaround Signals</h4>
                  <p>Shift in Macro</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Allocation Banner */}
        <section className={styles.allocationBanner}>
          <div className="container">
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <motion.h2 variants={fadeUp}>Balanced Portfolio Allocation &rarr; Goal</motion.h2>
              <motion.p variants={fadeUp}>Optimal Alpha & Risk Management</motion.p>
            </motion.div>
          </div>
        </section>

        {/* The Knowith Selection Matrix */}
        <section className={styles.matrixSection}>
          <div className="container">
            <motion.h2 
              variants={fadeUp} 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }} 
              className={styles.sectionTitle}
            >
              The Knowith Selection Matrix
            </motion.h2>

            <motion.div 
              className={styles.matrixGrid}
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              {/* Column A */}
              <motion.div variants={fadeUp} className={styles.matrixCol}>
                <div className={styles.matrixHeader}>
                  <h3>A. QUANTITATIVE RIGOR</h3>
                  <span>(The Science)</span>
                </div>
                
                <div className={styles.matrixItem}>
                  <h4>Risk-Adjusted Returns</h4>
                  <div className={styles.matrixSubList}>
                    <span className={styles.matrixBadge}>Jensen's Alpha</span>
                  </div>
                </div>

                <div className={styles.matrixItem}>
                  <h4>Consistency Metrics</h4>
                  <div className={styles.matrixSubList}>
                    <span className={styles.matrixBadge}>Rolling Returns</span>
                    <span className={styles.matrixBadge}>Market Returns</span>
                    <span className={styles.matrixBadge}>Quartile Consistency</span>
                  </div>
                </div>

                <div className={styles.matrixItem}>
                  <h4>Market Capture</h4>
                  <div className={styles.matrixSubList}>
                    <span className={styles.matrixBadge}>Up-Down Capture Ratio</span>
                  </div>
                </div>
              </motion.div>

              {/* Column B */}
              <motion.div variants={fadeUp} className={styles.matrixCol}>
                <div className={styles.matrixHeader}>
                  <h3>B. QUALITATIVE INSIGHT</h3>
                  <span>(The Art)</span>
                </div>
                
                <div className={styles.matrixItem}>
                  <h4>Right Conduct of Management</h4>
                  <div className={styles.matrixSubList}>
                    <span className={styles.matrixBadge}>Fiduciary-First Culture</span>
                  </div>
                </div>

                <div className={styles.matrixItem}>
                  <h4>Philosophy Integrity</h4>
                  <div className={styles.matrixSubList}>
                    <span className={styles.matrixBadge}>No "Style Grift"</span>
                  </div>
                </div>

                <div className={styles.matrixItem}>
                  <h4>Operational Robustness</h4>
                  <div className={styles.matrixSubList}>
                    <span className={styles.matrixBadge}>Independent Risk Management</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Conclusion */}
        <section className={styles.conclusion}>
          <div className="container">
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <motion.div variants={fadeUp} style={{ marginBottom: '2rem' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" style={{ display: 'block', margin: '0 auto' }}>
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', marginTop: '1rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Result</div>
                <h3 className={styles.conclusionH3}>High-Conviction Funds</h3>
              </motion.div>
              <motion.h2 variants={fadeUp}>Synthesizing Rigor & Insight, Guided by Principle.</motion.h2>
              <motion.p variants={fadeUp}>Build a Legacy with Knowith Capital.</motion.p>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
