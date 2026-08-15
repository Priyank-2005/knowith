"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from '../calculator.module.css';

export default function LumpsumCalculator() {
  const [lumpAmount, setLumpAmount] = useState(500000);
  const [returnRate, setReturnRate] = useState(12);
  const [years, setYears] = useState(10);

  // Math for Lumpsum
  const calculateLumpsum = () => {
    const P = lumpAmount;
    const n = years;
    const r = returnRate / 100;
    const A = P * Math.pow(1 + r, n);
    return { invested: P, wealth: A, gain: A - P };
  };

  const { invested, wealth, gain } = calculateLumpsum();

  const maxWealth = wealth;
  const percentInvested = maxWealth > 0 ? (invested / maxWealth) * 100 : 0;
  const percentGain = maxWealth > 0 ? (gain / maxWealth) * 100 : 0;

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Math.max(0, val));

  return (
    <>
      <Navbar />
      <main className="section-light">
        <div className={styles.calcContainer}>
          {/* Left Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className={styles.calcLeft}>
            <div className={styles.eyebrow}>Wealth Tools</div>
            <h1 className={styles.title}>Lumpsum Calculator</h1>
            <p className={styles.desc}>
              Calculate the potential long-term growth of your one-time investments. Perfect for bonuses or inheritances.
            </p>

            <div className={styles.calcForm}>
              <div className={styles.formGroup}>
                <label>Total Investment <span>{formatCurrency(lumpAmount)}</span></label>
                <input type="range" min="10000" max="10000000" step="10000" value={lumpAmount} onChange={(e) => setLumpAmount(Number(e.target.value))} />
              </div>
              
              <div className={styles.formGroup}>
                <label>Expected Return (p.a) <span>{returnRate}%</span></label>
                <input type="range" min="5" max="25" step="0.5" value={returnRate} onChange={(e) => setReturnRate(Number(e.target.value))} />
              </div>
              
              <div className={styles.formGroup}>
                <label>Investment Horizon <span>{years} Years</span></label>
                <input type="range" min="1" max="40" step="1" value={years} onChange={(e) => setYears(Number(e.target.value))} />
              </div>
            </div>
          </motion.div>

          {/* Right Results */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className={styles.calcRight}>
            <div className={styles.resultsCard}>
              
              <div className={styles.resultRow}>
                <span className={styles.resultLabel}>Invested Amount</span>
                <span className={styles.resultValue}>{formatCurrency(invested)}</span>
              </div>

              <div className={styles.resultRow}>
                <span className={styles.resultLabel}>Est. Wealth Gained</span>
                <span className={styles.resultValue} style={{color: 'var(--gold)'}}>+{formatCurrency(gain)}</span>
              </div>

              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Total Wealth</span>
                <div className={styles.totalValue}>{formatCurrency(wealth)}</div>
              </div>

              <div className={styles.chartContainer}>
                <div className={styles.barRow}>
                  <div className={styles.barLabel}>Wealth Gained</div>
                  <div className={styles.barWrapper}>
                    <div className={styles.barFill} style={{ width: `${percentGain}%` }}></div>
                  </div>
                </div>
                <div className={styles.barRow}>
                  <div className={styles.barLabel}>Amount Invested</div>
                  <div className={styles.barWrapper}>
                    <div className={`${styles.barFill} ${styles.alt}`} style={{ width: `${percentInvested}%`, background: 'rgba(255,255,255,0.4)' }}></div>
                  </div>
                </div>
              </div>

            </div>
            
            <p className={styles.disclaimer}>
              *Returns are for illustrative purposes only. Mutual fund investments are subject to market risks.
            </p>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
