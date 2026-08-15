"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from '../calculator.module.css';

export default function SmartSIPCalculator() {
  const [monthlyInvest, setMonthlyInvest] = useState(10000);
  const [returnRate, setReturnRate] = useState(12);
  const [years, setYears] = useState(20);
  const [delayMonths, setDelayMonths] = useState(12);

  // Math
  const P = monthlyInvest;
  const r = returnRate / 12 / 100;
  
  // Start Now
  const nNow = years * 12;
  const wealthNow = P * ((Math.pow(1 + r, nNow) - 1) / r) * (1 + r);
  const investedNow = P * nNow;

  // Start Later (Delayed)
  const nLater = nNow - delayMonths;
  const wealthLater = nLater > 0 ? P * ((Math.pow(1 + r, nLater) - 1) / r) * (1 + r) : 0;
  const investedLater = nLater > 0 ? P * nLater : 0;

  const costOfDelay = wealthNow - wealthLater;

  // Max for charts
  const maxWealth = wealthNow;
  const percentNow = 100;
  const percentLater = maxWealth > 0 ? (wealthLater / maxWealth) * 100 : 0;

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Math.max(0, val));

  return (
    <>
      <Navbar />
      <main className="section-light">
        <div className={styles.calcContainer}>
          {/* Left Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className={styles.calcLeft}>
            <div className={styles.eyebrow}>Wealth Tools</div>
            <h1 className={styles.title}>Smart SIP & Cost of Delay</h1>
            <p className={styles.desc}>
              See exactly how much wealth you lose by delaying your investment journey. Procrastination is the biggest enemy of compounding.
            </p>

            <div className={styles.calcForm}>
              <div className={styles.formGroup}>
                <label>Monthly Investment <span>{formatCurrency(monthlyInvest)}</span></label>
                <input type="range" min="1000" max="200000" step="1000" value={monthlyInvest} onChange={(e) => setMonthlyInvest(Number(e.target.value))} />
              </div>
              
              <div className={styles.formGroup}>
                <label>Expected Return (p.a) <span>{returnRate}%</span></label>
                <input type="range" min="5" max="25" step="0.5" value={returnRate} onChange={(e) => setReturnRate(Number(e.target.value))} />
              </div>
              
              <div className={styles.formGroup}>
                <label>Investment Horizon <span>{years} Years</span></label>
                <input type="range" min="5" max="40" step="1" value={years} onChange={(e) => setYears(Number(e.target.value))} />
              </div>

              <div className={styles.formGroup} style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border-light)'}}>
                <label style={{color: '#ef4444'}}>I plan to delay starting by <span>{delayMonths} Months</span></label>
                <input type="range" min="0" max="60" step="1" value={delayMonths} onChange={(e) => setDelayMonths(Number(e.target.value))} style={{accentColor: '#ef4444'}}/>
              </div>
            </div>
          </motion.div>

          {/* Right Results */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className={styles.calcRight}>
            <div className={styles.resultsCard}>
              
              <div className={styles.resultRow}>
                <span className={styles.resultLabel}>Invested Amount (If Start Now)</span>
                <span className={styles.resultValue}>{formatCurrency(investedNow)}</span>
              </div>
              
              <div className={styles.resultRow}>
                <span className={styles.resultLabel}>Future Wealth (If Start Now)</span>
                <span className={styles.resultValue}>{formatCurrency(wealthNow)}</span>
              </div>

              <div className={styles.resultRow}>
                <span className={styles.resultLabel}>Future Wealth (If Delayed)</span>
                <span className={styles.resultValue}>{formatCurrency(wealthLater)}</span>
              </div>

              <div className={styles.totalRow}>
                <span className={styles.totalLabel} style={{color: '#ef4444'}}>The Cost of Delay (Lost Wealth)</span>
                <div className={styles.totalValue}>{formatCurrency(costOfDelay)}</div>
              </div>

              <div className={styles.chartContainer}>
                <div className={styles.barRow}>
                  <div className={styles.barLabel}>Start Now</div>
                  <div className={styles.barWrapper}>
                    <div className={styles.barFill} style={{ width: `${percentNow}%` }}></div>
                  </div>
                </div>
                <div className={styles.barRow}>
                  <div className={styles.barLabel}>Start Later</div>
                  <div className={styles.barWrapper}>
                    <div className={`${styles.barFill} ${styles.danger}`} style={{ width: `${percentLater}%` }}></div>
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
