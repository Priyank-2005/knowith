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

export const contrarianSignalDispatches = [
  {
    id: 1,
    date: '13 August 1979',
    publication: 'BUSINESSWEEK',
    headline: 'The Death of Equities',
    stats: [
      { label: 'DOW JONES INDUSTRIAL AVERAGE', value: '875.26' },
      { label: 'US INFLATION, 1979', value: '~11%' },
      { label: 'SHAREHOLDERS LOST SINCE 1970', value: '7 million' },
      { label: 'CONSENSUS ADVICE', value: 'Buy gold, land, art' }
    ],
    context: 'Inflation had been destroying real returns for a decade. Pension funds were being allowed to shift out of stocks and bonds into hard assets, and the public had largely deserted the market. The obvious advice was that equities were structurally finished as an asset class.',
    quotes: [
      { text: 'The Death of Equities: How inflation is destroying the stock market', source: 'BUSINESSWEEK, COVER STORY · 13 Aug 1979' },
      { text: 'At least 7 million shareholders have defected from the stock market since 1970, leaving equities more than ever the province of giant institutional investors.', source: 'BUSINESSWEEK · 13 Aug 1979' },
      { text: 'The Great Crash of \'79', source: 'THE NEW YORK TIMES · Oct 1979' }
    ],
    outcomes: {
      buy: { score: 100, text: 'A brilliant contrarian call. Equities were about to begin one of the greatest bull runs in history, defying the consensus.' },
      hold: { score: 50, text: 'You held firm. It was painful, but patience eventually paid off as the 1980s bull market took hold.' },
      sell: { score: 0, text: 'You capitulated at exactly the wrong time, locking in a decade of flat returns right before a historic boom.' }
    },
    chartData: {
      type: 'recovery',
      yAxis: { max: 40, min: -20, step: 20 },
      lines: [
        { name: 'Dow Jones', m12: 8, m24: 20, color: '#15803d' }
      ]
    }
  },
  {
    id: 2,
    date: '20 October 1987',
    publication: 'THE WALL STREET JOURNAL',
    headline: 'Stocks Plunge 508 Points',
    stats: [
      { label: 'DOW JONES INDUSTRIAL AVERAGE', value: '1,738.74' },
      { label: 'ONE-DAY DROP', value: '-22.6%' },
      { label: 'MARKET VALUE WIPED OUT', value: '$500 Billion' },
      { label: 'PREVIOUS RECORD DROP', value: '-12.8% (1929)' }
    ],
    context: 'Black Monday hits global markets. Program trading and portfolio insurance exacerbate a historic selloff. The fear of a new Great Depression is palpable as Wall Street professionals stare blankly at their screens.',
    quotes: [
      { text: 'A Financial Meltdown: Panic Grips the Markets', source: 'TIME MAGAZINE · 26 Oct 1987' },
      { text: 'The worst day in Wall Street history. It feels like the end of the world.', source: 'FLOOR TRADER · 19 Oct 1987' }
    ],
    outcomes: {
      buy: { score: 100, text: 'Bold call! Markets completely recovered within 2 years, starting a massive bull run.' },
      hold: { score: 50, text: 'Good discipline. You ignored the panic and rode the eventual recovery.' },
      sell: { score: 0, text: 'You locked in permanent losses at the exact bottom of the crash.' }
    },
    chartData: {
      type: 'recovery',
      yAxis: { max: 60, min: -20, step: 20 },
      lines: [
        { name: 'Dow Jones', m12: 20, m24: 50, color: '#15803d' }
      ]
    }
  },
  {
    id: 3,
    date: '10 March 2000',
    publication: 'WIRED',
    headline: 'The New Paradigm: Tech Always Wins',
    stats: [
      { label: 'NASDAQ COMPOSITE', value: '5,048.62' },
      { label: 'PE RATIO (TECH SECTOR)', value: '175x' },
      { label: 'PETS.COM VALUATION', value: '$300 Million' },
      { label: 'INTERNET PENETRATION', value: '43% of US' }
    ],
    context: 'Internet companies with zero revenue command multi-billion dollar valuations. Traditional valuation metrics are mocked as outdated. "Eyeballs" are the new currency. To not own tech is to be left behind by history.',
    quotes: [
      { text: 'Valuation doesn\'t matter in the new economy.', source: 'CNBC COMMENTATOR · Feb 2000' },
      { text: 'Get Big Fast: The Amazon Way', source: 'FORTUNE · Mar 2000' }
    ],
    outcomes: {
      buy: { score: 0, text: 'You bought into the peak of the Dot-Com bubble. The NASDAQ would lose 78% of its value over the next 2 years.' },
      hold: { score: 50, text: 'A tough hold, but staying diversified saved you from total ruin.' },
      sell: { score: 100, text: 'Contrarian genius. You recognized the extreme euphoria and avoided a brutal 78% drawdown.' }
    },
    chartData: {
      type: 'crash',
      yAxis: { max: 0, min: -80, step: 20 },
      lines: [
        { name: 'Nasdaq Composite', m12: -62, m24: -78, color: '#1a365d' },
        { name: 'BSE Sensex', m12: -31, m24: -43, color: '#b83b3b' }
      ]
    }
  },
  {
    id: 4,
    date: '17 September 2001',
    publication: 'THE ECONOMIST',
    headline: 'Global Markets Paralyzed by Terror',
    stats: [
      { label: 'DOW JONES INDUSTRIAL AVERAGE', value: '8,920.70' },
      { label: 'ONE-WEEK DROP', value: '-14.3%' },
      { label: 'AIRLINE STOCK INDEX', value: '-40%' },
      { label: 'MARKET CLOSURE', value: '4 Days' }
    ],
    context: 'Following the unprecedented terrorist attacks on 9/11, US markets were closed for four days. Upon reopening, the Dow Jones suffers its worst single-week point drop in history. Geopolitical fear dominates the landscape.',
    quotes: [
      { text: 'The world has changed forever, and so have financial markets.', source: 'THE ECONOMIST · 15 Sep 2001' },
      { text: 'Investors flee to cash and gold as war looms.', source: 'FINANCIAL TIMES · 17 Sep 2001' }
    ],
    outcomes: {
      buy: { score: 100, text: 'Courageous. Despite geopolitical terror, markets bottomed soon after and began a new cycle.' },
      hold: { score: 50, text: 'Solid resolve. You didn\'t let geopolitical fear disrupt your long-term plan.' },
      sell: { score: 0, text: 'You panic-sold on geopolitical news, historically almost always a losing strategy.' }
    },
    chartData: {
      type: 'recovery',
      yAxis: { max: 20, min: -20, step: 10 },
      lines: [
        { name: 'Dow Jones', m12: -7, m24: 6, color: '#15803d' }
      ]
    }
  },
  {
    id: 5,
    date: '15 September 2008',
    publication: 'FINANCIAL TIMES',
    headline: 'Lehman Brothers Collapses',
    stats: [
      { label: 'S&P 500', value: '1,192.70' },
      { label: 'LEHMAN BANKRUPTCY', value: '$600 Billion' },
      { label: 'VIX (FEAR INDEX)', value: '31.7' },
      { label: 'CREDIT MARKETS', value: 'Frozen' }
    ],
    context: 'The 158-year-old investment bank files for the largest bankruptcy in US history. Credit markets freeze globally. Contagion threatens every major bank, and ATMs are rumored to run out of cash by the weekend.',
    quotes: [
      { text: 'Wall Street on the Brink: The End of an Era.', source: 'THE WALL STREET JOURNAL · 16 Sep 2008' },
      { text: 'Is this the beginning of the next Great Depression?', source: 'NEWSWEEK · Sep 2008' }
    ],
    outcomes: {
      buy: { score: 50, text: 'A bit early—markets dropped further until March 2009—but a great long-term entry point.' },
      hold: { score: 50, text: 'Painful, but holding through the storm proved vastly superior to selling.' },
      sell: { score: 0, text: 'You capitulated near the bottom of the worst financial crisis since the Great Depression.' }
    },
    chartData: {
      type: 'recovery',
      yAxis: { max: 50, min: -20, step: 35 },
      lines: [
        { name: 'S&P 500', m12: -12, m24: -4, color: '#15803d' },
        { name: 'Sensex', m12: 13, m24: 45, color: '#b83b3b' }
      ]
    }
  },
  {
    id: 6,
    date: '9 March 2009',
    publication: 'THE NEW YORK TIMES',
    headline: 'Dow Drops Below 6,600: Is Capitalism Dead?',
    stats: [
      { label: 'DOW JONES INDUSTRIAL AVERAGE', value: '6,547.05' },
      { label: 'S&P 500 DRAWDOWN', value: '-57%' },
      { label: 'US UNEMPLOYMENT', value: '8.5%' },
      { label: 'INVESTOR SENTIMENT', value: 'Historic Low' }
    ],
    context: 'Peak pessimism. The media debates whether the capitalist system has fundamentally failed. Unemployment is surging, bailouts are highly unpopular, and no one sees a catalyst for recovery.',
    quotes: [
      { text: 'The Buy-and-Hold Strategy is Dead.', source: 'BARRON\'S · Feb 2009' },
      { text: 'Investors who buy now are catching a falling knife.', source: 'CNBC · Mar 2009' }
    ],
    outcomes: {
      buy: { score: 100, text: 'Legendary contrarian call! This marked the exact bottom and the start of the longest bull market in history.' },
      hold: { score: 50, text: 'You survived the worst bear market of a generation. Your patience will soon be rewarded.' },
      sell: { score: 0, text: 'You sold at the point of maximum financial opportunity.' }
    },
    chartData: {
      type: 'recovery',
      yAxis: { max: 120, min: 0, step: 30 },
      lines: [
        { name: 'Sensex', m12: 85, m24: 105, color: '#b83b3b' },
        { name: 'Dow Jones', m12: 60, m24: 83, color: '#15803d' }
      ]
    }
  },
  {
    id: 7,
    date: '28 August 2013',
    publication: 'THE ECONOMIC TIMES',
    headline: 'Rupee Hits 68.8: India in "Fragile Five"',
    stats: [
      { label: 'USD/INR EXCHANGE RATE', value: '68.80' },
      { label: 'NIFTY 50', value: '5,285.00' },
      { label: 'FII OUTFLOWS (MONTH)', value: '$3 Billion' },
      { label: 'CURRENT ACCOUNT DEFICIT', value: '4.8% of GDP' }
    ],
    context: 'The US Federal Reserve signals an end to quantitative easing (the "Taper Tantrum"). Capital violently exits emerging markets. Morgan Stanley labels India part of the "Fragile Five" vulnerable economies.',
    quotes: [
      { text: 'The Indian Growth Story is Over.', source: 'FOREIGN AFFAIRS · Aug 2013' },
      { text: 'RBI helpless as Rupee goes into freefall.', source: 'BUSINESS STANDARD · 28 Aug 2013' }
    ],
    outcomes: {
      buy: { score: 100, text: 'Excellent call! The "Taper Tantrum" was a peak fear event. Indian markets soared 30%+ the following year.' },
      hold: { score: 50, text: 'You ignored the currency panic and stayed the course.' },
      sell: { score: 0, text: 'You sold Indian equities right before a massive multi-year bull run.' }
    },
    chartData: {
      type: 'recovery',
      yAxis: { max: 80, min: -20, step: 20 },
      lines: [
        { name: 'Nifty 50', m12: 49, m24: 60, color: '#15803d' }
      ]
    }
  },
  {
    id: 8,
    date: '8 November 2016',
    publication: 'BLOOMBERG',
    headline: 'Shock Demonetisation Bans 86% of Currency',
    stats: [
      { label: 'NIFTY 50 (NEXT DAY)', value: '8,002.30 (-6%)' },
      { label: 'CURRENCY INVALIDATED', value: '₹15.4 Lakh Cr' },
      { label: 'REAL ESTATE INDEX', value: '-12%' },
      { label: 'GDP GROWTH FORECAST', value: 'Downgraded' }
    ],
    context: 'In an unprecedented move, PM Modi bans ₹500 and ₹1000 notes overnight. Cash-heavy sectors like real estate, auto, and consumer goods freeze. Economists predict severe, long-lasting GDP contraction.',
    quotes: [
      { text: 'A monumental blunder that will cripple the economy.', source: 'FORMER PM MANMOHAN SINGH · Nov 2016' },
      { text: 'Cash crunch brings Indian commerce to a standstill.', source: 'REUTERS · 15 Nov 2016' }
    ],
    outcomes: {
      buy: { score: 100, text: 'Smart move! The market entirely shrugged off the cash crunch and rallied 28% in 2017.' },
      hold: { score: 50, text: 'Good discipline. You didn\'t react to the short-term domestic policy shock.' },
      sell: { score: 0, text: 'You got spooked by domestic noise and missed a major rally.' }
    },
    chartData: {
      type: 'recovery',
      yAxis: { max: 40, min: -10, step: 10 },
      lines: [
        { name: 'Nifty 50', m12: 28, m24: 31, color: '#15803d' }
      ]
    }
  },
  {
    id: 9,
    date: '21 September 2018',
    publication: 'MINT',
    headline: 'IL&FS Defaults: NBFC Crisis Erupts',
    stats: [
      { label: 'NIFTY MIDCAP 100', value: '-25% (YTD)' },
      { label: 'IL&FS DEBT', value: '₹91,000 Cr' },
      { label: 'BOND SPREADS', value: 'Spiking' },
      { label: 'LIQUIDITY DEFICIT', value: '₹1 Lakh Cr' }
    ],
    context: 'A shadow banking giant defaults on commercial papers. Credit markets freeze in India. Mutual funds face severe redemption pressure on debt funds, spilling over into a brutal selloff in mid and small-cap stocks.',
    quotes: [
      { text: 'India\'s Lehman Moment is Here.', source: 'VARIOUS MEDIA · Sep 2018' },
      { text: 'Liquidity dries up; NBFCs fight for survival.', source: 'BUSINESS LINE · 25 Sep 2018' }
    ],
    outcomes: {
      buy: { score: 100, text: 'Great entry! While mid-caps suffered, the broader index recovered to new highs within a year.' },
      hold: { score: 50, text: 'You absorbed the volatility and let the dust settle.' },
      sell: { score: 0, text: 'You panic-sold into a liquidity crisis that was eventually resolved by the RBI.' }
    },
    chartData: {
      type: 'recovery',
      yAxis: { max: 20, min: -30, step: 10 },
      lines: [
        { name: 'Nifty 50', m12: 0, m24: -10, color: '#15803d' },
        { name: 'Nifty Midcap', m12: -15, m24: -25, color: '#b83b3b' }
      ]
    }
  },
  {
    id: 10,
    date: '23 March 2020',
    publication: 'THE WALL STREET JOURNAL',
    headline: 'Global Lockdowns: Markets Plunge 35%',
    stats: [
      { label: 'S&P 500', value: '2,237.40' },
      { label: 'NIFTY 50', value: '7,610.25' },
      { label: 'VIX (FEAR INDEX)', value: '82.69 (Record)' },
      { label: 'GLOBAL GDP HIT', value: 'Severe Contraction' }
    ],
    context: 'The COVID-19 pandemic forces unprecedented global economic lockdowns. Flights are grounded, businesses shuttered. The speed of the market collapse triggers circuit breakers multiple times in a single week.',
    quotes: [
      { text: 'The deepest recession since WWII is guaranteed.', source: 'MORGAN STANLEY · Mar 2020' },
      { text: 'Do not buy this dip. We are entering the unknown.', source: 'HEDGE FUND MANAGER · 20 Mar 2020' }
    ],
    outcomes: {
      buy: { score: 100, text: 'The ultimate contrarian bet. Central banks unleashed trillions, sparking the fastest V-shaped recovery in history.' },
      hold: { score: 50, text: 'You paralyzed your fear and held on, capturing the massive recovery.' },
      sell: { score: 0, text: 'You sold the fastest bear market in history, missing the equally fast bull market that followed immediately.' }
    },
    chartData: {
      type: 'recovery',
      yAxis: { max: 150, min: -50, step: 50 },
      lines: [
        { name: 'Nifty 50', m12: 90, m24: 123, color: '#15803d' },
        { name: 'S&P 500', m12: 75, m24: 100, color: '#1a365d' }
      ]
    }
  },
  {
    id: 11,
    date: '10 November 2021',
    publication: 'CNBC',
    headline: 'Mania: Crypto, Meme Stocks & IPOs',
    stats: [
      { label: 'NASDAQ COMPOSITE', value: '15,886.54' },
      { label: 'BITCOIN', value: '$69,000' },
      { label: 'EV STARTUP RIVIAN', value: '$100B Valuation (0 Rev)' },
      { label: 'INFLATION RATE', value: '6.2% (Transitory?)' }
    ],
    context: 'Trillions in COVID stimulus have led to wild speculation. Retail traders coordinate on Reddit to pump meme stocks. Unprofitable tech IPOs double on day one. Valuations reach extremes not seen since the year 2000.',
    quotes: [
      { text: 'Stonks only go up.', source: 'RETAIL INVESTOR MANTRA · 2021' },
      { text: 'Have fun staying poor.', source: 'CRYPTO ENTHUSIAST · Nov 2021' }
    ],
    outcomes: {
      buy: { score: 0, text: 'You bought into extreme euphoria. A punishing bear market in tech and mid-caps began weeks later.' },
      hold: { score: 50, text: 'You stayed disciplined and diversified, avoiding the worst of the speculative crash.' },
      sell: { score: 100, text: 'Brilliant. You recognized the bubble and protected your capital before the 2022 rate-hike crash.' }
    },
    chartData: {
      type: 'crash',
      yAxis: { max: 0, min: -40, step: 10 },
      lines: [
        { name: 'Nasdaq Composite', m12: -30, m24: -18, color: '#1a365d' }
      ]
    }
  },
  {
    id: 12,
    date: '25 January 2023',
    publication: 'BLOOMBERG',
    headline: 'Hindenburg Report Wipes Out Adani',
    stats: [
      { label: 'ADANI ENTERPRISES', value: '-28% (2 Days)' },
      { label: 'GROUP M-CAP LOST', value: '₹10 Lakh Crore' },
      { label: 'BANK NIFTY', value: '-4%' },
      { label: 'FII OUTFLOWS', value: 'Spiking' }
    ],
    context: 'A US short-seller accuses India\'s largest infrastructure conglomerate of fraud. The ensuing panic wipes out massive wealth in days. Fears spread that Indian banks, heavily exposed to the group, could face systemic risks.',
    quotes: [
      { text: 'The India Growth Story takes a massive credibility hit.', source: 'FOREIGN PRESS · Jan 2023' },
      { text: 'Is this the tip of the iceberg for Indian corporate governance?', source: 'FINANCIAL ANALYST · 25 Jan 2023' }
    ],
    outcomes: {
      buy: { score: 100, text: 'Astute. The contagion was contained. The broader Indian market rallied to all-time highs later that year.' },
      hold: { score: 50, text: 'You ignored the noise and trusted your diversified portfolio.' },
      sell: { score: 0, text: 'You let a stock-specific crisis scare you out of the broader market.' }
    },
    chartData: {
      type: 'recovery',
      yAxis: { max: 120, min: -40, step: 40 },
      lines: [
        { name: 'Nifty 50', m12: 20, m24: 35, color: '#15803d' },
        { name: 'Adani Ent', m12: 100, m24: 110, color: '#b83b3b' }
      ]
    }
  }
];
