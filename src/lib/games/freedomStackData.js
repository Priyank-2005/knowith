export const BINS = {
  plan: { id: 'plan', label: 'Plan', emoji: '🧭', color: '#3B82F6', soft: 'rgba(59,130,246,0.12)', desc: 'Goals, inflation, emergency reserves, cash flow & execution' },
  protect: { id: 'protect', label: 'Protect', emoji: '🛡️', color: '#F59E0B', soft: 'rgba(245,158,11,0.12)', desc: 'Insurance, costly debt, nominations & contingency' },
  stabilise: { id: 'stabilise', label: 'Stabilise', emoji: '⚖️', color: '#8B5CF6', soft: 'rgba(139,92,246,0.12)', desc: 'Debt funds, gold, rebalancing, diversification & glide paths' },
  grow: { id: 'grow', label: 'Grow', emoji: '🌱', color: '#10B981', soft: 'rgba(16,185,129,0.12)', desc: 'Equity, SIP discipline, compounding & long-term wealth' },
  avoid: { id: 'avoid', label: 'Avoid', emoji: '⚠️', color: '#EF4444', soft: 'rgba(239,68,68,0.12)', desc: 'FOMO, recency bias, leverage, panic & concentration' },
};

export const SITUATIONS = [
  // Plan
  { id: 1, text: "You calculate how much ₹50,000 monthly expenses will cost 20 years from now assuming 6% inflation.", correctBin: "plan", explanation: "Accounting for inflation is a critical part of goal setting to ensure your retirement corpus is actually sufficient." },
  { id: 2, text: "Before selecting any mutual fund, you first decide that your portfolio will be 60% equity and 40% debt.", correctBin: "plan", explanation: "Asset allocation drives 90% of your returns. Deciding this before picking schemes is the right top-down approach." },
  { id: 3, text: "You create a detailed monthly budget to ensure your cash flow allows for consistent SIPs.", correctBin: "plan", explanation: "Cash flow management is the foundation of execution. Without surplus cash, plans remain on paper." },
  { id: 4, text: "You map out exactly how much a 4-year engineering degree will cost in 2035 for your newborn.", correctBin: "plan", explanation: "Specific, time-bound goals with future values help you calculate the exact SIP amount needed today." },
  { id: 5, text: "Instead of asking 'which fund gives highest return', you ask 'which asset class suits my 3-year goal'.", correctBin: "plan", explanation: "Goal-based investing prioritizes certainty and timelines over chasing maximum returns." },
  { id: 6, text: "You establish an emergency fund equal to 6 months of your mandatory living expenses.", correctBin: "plan", explanation: "Emergency funds ensure you don't have to redeem long-term investments during short-term crises." },
  { id: 7, text: "You sit down on the first weekend of April to review all your financial goals and progress.", correctBin: "plan", explanation: "Annual reviews help you track progress, course-correct, and adjust assumptions if needed." },
  { id: 8, text: "You structure your investments using ELSS and PPF to ensure maximum tax efficiency under Section 80C.", correctBin: "plan", explanation: "Tax-efficient investing reduces leakage and allows more of your money to compound over time." },
  { id: 9, text: "You calculate your retirement corpus requirement assuming you will live till age 90.", correctBin: "plan", explanation: "Estimating a long life expectancy prevents the risk of outliving your retirement savings." },
  { id: 10, text: "You write down your financial goals, asset allocation, and emergency plan in a physical notebook.", correctBin: "plan", explanation: "A written financial plan increases commitment and clarity, serving as an anchor during market volatility." },
  { id: 11, text: "You list all your bank accounts, mutual fund folios, and insurance policies in a single document for your family.", correctBin: "plan", explanation: "Estate planning basics ensure your family can access your wealth seamlessly if you are not around." },
  { id: 12, text: "You decide to start saving for a house downpayment required in 5 years, targeting a corpus of ₹20 Lakhs.", correctBin: "plan", explanation: "Clear goals with specific timelines allow you to choose the right financial instruments." },

  // Protect
  { id: 13, text: "You purchase a pure term life insurance policy for ₹1.5 Crores, about 15x your annual income.", correctBin: "protect", explanation: "Term life insurance provides high cover at low cost, protecting your family's future income." },
  { id: 14, text: "You buy a separate ₹10 Lakh family floater health insurance policy instead of just relying on your employer's cover.", correctBin: "protect", explanation: "Employer cover stops if you lose or change jobs. Personal health insurance is non-negotiable." },
  { id: 15, text: "You check and update the nominee details for your PPF, bank accounts, and mutual fund folios.", correctBin: "protect", explanation: "Updating nominees ensures smooth transmission of assets and prevents legal hurdles for your family." },
  { id: 16, text: "You refuse an endowment policy pitched by a bank relationship manager, keeping insurance and investment separate.", correctBin: "protect", explanation: "Mixing insurance and investment (like ULIPs or endowments) usually results in poor returns and inadequate cover." },
  { id: 17, text: "You park your ₹3 Lakh emergency fund in a liquid mutual fund and a sweep-in FD for instant access.", correctBin: "protect", explanation: "Emergency reserves must prioritize liquidity and capital protection over high returns." },
  { id: 18, text: "You create a registered Will to ensure your assets are distributed exactly according to your wishes.", correctBin: "protect", explanation: "A Will prevents family disputes and clearly outlines wealth distribution after your passing." },
  { id: 19, text: "You increase your term insurance cover after taking a ₹50 Lakh home loan.", correctBin: "protect", explanation: "Reviewing insurance adequacy is crucial when liabilities increase to protect dependents from debt burdens." },
  { id: 20, text: "You add a critical illness rider to your health insurance to cover major diseases like cancer.", correctBin: "protect", explanation: "Critical illness cover provides a lump sum to replace income and cover non-hospitalization expenses during severe illnesses." },
  { id: 21, text: "You maintain a buffer of 3 months' EMI payments in a separate account in case of unexpected job loss.", correctBin: "protect", explanation: "Contingency planning specifically for debt obligations prevents defaults and credit score damage." },
  { id: 22, text: "You buy personal disability insurance to protect your income in case of an accident.", correctBin: "protect", explanation: "Disability insurance covers the risk of losing your earning capacity, which term life insurance doesn't." },
  { id: 23, text: "You enable two-factor authentication and never share OTPs, safeguarding against cyber fraud.", correctBin: "protect", explanation: "Protecting your digital financial assets is as important as earning returns in the modern age." },
  { id: 24, text: "You clearly explain to your spouse how to access the family's health insurance e-cards during an emergency.", correctBin: "protect", explanation: "Insurance is useless if your family doesn't know how to claim it when an emergency strikes." },

  // Stabilise
  { id: 25, text: "You invest your savings for a 2-year goal entirely in short-duration debt mutual funds.", correctBin: "stabilise", explanation: "Debt funds offer stability and better post-tax returns than savings accounts for short-term goals." },
  { id: 26, text: "You allocate 10% of your total portfolio to Sovereign Gold Bonds (SGBs).", correctBin: "stabilise", explanation: "Gold acts as a hedge against inflation and currency depreciation, stabilizing the portfolio during equity crises." },
  { id: 27, text: "Your equity allocation grew to 75% due to a bull run, so you sell some to bring it back to your target 60%.", correctBin: "stabilise", explanation: "Rebalancing forces you to sell high and buy low, managing risk and maintaining your intended asset allocation." },
  { id: 28, text: "With your daughter's college admission just 2 years away, you start shifting her education corpus from equity to debt.", correctBin: "stabilise", explanation: "A glide path reduces equity risk as goals approach, protecting accumulated wealth from sudden market crashes." },
  { id: 29, text: "You avoid investing in a debt fund offering 12% returns, knowing it likely takes on high credit risk.", correctBin: "stabilise", explanation: "Understanding credit risk is vital. Higher debt returns always come with a higher risk of default." },
  { id: 30, text: "You hold a mix of large-cap, mid-cap, and international funds rather than just one category.", correctBin: "stabilise", explanation: "Diversification across market caps and geographies reduces the impact of underperformance in any single area." },
  { id: 31, text: "You choose a target-date fund for your retirement that automatically reduces equity as you age.", correctBin: "stabilise", explanation: "Target-date approaches automate the crucial process of de-risking a portfolio over time." },
  { id: 32, text: "You check the average maturity of a debt fund to ensure it aligns with your investment horizon.", correctBin: "stabilise", explanation: "Matching duration risk ensures you aren't forced to sell debt funds at a loss if interest rates rise." },
  { id: 33, text: "You set up a Systematic Transfer Plan (STP) to gradually move funds from a liquid fund to equity.", correctBin: "stabilise", explanation: "An STP stabilizes entry into equity markets, reducing the risk of investing a lump sum at a market peak." },
  { id: 34, text: "You maintain a conservative 30:70 equity-to-debt ratio because you have a low risk tolerance.", correctBin: "stabilise", explanation: "Asset allocation must match your emotional ability to handle volatility, not just mathematical optimization." },
  { id: 35, text: "You add a US Index fund to your portfolio to benefit from geographical diversification.", correctBin: "stabilise", explanation: "International diversification stabilizes returns when the domestic market underperforms." },
  { id: 36, text: "You ensure no single stock makes up more than 5% of your overall equity portfolio.", correctBin: "stabilise", explanation: "Limiting individual stock exposure stabilizes the portfolio against company-specific disasters." },

  // Grow
  { id: 37, text: "The Nifty crashes by 20%, but you continue your monthly ₹10,000 SIP without stopping.", correctBin: "grow", explanation: "Continuing SIPs during market falls allows you to accumulate more units at lower prices, boosting long-term returns." },
  { id: 38, text: "You invest in equity mutual funds for your retirement which is 25 years away.", correctBin: "grow", explanation: "Equity is the most effective asset class for beating inflation and generating real wealth over long time horizons (7+ years)." },
  { id: 39, text: "You leave your investments untouched for 15 years, letting the returns generate their own returns.", correctBin: "grow", explanation: "The power of compounding shows its true magic only over decades. Patience is the key ingredient." },
  { id: 40, text: "You increase your SIP amount by 10% every year in line with your salary hike.", correctBin: "grow", explanation: "A step-up SIP dramatically increases your final corpus and aligns your savings rate with income growth." },
  { id: 41, text: "You choose a low-cost Nifty 50 Index Fund for your core long-term equity allocation.", correctBin: "grow", explanation: "Index funds offer broad market exposure at a very low cost, often beating active funds over long periods." },
  { id: 42, text: "You start investing ₹2,000 a month at age 22 instead of waiting until you earn more.", correctBin: "grow", explanation: "Starting early gives you a massive time advantage, making smaller contributions work harder through compounding." },
  { id: 43, text: "You measure your portfolio's performance using XIRR rather than just looking at absolute profit.", correctBin: "grow", explanation: "XIRR correctly accounts for the timing of multiple cash flows (like SIPs) to show your true annualized return." },
  { id: 44, text: "You stay invested through a full 5-year market cycle of bull and bear phases.", correctBin: "grow", explanation: "Staying invested through full cycles is necessary to capture the long-term equity premium." },
  { id: 45, text: "You reinvest all dividends back into your mutual funds by choosing the 'Growth' option.", correctBin: "grow", explanation: "The Growth option allows dividends to compound over time, whereas paying them out leaks wealth." },
  { id: 46, text: "You ignore news predicting a market crash next week and stick to your 10-year investment plan.", correctBin: "grow", explanation: "Not timing the market ensures you don't miss out on the few best days that generate most equity returns." },
  { id: 47, text: "You remain calm and patient when your equity portfolio shows negative returns in year two.", correctBin: "grow", explanation: "Patience through volatility is the psychological toll you must pay for long-term equity returns." },
  { id: 48, text: "You understand that long-term wealth is built on business growth, not stock price speculation.", correctBin: "grow", explanation: "Focusing on underlying business value rather than price fluctuations builds true long-term wealth." },

  // Avoid
  { id: 49, text: "You invest heavily in last year's #1 ranked small-cap fund expecting the same returns.", correctBin: "avoid", explanation: "Chasing past performance is a classic trap. Last year's winner is rarely next year's winner due to mean reversion." },
  { id: 50, text: "You buy a penny stock because a forward on WhatsApp claimed it will double in a month.", correctBin: "avoid", explanation: "Social media tips are often pump-and-dump schemes designed to trap retail investors." },
  { id: 51, text: "You take a personal loan at 14% to invest in the stock market during a bull run.", correctBin: "avoid", explanation: "Using leverage (borrowed money) for volatile investments can wipe out your capital and leave you in severe debt." },
  { id: 52, text: "The market drops 5% in a day, and you immediately sell all your equity funds out of fear.", correctBin: "avoid", explanation: "Panic selling turns temporary paper losses into permanent capital destruction." },
  { id: 53, text: "You hold 15 different mutual funds, but discover 8 of them own the exact same top 10 stocks.", correctBin: "avoid", explanation: "Excessive portfolio overlap gives you the illusion of diversification without the actual benefit." },
  { id: 54, text: "You invest 80% of your net worth in the stock of the company you work for.", correctBin: "avoid", explanation: "Concentrating wealth ties both your human capital (job) and financial capital to a single entity's fate." },
  { id: 55, text: "You log in to your mutual fund app every single day to check if your portfolio is green or red.", correctBin: "avoid", explanation: "Checking daily triggers anxiety and tempts you to make unnecessary, harmful changes to your portfolio." },
  { id: 56, text: "You stop your SIPs because the market hasn't given any returns over the last 6 months.", correctBin: "avoid", explanation: "Recency bias makes you project recent short-term trends into the future, causing you to stop investing at the best times." },
  { id: 57, text: "Your friends are making quick money in crypto, so you blindly invest your child's education fund in it.", correctBin: "avoid", explanation: "Investing based on FOMO (Fear Of Missing Out) often leads to buying highly speculative assets at the peak." },
  { id: 58, text: "You buy an investment scheme that guarantees 3% returns every month with zero risk.", correctBin: "avoid", explanation: "Rejecting get-rich-quick schemes is vital. High guaranteed returns with zero risk are always frauds." },
  { id: 59, text: "You keep switching between large-cap, mid-cap, and small-cap funds based on which is currently doing well.", correctBin: "avoid", explanation: "Performance chasing across categories increases taxes, exit loads, and usually results in buying high and selling low." },
  { id: 60, text: "You buy a traditional life insurance policy just to save tax under Section 80C at the last minute.", correctBin: "avoid", explanation: "Confusing insurance with investment leads to sub-optimal returns and inadequate life cover." }
];

export const PLAYER_TITLES = [
  { min: 90, title: 'Freedom Architect', desc: 'You understand the complete financial planning framework.' },
  { min: 75, title: 'Disciplined Builder', desc: 'Strong foundations with room for some refinement.' },
  { min: 55, title: 'Promising Planner', desc: 'Good instincts, but some gaps in the framework.' },
  { min: 0, title: 'Bias Breaker in Training', desc: 'Many common traps caught you — but now you know them.' },
];

export function getPlayerTitle(score) {
  for (const title of PLAYER_TITLES) {
    if (score >= title.min) {
      return title;
    }
  }
  return PLAYER_TITLES[PLAYER_TITLES.length - 1];
}

export function shuffleSituations() {
  const shuffled = [...SITUATIONS];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
