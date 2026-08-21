export const WINDOW_1_FUNDS = [
  { id: 'f1', rank: 1, name: 'PGIM India Midcap', cagr: 21.2, isHighlighted: true },
  { id: 'f2', rank: 2, name: 'Axis Midcap', cagr: 20.8, isHighlighted: true },
  { id: 'f3', rank: 3, name: 'Quant Midcap', cagr: 20.3, isHighlighted: true },
  { id: 'f4', rank: 4, name: 'Edelweiss Mid Cap', cagr: 19.3, isHighlighted: false },
  { id: 'f5', rank: 5, name: 'Invesco India Mid Cap', cagr: 19.2, isHighlighted: false },
  { id: 'f6', rank: 6, name: 'Kotak Midcap', cagr: 18.9, isHighlighted: false },
  { id: 'f7', rank: 7, name: 'Nippon Growth Mid Cap', cagr: 17.9, isHighlighted: false },
  { id: 'f8', rank: 8, name: 'Tata Mid Cap', cagr: 17.4, isHighlighted: false },
  { id: 'f9', rank: 9, name: 'Taurus Mid Cap', cagr: 17.0, isHighlighted: true },
  { id: 'f10', rank: 10, name: 'Baroda BNP Midcap', cagr: 16.9, isHighlighted: false },
  { id: 'f11', rank: 11, name: 'DSP Midcap', cagr: 16.7, isHighlighted: true },
  { id: 'f12', rank: 12, name: 'ICICI Pru Midcap', cagr: 16.6, isHighlighted: false },
  { id: 'f13', rank: 13, name: 'HSBC Midcap', cagr: 16.4, isHighlighted: true },
  { id: 'f14', rank: 14, name: 'HDFC Mid Cap', cagr: 15.9, isHighlighted: true },
  { id: 'f15', rank: 15, name: 'UTI Mid Cap', cagr: 15.7, isHighlighted: false },
  { id: 'f16', rank: 16, name: 'Franklin Mid Cap', cagr: 14.6, isHighlighted: false },
  { id: 'f17', rank: 17, name: 'SBI Midcap', cagr: 14.1, isHighlighted: false },
  { id: 'f18', rank: 18, name: 'ABSL Mid Cap', cagr: 13.0, isHighlighted: false },
  { id: 'f19', rank: 19, name: 'Motilal Midcap', cagr: 12.2, isHighlighted: true },
  { id: 'f20', rank: 20, name: 'Sundaram Mid Cap', cagr: 12.1, isHighlighted: true },
];

export const WINDOW_2_FUNDS = [
  { rank: 1, cagr: 22.8, isHighlighted: true },
  { rank: 2, cagr: 20.7, isHighlighted: false },
  { rank: 3, cagr: 20.4, isHighlighted: true },
  { rank: 4, cagr: 19.7, isHighlighted: false },
  { rank: 5, cagr: 19.5, isHighlighted: false },
  { rank: 6, cagr: 18.9, isHighlighted: true },
  { rank: 7, cagr: 18.9, isHighlighted: true },
  { rank: 8, cagr: 17.9, isHighlighted: false },
  { rank: 9, cagr: 17.8, isHighlighted: false },
  { rank: 10, cagr: 16.7, isHighlighted: true },
  { rank: 11, cagr: 16.5, isHighlighted: false },
  { rank: 12, cagr: 16.4, isHighlighted: false },
  { rank: 13, cagr: 15.4, isHighlighted: false },
  { rank: 14, cagr: 15.3, isHighlighted: false },
  { rank: 15, cagr: 15.0, isHighlighted: false },
  { rank: 16, cagr: 14.8, isHighlighted: true },
  { rank: 17, cagr: 13.2, isHighlighted: false },
  { rank: 18, cagr: 12.8, isHighlighted: true },
  { rank: 19, cagr: 12.4, isHighlighted: true },
  { rank: 20, cagr: 12.3, isHighlighted: true },
];

// True mapping demonstrating mean reversion:
// Top performers from window 1 drop to bottom in window 2.
// Bottom performers from window 1 rise to top in window 2.
export const TRUE_MAPPINGS = {
  'f1': 20,   // Rank 1 -> Rank 20
  'f2': 19,   // Rank 2 -> Rank 19
  'f3': 18,   // Rank 3 -> Rank 18
  'f9': 16,   // Rank 9 -> Rank 16
  'f11': 10,  // Rank 11 -> Rank 10
  'f13': 7,   // Rank 13 -> Rank 7
  'f14': 6,   // Rank 14 -> Rank 6
  'f19': 3,   // Rank 19 -> Rank 3
  'f20': 1,   // Rank 20 -> Rank 1
};
