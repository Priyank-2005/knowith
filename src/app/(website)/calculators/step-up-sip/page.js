"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from '../calculator.module.css';

export default function StepUpSIPCalculator() {
  const [monthlyInvest, setMonthlyInvest] = useState(10000);
  const [stepUpPercent, setStepUpPercent] = useState(10);
  const [returnRate, setReturnRate] = useState(12);
  const [years, setYears] = useState(20);

  // Math for Step-Up SIP (Annual step-up)
  const calculateStepUp = () => {
    const r = returnRate / 100;
    const i = r / 12;
    let currentMonthly = monthlyInvest;
    let totalInvested = 0;
    let totalWealth = 0;

    for (let y = 1; y <= years; y++) {
      // For each year, calculate the future value of the 12 monthly deposits made in that year
      // A year's worth of SIP deposits grown to the end of the year:
      const endOfYearVal = currentMonthly * ((Math.pow(1 + i, 12) - 1) / i) * (1 + i);
      
      // Add the new deposits to the running total
      totalInvested += currentMonthly * 12;
      
      // Grow previous total wealth by 1 year, and add the new year's deposits
      totalWealth = (totalWealth * (1 + r)) + endOfYearVal;
      
      // Step up the monthly amount for the next year
      currentMonthly = currentMonthly * (1 + (stepUpPercent / 100));
    }
    
    return { invested: totalInvested, wealth: totalWealth };
  };

  // Math for Normal SIP
  const calculateNormal = () => {
    const P = monthlyInvest;
    const n = years * 12;
    const i = returnRate / 12 / 100;
    const M = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const invested = P * n;
    return { invested, wealth: M };
  };

  const stepUp = calculateStepUp();
  const normal = calculateNormal();
  const bonus = stepUp.wealth - normal.wealth;

  const maxWealth = stepUp.wealth;
  const percentStepUp = 100;
  const percentNormal = maxWealth > 0 ? (normal.wealth / maxWealth) * 100 : 0;

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Math.max(0, val));

  return (
    <>
      <Navbar />
      <main className="section-light">
        <div className={styles.calcContainer}>
          {/* Left Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className={styles.calcLeft}>
            <div className={styles.eyebrow}>Wealth Tools</div>
            <h1 className={styles.title}>Step-Up SIP</h1>
            <p className={styles.desc}>
              Align your investments with your salary hikes. See how a small annual increase in your SIP can create exponentially more wealth.
            </p>

            <div className={styles.calcForm}>
              <div className={styles.formGroup}>
                <label>Starting Monthly Investment <span>{formatCurrency(monthlyInvest)}</span></label>
                <input type="range" min="1000" max="200000" step="1000" value={monthlyInvest} onChange={(e) => setMonthlyInvest(Number(e.target.value))} />
              </div>

              <div className={styles.formGroup}>
                <label style={{color: '#3b82f6'}}>Annual Step-Up (Increase) <span>{stepUpPercent}%</span></label>
                <input type="range" min="1" max="25" step="1" value={stepUpPercent} onChange={(e) => setStepUpPercent(Number(e.target.value))} style={{accentColor: '#3b82f6'}} />
              </div>
              
              <div className={styles.formGroup}>
                <label>Expected Return (p.a) <span>{returnRate}%</span></label>
                <input type="range" min="5" max="25" step="0.5" value={returnRate} onChange={(e) => setReturnRate(Number(e.target.value))} />
              </div>
              
              <div className={styles.formGroup}>
                <label>Investment Horizon <span>{years} Years</span></label>
                <input type="range" min="5" max="40" step="1" value={years} onChange={(e) => setYears(Number(e.target.value))} />
              </div>
            </div>
          </motion.div>

          {/* Right Results */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className={styles.calcRight}>
            <div className={styles.resultsCard}>
              
              <div className={styles.resultRow}>
                <span className={styles.resultLabel}>Flat SIP Wealth</span>
                <span className={styles.resultValue}>{formatCurrency(normal.wealth)}</span>
              </div>

              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Step-Up SIP Wealth</span>
                <div className={styles.totalValue}>{formatCurrency(stepUp.wealth)}</div>
              </div>

              <div className={styles.totalRow} style={{ marginTop: '1.5rem', paddingTop: '1.5rem'}}>
                <span className={styles.totalLabel} style={{color: '#3b82f6'}}>The "Step-Up Bonus"</span>
                <div className={styles.totalValue} style={{fontSize: '2rem'}}>{formatCurrency(bonus)}</div>
              </div>

              <div className={styles.chartContainer}>
                <div className={styles.barRow}>
                  <div className={styles.barLabel}>Step-Up SIP</div>
                  <div className={styles.barWrapper}>
                    <div className={styles.barFill} style={{ width: `${percentStepUp}%` }}></div>
                  </div>
                </div>
                <div className={styles.barRow}>
                  <div className={styles.barLabel}>Flat SIP</div>
                  <div className={styles.barWrapper}>
                    <div className={`${styles.barFill} ${styles.alt}`} style={{ width: `${percentNormal}%` }}></div>
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
