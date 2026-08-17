'use client';
import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// Currency formatter
const formatCurrency = (value) => {
  if (value === null || value === undefined || isNaN(value)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};

export default function NarrativePlanner() {
  const [narrative, setNarrative] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Parsed variables
  const [params, setParams] = useState(null);

  const handleAnalyze = async () => {
    if (!narrative.trim()) return;
    setLoading(true);
    setError(null);
    setParams(null);

    try {
      const response = await fetch('/api/v1/calculators/narrative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: narrative })
      });

      if (!response.ok) throw new Error('Failed to analyze narrative.');

      const data = await response.json();
      
      // Default nulls to 0 for rendering
      setParams({
        initialInvestment: data.initialInvestment || 0,
        monthlyInvestment: data.monthlyInvestment || 0,
        targetAmount: data.targetAmount || 0,
        timeHorizonYears: data.timeHorizonYears || 10, // Default 10 years if not mentioned
        assumedReturnRate: data.assumedReturnRate || 12,
        clarificationNeeded: data.clarificationNeeded
      });
      
    } catch (err) {
      setError('Could not process your story. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleParamChange = (field, value) => {
    const num = parseFloat(value) || 0;
    setParams(prev => ({ ...prev, [field]: num }));
  };

  // Generate chart data based on params
  const chartData = useMemo(() => {
    if (!params) return [];
    
    let currentAmount = params.initialInvestment;
    const monthlyRate = (params.assumedReturnRate / 100) / 12;
    const months = params.timeHorizonYears * 12;
    
    const data = [];
    let totalInvested = params.initialInvestment;

    for (let i = 0; i <= months; i++) {
      if (i % 12 === 0) {
        data.push({
          year: i / 12,
          Total_Corpus: Math.round(currentAmount),
          Invested_Amount: totalInvested
        });
      }
      
      // Add monthly investment and apply interest
      currentAmount += params.monthlyInvestment;
      currentAmount *= (1 + monthlyRate);
      totalInvested += params.monthlyInvestment;
    }
    
    return data;
  }, [params]);

  const totalInvested = params ? (params.initialInvestment + (params.monthlyInvestment * 12 * params.timeHorizonYears)) : 0;
  const finalCorpus = chartData.length > 0 ? chartData[chartData.length - 1].Total_Corpus : 0;
  const totalGains = finalCorpus - totalInvested;

  return (
    <>
      <Navbar />
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          
          <div className={styles.header}>
            <h1 className={styles.title}>Narrative Planner</h1>
            <p className={styles.subtitle}>
              Don't worry about forms and fields. Just tell us your story, and we'll map out your future.
            </p>
          </div>

          <div className={styles.inputSection}>
            <label className={styles.promptLabel}>Your Story</label>
            <textarea
              className={styles.textArea}
              placeholder="E.g. I am 30 years old, have 5 lakhs saved up, and can invest ₹15,000 every month. I want to buy a house in 10 years."
              value={narrative}
              onChange={(e) => setNarrative(e.target.value)}
            />
            
            <div className={styles.buttonRow}>
              {error && <span className={styles.errorMsg}>{error}</span>}
              <button 
                className={styles.primaryButton}
                onClick={handleAnalyze}
                disabled={loading || !narrative.trim()}
              >
                {loading ? 'Analyzing...' : 'Plan My Future'}
              </button>
            </div>
          </div>

          {params && (
            <div className={styles.resultsDashboard}>
              <div className={styles.variablesSidebar}>
                <div className={styles.sidebarTitle}>Extracted Variables</div>
                
                {params.clarificationNeeded && (
                  <div className={styles.clarificationBox}>
                    {params.clarificationNeeded}
                  </div>
                )}

                <div className={styles.inputGroup}>
                  <label>Initial Investment (₹)</label>
                  <input 
                    type="number" 
                    value={params.initialInvestment} 
                    onChange={(e) => handleParamChange('initialInvestment', e.target.value)}
                  />
                </div>
                
                <div className={styles.inputGroup}>
                  <label>Monthly SIP (₹)</label>
                  <input 
                    type="number" 
                    value={params.monthlyInvestment} 
                    onChange={(e) => handleParamChange('monthlyInvestment', e.target.value)}
                  />
                </div>
                
                <div className={styles.inputGroup}>
                  <label>Time Horizon (Years)</label>
                  <input 
                    type="number" 
                    value={params.timeHorizonYears} 
                    onChange={(e) => handleParamChange('timeHorizonYears', e.target.value)}
                  />
                </div>
                
                <div className={styles.inputGroup}>
                  <label>Expected Return (%)</label>
                  <input 
                    type="number" 
                    value={params.assumedReturnRate} 
                    onChange={(e) => handleParamChange('assumedReturnRate', e.target.value)}
                  />
                </div>

                {params.targetAmount > 0 && (
                  <div className={styles.inputGroup}>
                    <label>Target Amount (₹)</label>
                    <input 
                      type="number" 
                      value={params.targetAmount} 
                      readOnly
                      style={{backgroundColor: '#eee', color: '#888'}}
                    />
                  </div>
                )}
              </div>

              <div className={styles.mainChartArea}>
                <div className={styles.summaryCards}>
                  <div className={styles.summaryCard}>
                    <div className={styles.summaryLabel}>Total Invested</div>
                    <div className={styles.summaryValue}>{formatCurrency(totalInvested)}</div>
                  </div>
                  <div className={styles.summaryCard}>
                    <div className={styles.summaryLabel}>Est. Returns</div>
                    <div className={styles.summaryValue}>{formatCurrency(totalGains)}</div>
                  </div>
                  <div className={styles.summaryCard}>
                    <div className={styles.summaryLabel}>Total Corpus</div>
                    <div className={`${styles.summaryValue} ${styles.highlight}`}>{formatCurrency(finalCorpus)}</div>
                  </div>
                </div>

                <div className={styles.chartContainer}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorCorpus" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1a1a1a" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#1a1a1a" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5dfc5" />
                      <XAxis dataKey="year" tickFormatter={(v) => `Yr ${v}`} stroke="#888" />
                      <YAxis tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`} stroke="#888" />
                      <Tooltip 
                        formatter={(value) => formatCurrency(value)}
                        labelFormatter={(label) => `Year ${label}`}
                        contentStyle={{ fontFamily: 'monospace', borderRadius: '0', border: '1px solid #1a1a1a' }}
                      />
                      <Area type="monotone" dataKey="Invested_Amount" stackId="2" stroke="#888" fill="transparent" strokeDasharray="5 5" />
                      <Area type="monotone" dataKey="Total_Corpus" stackId="1" stroke="#1a1a1a" fillOpacity={1} fill="url(#colorCorpus)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
          
        </div>
      </div>
      <Footer />
    </>
  );
}
