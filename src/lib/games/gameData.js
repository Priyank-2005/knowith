export const seasonSurvivorJourneys = [
  {
    id: 1,
    name: 'The Lost Decade',
    description: 'A prolonged period of stagnation followed by a sharp recovery.',
    years: [
      { year: 1, nav: 100, headline: 'Market Optimism', season: 'spring' },
      { year: 2, nav: 95, headline: 'Global Slowdown', season: 'winter' },
      { year: 3, nav: 85, headline: 'Recession Fears', season: 'winter' },
      { year: 4, nav: 80, headline: 'Bottoming Out', season: 'winter' },
      { year: 5, nav: 90, headline: 'Slow Recovery', season: 'autumn' },
      { year: 6, nav: 105, headline: 'Back on Track', season: 'spring' },
      { year: 7, nav: 120, headline: 'Earnings Growth', season: 'summer' },
      { year: 8, nav: 150, headline: 'Bull Run', season: 'summer' },
      { year: 9, nav: 140, headline: 'Correction', season: 'autumn' },
      { year: 10, nav: 180, headline: 'New Highs', season: 'summer' },
    ]
  },
  {
    id: 2,
    name: 'The Rollercoaster',
    description: 'High volatility with multiple sharp drops and quick recoveries.',
    years: [
      { year: 1, nav: 100, headline: 'Steady Start', season: 'spring' },
      { year: 2, nav: 120, headline: 'Tech Boom', season: 'summer' },
      { year: 3, nav: 70, headline: 'Market Crash', season: 'winter' },
      { year: 4, nav: 95, headline: 'V-Shape Recovery', season: 'spring' },
      { year: 5, nav: 110, headline: 'Consolidation', season: 'autumn' },
      { year: 6, nav: 130, headline: 'Rally', season: 'summer' },
      { year: 7, nav: 150, headline: 'Euphoria', season: 'summer' },
      { year: 8, nav: 100, headline: 'Black Swan Event', season: 'winter' },
      { year: 9, nav: 125, headline: 'Rebounding', season: 'spring' },
      { year: 10, nav: 160, headline: 'Stabilization', season: 'summer' },
    ]
  },
  {
    id: 3,
    name: 'The Slow Grind',
    description: 'Steady growth with mild interruptions.',
    years: [
      { year: 1, nav: 100, headline: 'Normal Year', season: 'spring' },
      { year: 2, nav: 110, headline: 'Modest Gains', season: 'spring' },
      { year: 3, nav: 115, headline: 'Status Quo', season: 'spring' },
      { year: 4, nav: 105, headline: 'Mild Correction', season: 'autumn' },
      { year: 5, nav: 125, headline: 'Breakout', season: 'summer' },
      { year: 6, nav: 140, headline: 'Strong Economy', season: 'summer' },
      { year: 7, nav: 135, headline: 'Rate Hikes', season: 'autumn' },
      { year: 8, nav: 150, headline: 'Resilience', season: 'summer' },
      { year: 9, nav: 165, headline: 'Peak Earnings', season: 'summer' },
      { year: 10, nav: 190, headline: 'Multi-Year High', season: 'summer' },
    ]
  }
];

export const seasons = {
  spring: { color: '#45D483', name: 'Spring' }, // green
  summer: { color: '#FFC94A', name: 'Summer' }, // gold
  autumn: { color: '#8FA3C8', name: 'Autumn' }, // blue-grey
  winter: { color: '#FF5F73', name: 'Winter' }, // red
};

export const chapter2Returns = [-14, -3, 8, 32, 48];

export const panicRoomRounds = [
  { year: 2008, title: 'Global Financial Crisis', headline: 'Lehman Brothers collapses. Sensex crashes 55% from its peak. Your MF portfolio shows -40%.', recovery: 'Sensex rallied +75% in 2009. SIP investors who stayed got units at rock-bottom NAVs.' },
  { year: 2013, title: 'The Rupee Crisis', headline: 'Rupee hits record low of ₹68. CAD widens. FIIs pull out ₹12,000 Cr. Nifty down 15%.', recovery: 'Nifty gained +31% in 2014 as Modi mandate restored confidence. Rupee stabilized.' },
  { year: 2016, title: 'Demonetisation', headline: 'PM Modi bans 86% of currency overnight. Markets crash 6% in a day. Economic chaos predicted.', recovery: 'Nifty rallied +29% in 2017. Market shrugged off demonetisation within months.' },
  { year: 2018, title: 'Credit Shock', headline: 'IL&FS defaults on ₹91,000 Cr. NBFC crisis spreads. Mid & small caps crash 30%.', recovery: 'Nifty recovered to new highs by late 2019. Quality mid-caps bounced back 40-60%.' },
  { year: 2020, title: 'Pandemic Crash', headline: 'COVID-19 lockdown. Sensex crashes 38% in one month. Circuit breakers hit repeatedly.', recovery: 'One of the greatest bull runs followed. Nifty doubled from March 2020 lows by 2021.' },
  { year: 2022, title: 'Rate Hikes & War', headline: 'Russia invades Ukraine. Inflation at 40-year highs. RBI hikes rates aggressively. Markets correct 18%.', recovery: 'Markets recovered within 6 months. India outperformed all major global indices in 2023.' }
];

