"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from '../calculator.module.css';

export default function SWPCalculator() {
  const [corpus, setCorpus] = useState(10000000);
  const [withdrawal, setWithdrawal] = useState(50000);
  const [returnRate, setReturnRate] = useState(8);
  const [years, setYears] = useState(20);

  // Math for SWP
  const calculateSWP = () => {
    let balance = corpus;
    const r = returnRate / 12 / 100;
    const months = years * 12;
    let totalWithdrawn = 0;

    for (let i = 0; i < months; i++) {
      if (balance <= 0) {
        break; // corpus depleted
      }
      // Add monthly interest
      balance += balance * r;
      
      // Subtract withdrawal
      if (balance >= withdrawal) {
        balance -= withdrawal;
        totalWithdrawn += withdrawal;
      } else {
        totalWithdrawn += balance;
        balance = 0;
      }
    }

    return { 
      finalBalance: Math.max(0, balance), 
      totalWithdrawn,
      isDepleted: balance <= 0
    };
  };

  const { finalBalance, totalWithdrawn, isDepleted } = calculateSWP();

  // For charts, compare total withdrawn vs final remaining balance vs starting corpus
  const totalValueCreated = totalWithdrawn + finalBalance;
  const maxBar = Math.max(corpus, totalValueCreated);
  const percentCorpus = (corpus / maxBar) * 100;
  const percentWithdrawn = (totalWithdrawn / maxBar) * 100;
  const percentRemaining = (finalBalance / maxBar) * 100;

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Math.max(0, val));

  return (
    <>
      <Navbar />
      <main className="section-light">
        <div className={styles.calcContainer}>
          {/* Left Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className={styles.calcLeft}>
            <div className={styles.eyebrow}>Retirement Tools</div>
            <h1 className={styles.title}>SWP Calculator</h1>
            <p className={styles.desc}>
              Systematic Withdrawal Plan. See how long your retirement corpus will last based on your monthly withdrawals.
            </p>

            <div className={styles.calcForm}>
              <div className={styles.formGroup}>
                <label>Total Corpus <span>{formatCurrency(corpus)}</span></label>
                <input type="range" min="1000000" max="100000000" step="100000" value={corpus} onChange={(e) => setCorpus(Number(e.target.value))} />
              </div>
              
              <div className={styles.formGroup}>
                <label>Monthly Withdrawal <span>{formatCurrency(withdrawal)}</span></label>
                <input type="range" min="10000" max="1000000" step="5000" value={withdrawal} onChange={(e) => setWithdrawal(Number(e.target.value))} />
              </div>
              
              <div className={styles.formGroup}>
                <label>Expected Return (p.a) <span>{returnRate}%</span></label>
                <input type="range" min="4" max="15" step="0.5" value={returnRate} onChange={(e) => setReturnRate(Number(e.target.value))} />
              </div>

              <div className={styles.formGroup}>
                <label>Time Period <span>{years} Years</span></label>
                <input type="range" min="5" max="40" step="1" value={years} onChange={(e) => setYears(Number(e.target.value))} />
              </div>
            </div>
          </motion.div>

          {/* Right Results */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className={styles.calcRight}>
            <div className={styles.resultsCard}>
              
              <div className={styles.resultRow}>
                <span className={styles.resultLabel}>Starting Corpus</span>
                <span className={styles.resultValue}>{formatCurrency(corpus)}</span>
              </div>

              <div className={styles.resultRow}>
                <span className={styles.resultLabel}>Total Amount Withdrawn</span>
                <span className={styles.resultValue}>{formatCurrency(totalWithdrawn)}</span>
              </div>

              <div className={styles.totalRow}>
                <span className={styles.totalLabel} style={{color: isDepleted ? '#ef4444' : 'var(--gold)'}}>
                  {isDepleted ? 'Corpus Depletes Before End' : 'Final Balance Remaining'}
                </span>
                <div className={styles.totalValue}>{formatCurrency(finalBalance)}</div>
              </div>

              <div className={styles.chartContainer}>
                <div className={styles.barRow}>
                  <div className={styles.barLabel}>Starting Corpus</div>
                  <div className={styles.barWrapper}>
                    <div className={styles.barFill} style={{ width: `${percentCorpus}%`, background: 'rgba(255,255,255,0.4)' }}></div>
                  </div>
                </div>
                <div className={styles.barRow}>
                  <div className={styles.barLabel}>Total Withdrawn</div>
                  <div className={styles.barWrapper}>
                    <div className={`${styles.barFill} ${styles.alt}`} style={{ width: `${percentWithdrawn}%` }}></div>
                  </div>
                </div>
                {!isDepleted && (
                  <div className={styles.barRow}>
                    <div className={styles.barLabel}>Final Balance</div>
                    <div className={styles.barWrapper}>
                      <div className={styles.barFill} style={{ width: `${percentRemaining}%` }}></div>
                    </div>
                  </div>
                )}
              </div>

            </div>
            
            <p className={styles.disclaimer}>
              *Calculations do not account for inflation or taxes. Actual returns may vary.
            </p>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
