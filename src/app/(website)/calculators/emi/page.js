"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from '../calculator.module.css';

export default function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [years, setYears] = useState(20);

  // EMI Math
  const calculateEMI = () => {
    const P = loanAmount;
    const r = interestRate / 12 / 100;
    const n = years * 12;
    
    let emi = 0;
    let totalPayment = 0;
    let totalInterest = 0;

    if (r === 0) {
      emi = P / n;
      totalPayment = P;
      totalInterest = 0;
    } else {
      emi = P * r * (Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1));
      totalPayment = emi * n;
      totalInterest = totalPayment - P;
    }

    return { emi, totalPayment, totalInterest };
  };

  const { emi, totalPayment, totalInterest } = calculateEMI();

  const percentPrincipal = (loanAmount / totalPayment) * 100;
  const percentInterest = (totalInterest / totalPayment) * 100;

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Math.max(0, val));

  return (
    <>
      <Navbar />
      <main className="section-light">
        <div className={styles.calcContainer}>
          {/* Left Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className={styles.calcLeft}>
            <div className={styles.eyebrow}>Debt Tools</div>
            <h1 className={styles.title}>EMI Calculator</h1>
            <p className={styles.desc}>
              Calculate your monthly loan payments, total interest, and see exactly where your money is going.
            </p>

            <div className={styles.calcForm}>
              <div className={styles.formGroup}>
                <label>Loan Amount <span>{formatCurrency(loanAmount)}</span></label>
                <input type="range" min="100000" max="50000000" step="100000" value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))} />
              </div>
              
              <div className={styles.formGroup}>
                <label>Interest Rate (p.a) <span>{interestRate}%</span></label>
                <input type="range" min="1" max="20" step="0.1" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} />
              </div>
              
              <div className={styles.formGroup}>
                <label>Loan Tenure <span>{years} Years</span></label>
                <input type="range" min="1" max="30" step="1" value={years} onChange={(e) => setYears(Number(e.target.value))} />
              </div>
            </div>
          </motion.div>

          {/* Right Results */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className={styles.calcRight}>
            <div className={styles.resultsCard}>
              
              <div className={styles.resultRow}>
                <span className={styles.resultLabel}>Principal Amount</span>
                <span className={styles.resultValue}>{formatCurrency(loanAmount)}</span>
              </div>

              <div className={styles.resultRow}>
                <span className={styles.resultLabel}>Total Interest</span>
                <span className={styles.resultValue} style={{color: '#ef4444'}}>{formatCurrency(totalInterest)}</span>
              </div>

              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Monthly EMI</span>
                <div className={styles.totalValue}>{formatCurrency(emi)}</div>
              </div>

              <div className={styles.chartContainer}>
                <div className={styles.barRow}>
                  <div className={styles.barLabel}>Principal</div>
                  <div className={styles.barWrapper}>
                    <div className={styles.barFill} style={{ width: `${percentPrincipal}%`, background: 'rgba(255,255,255,0.4)' }}></div>
                  </div>
                </div>
                <div className={styles.barRow}>
                  <div className={styles.barLabel}>Interest</div>
                  <div className={styles.barWrapper}>
                    <div className={`${styles.barFill} ${styles.danger}`} style={{ width: `${percentInterest}%` }}></div>
                  </div>
                </div>
              </div>

            </div>
            
            <p className={styles.disclaimer}>
              *Calculations are estimates. Actual EMIs may vary slightly depending on your bank's compounding frequency.
            </p>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
