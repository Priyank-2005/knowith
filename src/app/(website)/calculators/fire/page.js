"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from '../calculator.module.css';

export default function FIRECalculator() {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(50);
  const [monthlyExpense, setMonthlyExpense] = useState(50000);
  const [inflation, setInflation] = useState(6);
  const [postRetireReturn, setPostRetireReturn] = useState(8);
  const [preRetireReturn, setPreRetireReturn] = useState(12);

  // Math for FIRE
  const yearsToRetire = Math.max(0, retirementAge - currentAge);
  
  // Future monthly expense at retirement (FV = PV * (1 + r)^n)
  const futureMonthlyExpense = monthlyExpense * Math.pow(1 + (inflation / 100), yearsToRetire);
  const futureAnnualExpense = futureMonthlyExpense * 12;

  // Safe Withdrawal Rate (SWR) logic - roughly, return rate minus inflation. Default to 4% rule if close.
  // Target Corpus = Annual Expense / (Real Return Rate)
  const realReturn = (postRetireReturn - inflation) / 100;
  // If real return is too low or negative, fallback to a conservative 3% withdrawal rate (multiplied by 33)
  const corpusRequired = realReturn > 0 ? futureAnnualExpense / realReturn : futureAnnualExpense * 33.33;

  // Calculate required monthly SIP today to reach this corpus
  const r = preRetireReturn / 12 / 100;
  const n = yearsToRetire * 12;
  const requiredSIP = n > 0 && r > 0 ? (corpusRequired * r) / (Math.pow(1 + r, n) - 1) / (1 + r) : 0;

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Math.max(0, val));

  return (
    <>
      <Navbar />
      <main className="section-light">
        <div className={styles.calcContainer}>
          {/* Left Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className={styles.calcLeft}>
            <div className={styles.eyebrow}>Wealth Tools</div>
            <h1 className={styles.title}>F.I.R.E. Calculator</h1>
            <p className={styles.desc}>
              Financial Independence, Retire Early. Calculate exactly how much money you need to retire comfortably based on inflation.
            </p>

            <div className={styles.calcForm}>
              <div className={styles.formGroup}>
                <label>Current Age <span>{currentAge}</span></label>
                <input type="range" min="18" max="60" step="1" value={currentAge} onChange={(e) => setCurrentAge(Number(e.target.value))} />
              </div>
              
              <div className={styles.formGroup}>
                <label>Target Retirement Age <span>{retirementAge}</span></label>
                <input type="range" min="30" max="70" step="1" value={retirementAge} onChange={(e) => setRetirementAge(Number(e.target.value))} />
              </div>
              
              <div className={styles.formGroup}>
                <label>Current Monthly Expenses <span>{formatCurrency(monthlyExpense)}</span></label>
                <input type="range" min="10000" max="500000" step="5000" value={monthlyExpense} onChange={(e) => setMonthlyExpense(Number(e.target.value))} />
              </div>

              <div className={styles.formGroup}>
                <label>Expected Inflation <span>{inflation}%</span></label>
                <input type="range" min="4" max="10" step="0.5" value={inflation} onChange={(e) => setInflation(Number(e.target.value))} />
              </div>
            </div>
          </motion.div>

          {/* Right Results */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className={styles.calcRight}>
            <div className={styles.resultsCard}>
              
              <div className={styles.resultRow}>
                <span className={styles.resultLabel}>Years to Retire</span>
                <span className={styles.resultValue}>{yearsToRetire} Years</span>
              </div>
              
              <div className={styles.resultRow}>
                <span className={styles.resultLabel}>Est. Monthly Expense @ Retirement</span>
                <span className={styles.resultValue}>{formatCurrency(futureMonthlyExpense)}</span>
              </div>

              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Your FIRE Number (Target Corpus)</span>
                <div className={styles.totalValue}>{formatCurrency(corpusRequired)}</div>
              </div>

              <div className={styles.totalRow} style={{ marginTop: '1.5rem', paddingTop: '1.5rem'}}>
                <span className={styles.totalLabel} style={{color: 'white'}}>Required Monthly SIP Today</span>
                <div className={styles.totalValue} style={{fontSize: '2rem'}}>{formatCurrency(requiredSIP)}</div>
              </div>

            </div>
            
            <p className={styles.disclaimer}>
              *Assumes {preRetireReturn}% pre-retirement return and {postRetireReturn}% post-retirement return. Talk to our advisors for a detailed FIRE roadmap.
            </p>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
