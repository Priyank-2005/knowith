"use client";

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';
import { useState } from 'react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const tools = [
  { id: 'sip', title: 'SIP Calculator', desc: 'Plan your investment corpus and generate reliable wealth.', highlighted: false },
  { id: 'stepup', title: 'Step Up SIP Calculator', desc: 'Plan for inflation with our advanced step-up calculator with annual increments.', highlighted: true },
  { id: 'lumpsum', title: 'LumpSum Calculator', desc: 'Calculate the potential long-term growth of your one-time investments.', highlighted: false },
  { id: 'emi', title: 'EMI Calculator', desc: 'Calculate your loan EMI, total interest, and test prepayment support.', highlighted: false },
  { id: 'swp', title: 'SWP with Step Up', desc: 'Estimate your future retirement corpus and optimize systematic withdrawal.', highlighted: false },
  { id: 'loan', title: 'Early Loan Closure', desc: 'Build immense passive wealth by increasing loan tenure and investing savings.', highlighted: false },
];

export default function Calculators() {
  const [activeCalc, setActiveCalc] = useState(null);

  // SIP State
  const [sipAmount, setSipAmount] = useState(5000);
  const [sipYears, setSipYears] = useState(10);
  const [sipReturn, setSipReturn] = useState(12);

  // Lumpsum State
  const [lumpAmount, setLumpAmount] = useState(100000);
  const [lumpYears, setLumpYears] = useState(10);
  const [lumpReturn, setLumpReturn] = useState(12);

  const calculateSIP = () => {
    const P = sipAmount;
    const n = sipYears * 12;
    const i = sipReturn / 12 / 100;
    const M = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const invested = P * n;
    return { invested, wealth: M, gain: M - invested };
  };

  const calculateLumpsum = () => {
    const P = lumpAmount;
    const n = lumpYears;
    const r = lumpReturn / 100;
    const A = P * Math.pow(1 + r, n);
    return { invested: P, wealth: A, gain: A - P };
  };

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

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
                <motion.div 
                  key={tool.id} 
                  variants={fadeUp} 
                  className={`hairline-cell-light ${styles.toolCard}`}
                  onClick={() => {
                    if(tool.id === 'sip' || tool.id === 'lumpsum') setActiveCalc(tool.id);
                    else alert("This calculator is coming soon!");
                  }}
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
              ))}
            </motion.div>
          </div>
        </section>
      </main>

      {/* SIP Calculator Modal */}
      {activeCalc === 'sip' && (
        <div className={styles.calcOverlay} onClick={() => setActiveCalc(null)}>
          <div className={styles.calcModal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setActiveCalc(null)}>×</button>
            <h2>SIP Calculator</h2>
            
            <div className={styles.formGroup}>
              <label>Monthly Investment <span>{formatCurrency(sipAmount)}</span></label>
              <input type="range" min="500" max="100000" step="500" value={sipAmount} onChange={(e) => setSipAmount(Number(e.target.value))} />
            </div>
            <div className={styles.formGroup}>
              <label>Expected Return Rate (p.a) <span>{sipReturn}%</span></label>
              <input type="range" min="1" max="30" step="0.5" value={sipReturn} onChange={(e) => setSipReturn(Number(e.target.value))} />
            </div>
            <div className={styles.formGroup}>
              <label>Time Period (Years) <span>{sipYears} Yr</span></label>
              <input type="range" min="1" max="40" step="1" value={sipYears} onChange={(e) => setSipYears(Number(e.target.value))} />
            </div>

            <div className={styles.resultsBox}>
              <div className={styles.resultRow}>
                <span>Invested Amount</span>
                <span>{formatCurrency(calculateSIP().invested)}</span>
              </div>
              <div className={styles.resultRow}>
                <span>Est. Returns</span>
                <span style={{color: 'var(--gold)'}}>{formatCurrency(calculateSIP().gain)}</span>
              </div>
              <div className={`${styles.resultRow} ${styles.total}`}>
                <span>Total Value</span>
                <span>{formatCurrency(calculateSIP().wealth)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lumpsum Calculator Modal */}
      {activeCalc === 'lumpsum' && (
        <div className={styles.calcOverlay} onClick={() => setActiveCalc(null)}>
          <div className={styles.calcModal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setActiveCalc(null)}>×</button>
            <h2>Lumpsum Calculator</h2>
            
            <div className={styles.formGroup}>
              <label>Total Investment <span>{formatCurrency(lumpAmount)}</span></label>
              <input type="range" min="5000" max="10000000" step="5000" value={lumpAmount} onChange={(e) => setLumpAmount(Number(e.target.value))} />
            </div>
            <div className={styles.formGroup}>
              <label>Expected Return Rate (p.a) <span>{lumpReturn}%</span></label>
              <input type="range" min="1" max="30" step="0.5" value={lumpReturn} onChange={(e) => setLumpReturn(Number(e.target.value))} />
            </div>
            <div className={styles.formGroup}>
              <label>Time Period (Years) <span>{lumpYears} Yr</span></label>
              <input type="range" min="1" max="40" step="1" value={lumpYears} onChange={(e) => setLumpYears(Number(e.target.value))} />
            </div>

            <div className={styles.resultsBox}>
              <div className={styles.resultRow}>
                <span>Invested Amount</span>
                <span>{formatCurrency(calculateLumpsum().invested)}</span>
              </div>
              <div className={styles.resultRow}>
                <span>Est. Returns</span>
                <span style={{color: 'var(--gold)'}}>{formatCurrency(calculateLumpsum().gain)}</span>
              </div>
              <div className={`${styles.resultRow} ${styles.total}`}>
                <span>Total Value</span>
                <span>{formatCurrency(calculateLumpsum().wealth)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
