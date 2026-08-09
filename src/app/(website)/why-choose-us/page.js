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
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function WhyChooseUs() {
  return (
    <>
      <Navbar />
      <main>
        <section className={`section-light ${styles.header}`}>
          <div className="container" style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <motion.div variants={fadeUp} initial="hidden" animate="visible" className="eyebrow">Differentiators</motion.div>
            <motion.h1 variants={fadeUp} initial="hidden" animate="visible" className={styles.title}>Why Choose Knowith Capital?</motion.h1>
            <motion.p variants={fadeUp} initial="hidden" animate="visible" className={styles.subtitle}>
              We build relationships, not just portfolios. Here is what sets us apart.
            </motion.p>
          </div>
        </section>

        <section className="section-light-2">
          <div className="container">
            <motion.div 
              className={`hairline-grid hairline-grid-light ${styles.featuresGrid}`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeUp} className={`hairline-cell-light ${styles.featureCard}`}>
                <div className={styles.iconWrapper}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
                </div>
                <h3>Legacy of Trust</h3>
                <p>Over a decade of unwavering commitment to client success.</p>
              </motion.div>

              <motion.div variants={fadeUp} className={`hairline-cell-light ${styles.featureCard}`}>
                <div className={styles.iconWrapper}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <h3>Founder-Led</h3>
                <p>Direct involvement of founding partners in high-level strategy.</p>
              </motion.div>

              <motion.div variants={fadeUp} className={`hairline-cell-light ${styles.featureCard}`}>
                <div className={styles.iconWrapper}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/><path d="M3 18l6-6-6-6"/></svg>
                </div>
                <h3>Customized Roadmaps</h3>
                <p>Tailor-made plans that evolve with your life stages.</p>
              </motion.div>

              <motion.div variants={fadeUp} className={`hairline-cell-light ${styles.featureCard}`}>
                <div className={styles.iconWrapper}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                </div>
                <h3>Continuous Review</h3>
                <p>Proactive portfolio rebalancing to manage risk.</p>
              </motion.div>

              <motion.div variants={fadeUp} className={`hairline-cell-light ${styles.featureCard}`}>
                <div className={styles.iconWrapper}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                </div>
                <h3>Full Transparency</h3>
                <p>Fee-only models available with zero hidden charges.</p>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
