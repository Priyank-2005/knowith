"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from '../calculator.module.css';

export default function EarlyLoanClosureCalculator() {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [originalYears, setOriginalYears] = useState(20);
  const [extraPrepayment, setExtraPrepayment] = useState(10000);

  // Math for Loan
  const calculateLoan = () => {
    const P = loanAmount;
    const r = interestRate / 12 / 100;
    const n = originalYears * 12;
    
    // Normal EMI
    const emi = P * r * (Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1));
    const normalTotalInterest = (emi * n) - P;

    // Accelerated Prepayment Logic
    let balance = P;
    let monthsTaken = 0;
    let totalInterestPaid = 0;
    const newMonthlyPayment = emi + extraPrepayment;

    while (balance > 0 && monthsTaken < n) {
      const interestForMonth = balance * r;
      totalInterestPaid += interestForMonth;
      
      const principalPaid = newMonthlyPayment - interestForMonth;
      balance -= principalPaid;
      monthsTaken++;
    }

    const interestSaved = normalTotalInterest - totalInterestPaid;
    const yearsSaved = (n - monthsTaken) / 12;

    return { 
      emi, 
      normalTotalInterest, 
      totalInterestPaid, 
      interestSaved,
      yearsSaved: Math.max(0, yearsSaved)
    };
  };

  const { emi, normalTotalInterest, totalInterestPaid, interestSaved, yearsSaved } = calculateLoan();

  // For charts
  const maxInterest = normalTotalInterest;
  const percentNormal = 100;
  const percentNew = maxInterest > 0 ? (totalInterestPaid / maxInterest) * 100 : 0;
  const percentSaved = maxInterest > 0 ? (interestSaved / maxInterest) * 100 : 0;

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Math.max(0, val));

  return (
    <>
      <Navbar />
      <main className="section-light">
        <div className={styles.calcContainer}>
          {/* Left Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className={styles.calcLeft}>
            <div className={styles.eyebrow}>Debt Tools</div>
            <h1 className={styles.title}>Early Loan Closure</h1>
            <p className={styles.desc}>
              See how making a small extra monthly prepayment can shave years off your loan and save you millions in interest.
            </p>

            <div className={styles.calcForm}>
              <div className={styles.formGroup}>
                <label>Loan Amount <span>{formatCurrency(loanAmount)}</span></label>
                <input type="range" min="500000" max="50000000" step="100000" value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))} />
              </div>
              
              <div className={styles.formGroup}>
                <label>Interest Rate (p.a) <span>{interestRate}%</span></label>
                <input type="range" min="6" max="15" step="0.1" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} />
              </div>
              
              <div className={styles.formGroup}>
                <label>Original Tenure <span>{originalYears} Years</span></label>
                <input type="range" min="5" max="30" step="1" value={originalYears} onChange={(e) => setOriginalYears(Number(e.target.value))} />
              </div>

              <div className={styles.formGroup} style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border-light)'}}>
                <label style={{color: '#3b82f6'}}>Extra Monthly Prepayment <span>{formatCurrency(extraPrepayment)}</span></label>
                <input type="range" min="0" max="100000" step="1000" value={extraPrepayment} onChange={(e) => setExtraPrepayment(Number(e.target.value))} style={{accentColor: '#3b82f6'}}/>
                <p style={{fontSize: '11px', color: 'var(--slate-soft)', marginTop: '8px'}}>Original EMI: {formatCurrency(emi)}</p>
              </div>
            </div>
          </motion.div>

          {/* Right Results */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className={styles.calcRight}>
            <div className={styles.resultsCard}>
              
              <div className={styles.resultRow}>
                <span className={styles.resultLabel}>Original Total Interest</span>
                <span className={styles.resultValue} style={{color: '#ef4444'}}>{formatCurrency(normalTotalInterest)}</span>
              </div>

              <div className={styles.resultRow}>
                <span className={styles.resultLabel}>New Total Interest</span>
                <span className={styles.resultValue}>{formatCurrency(totalInterestPaid)}</span>
              </div>

              <div className={styles.totalRow}>
                <span className={styles.totalLabel} style={{color: '#3b82f6'}}>Total Interest Saved</span>
                <div className={styles.totalValue}>{formatCurrency(interestSaved)}</div>
              </div>

              <div className={styles.totalRow} style={{ marginTop: '1.5rem', paddingTop: '1.5rem'}}>
                <span className={styles.totalLabel} style={{color: '#3b82f6'}}>Loan Finished Early By</span>
                <div className={styles.totalValue} style={{fontSize: '2rem'}}>{yearsSaved.toFixed(1)} Years</div>
              </div>

              <div className={styles.chartContainer}>
                <div className={styles.barRow}>
                  <div className={styles.barLabel}>Original Interest</div>
                  <div className={styles.barWrapper}>
                    <div className={`${styles.barFill} ${styles.danger}`} style={{ width: `${percentNormal}%` }}></div>
                  </div>
                </div>
                <div className={styles.barRow}>
                  <div className={styles.barLabel}>New Interest</div>
                  <div className={styles.barWrapper}>
                    <div className={styles.barFill} style={{ width: `${percentNew}%` }}></div>
                  </div>
                </div>
              </div>

            </div>
            
            <p className={styles.disclaimer}>
              *Banks may have prepayment limits or fees. Always check your loan agreement terms.
            </p>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
