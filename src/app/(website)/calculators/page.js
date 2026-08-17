"use client";

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';
import { useState } from 'react';

import Link from 'next/link';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const tools = [
  { id: 'narrative-planner', title: 'Narrative Planner', desc: 'Don\'t worry about forms and fields. Just tell us your story, and we\'ll map out your future.', highlighted: true, path: '/calculators/narrative-planner' },
  { id: 'smart-sip', title: 'Smart SIP Calculator', desc: 'Plan your investment corpus, calculate exact wealth, and visualize the true cost of delaying your investments.', highlighted: false, path: '/calculators/smart-sip' },
  { id: 'fire', title: 'F.I.R.E. Calculator', desc: 'Financial Independence, Retire Early. Calculate exactly how much money you need to retire comfortably.', highlighted: false, path: '/calculators/fire' },
  { id: 'stepup', title: 'Step Up SIP Calculator', desc: 'Plan for inflation with our advanced step-up calculator with annual increments to build exponential wealth.', highlighted: false, path: '/calculators/step-up-sip' },
  { id: 'lumpsum', title: 'LumpSum Calculator', desc: 'Calculate the potential long-term growth of your one-time investments (like bonuses or inheritances).', highlighted: false, path: '/calculators/lump-sum' },
  { id: 'emi', title: 'EMI Calculator', desc: 'Calculate your loan EMI, total interest paid, and see exactly where your monthly payments are going.', highlighted: false, path: '/calculators/emi' },
  { id: 'swp', title: 'SWP Calculator', desc: 'Estimate your future retirement corpus and optimize your systematic withdrawal plan (SWP).', highlighted: false, path: '/calculators/swp' },
  { id: 'loan', title: 'Early Loan Closure', desc: 'See how making small extra monthly prepayments can shave years off your loan and save you millions.', highlighted: false, path: '/calculators/early-loan-closure' },
];

export default function Calculators() {
  return (
    <>
      <Navbar />
      <main>
        <section className={`section-light ${styles.header}`}>
          <div className="container" style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <motion.div variants={fadeUp} initial="hidden" animate="visible" className="eyebrow">Financial Toolkit</motion.div>
            <motion.h1 variants={fadeUp} initial="hidden" animate="visible" className={styles.title}>Calculators</motion.h1>
            <motion.p variants={fadeUp} initial="hidden" animate="visible" className={styles.subtitle}>
              Smart tools and insights to help you make better money decisions on the go.
            </motion.p>
          </div>
        </section>

        <section className="section-light-2">
          <div className="container">
            <motion.div 
              className={`hairline-grid hairline-grid-light ${styles.toolsGrid}`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              {tools.map((tool) => (
                <Link href={tool.path} key={tool.id} passHref style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  <motion.div 
                    variants={fadeUp} 
                    className={`hairline-cell-light ${styles.toolCard}`}
                  >
                    <div className={styles.iconWrapper}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="16" y1="14" x2="16" y2="14"/><line x1="12" y1="14" x2="12" y2="14"/><line x1="8" y1="14" x2="8" y2="14"/><line x1="16" y1="18" x2="16" y2="18"/><line x1="12" y1="18" x2="12" y2="18"/><line x1="8" y1="18" x2="8" y2="18"/><line x1="16" y1="10" x2="16" y2="10"/><line x1="12" y1="10" x2="12" y2="10"/><line x1="8" y1="10" x2="8" y2="10"/></svg>
                    </div>
                    <h3>{tool.title}</h3>
                    <p>{tool.desc}</p>
                    <div className={styles.launchLink}>
                      Launch Tool &rarr;
                    </div>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