export const rapidFireQuestions = [
  { q: 'If NAV drops from ₹20 to ₹10, how many more units does your ₹10,000 SIP buy?', options: ['Same', '50% more', '100% more (double)', '200% more'], correct: 2, explanation: 'At NAV ₹20, you get 500 units. At NAV ₹10, you get 1,000 units — exactly double. A falling NAV is a unit-accumulation opportunity.' },
  { q: 'Your SIP corpus = Units × NAV. If you own 10,000 units and NAV is ₹25, your corpus is:', options: ['₹25,000', '₹1,00,000', '₹2,50,000', '₹10,00,000'], correct: 2, explanation: 'Corpus = 10,000 × ₹25 = ₹2,50,000. Simple multiplication — units times current NAV.' },
  { q: 'In a 20-year SIP, roughly what % of months are typically positive for equity?', options: ['25%', '45%', '65%', '85%'], correct: 1, explanation: 'Historical data shows ~45% of months are positive. Yet the overall SIP still compounds at 12-15% XIRR because the magnitude of gains exceeds losses.' },
  { q: 'SIP XIRR is 15% but the fund CAGR is 12%. Why the difference?', options: ['Data error', 'SIP bought more units when NAV was low, boosting returns', 'Expense ratio adjustment', 'Tax deduction'], correct: 1, explanation: 'SIP rupee-cost averaging buys more units when NAV is low. This creates a weighted-average entry price below the simple average, boosting XIRR above point-to-point CAGR.' },
  { q: 'Two investors start a ₹10,000 SIP. Investor A pauses during every crash. Investor B never stops. After 15 years:', options: ['Both have similar wealth', 'A has more (avoided losses)', 'B has significantly more wealth', 'Depends on the market'], correct: 2, explanation: 'Investor B accumulates far more units during crashes when NAV is low. These cheap units multiply when markets recover, creating substantially higher wealth.' },
  { q: 'If a fund NAV grows from ₹10 to ₹100 over 20 years, what is the CAGR?', options: ['5%', '10%', '12.2%', '15%'], correct: 2, explanation: 'CAGR = (100/10)^(1/20) - 1 = 10^0.05 - 1 ≈ 12.2%. The power of compounding turns 10x growth into ~12% annual returns.' },
  { q: 'You invest ₹5,000/month for 25 years at 12% p.a. What is the approximate corpus?', options: ['₹15 lakhs', '₹50 lakhs', '₹95 lakhs', '₹1.9 Crores'], correct: 2, explanation: 'Using the SIP formula: FV = 5000 × [((1.01)^300 - 1) / 0.01] × 1.01 ≈ ₹94.9 lakhs (~₹95 lakhs). Total invested is only ₹15 lakhs!' },
  { q: 'What happens to your SIP units if the market crashes 50%?', options: ['You lose half your units', 'Units stay the same, NAV drops', 'Both units and NAV drop', 'Units automatically increase'], correct: 1, explanation: 'Your units NEVER decrease (unless you redeem). A crash only reduces NAV. Your next SIP installment now buys double the units at the lower NAV.' },
  { q: 'A ₹10,000 monthly SIP in a fund averaging 14% CAGR over 30 years would create approximately:', options: ['₹36 lakhs', '₹1.8 Crores', '₹3.5 Crores', '₹6.2 Crores'], correct: 3, explanation: 'FV at 14% for 30 years ≈ ₹6.2 Crores. Total invested is only ₹36 lakhs. The 172x multiplier shows the explosive power of long-term compounding.' },
  { q: 'What is the single most important factor for SIP wealth creation?', options: ['Picking the right fund', 'Timing your entry', 'Staying invested through all seasons', 'Investing large amounts'], correct: 2, explanation: 'Discipline beats timing and fund selection. Staying invested through crashes, corrections, and boring sideways markets is what accumulates the most units — and units are what build wealth.' }
];

export const INVESTOR_DNA_RANKS = [
  { min: 90, max: 100, title: 'Unit Master', desc: 'You understand that wealth is built by units, not returns.' },
  { min: 75, max: 89, title: 'Disciplined Compounder', desc: 'You stay the course and let compounding work.' },
  { min: 60, max: 74, title: 'Steady SIPper', desc: 'You have the right instincts but waver sometimes.' },
  { min: 40, max: 59, title: 'Fair-Weather Investor', desc: 'You invest when markets are sunny but get nervous in storms.' },
  { min: 0, max: 39, title: 'Panic Prone', desc: 'Markets scare you. But awareness is the first step to discipline.' }
];
