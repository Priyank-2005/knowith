export function calculateXIRR(cashflows) {
  // Approximate XIRR for game purposes
  let totalInvested = 0;
  let finalValue = 0;
  cashflows.forEach(cf => {
    if (cf.amount < 0) totalInvested += Math.abs(cf.amount);
    else finalValue += cf.amount;
  });
  if (totalInvested === 0) return 0;
  const years = cashflows.length > 1 ? (cashflows[cashflows.length-1].date - cashflows[0].date) : 1;
  const cagr = Math.pow(finalValue / totalInvested, 1 / Math.max(1, years)) - 1;
  return (cagr * 100).toFixed(1);
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

export function getPermutations(arr) {
  if (arr.length === 0) return [[]];
  const first = arr[0];
  const rest = arr.slice(1);
  const permsWithoutFirst = getPermutations(rest);
  const allPerms = [];
  permsWithoutFirst.forEach(perm => {
    for (let i = 0; i <= perm.length; i++) {
      const withFirst = [...perm.slice(0, i), first, ...perm.slice(i)];
      allPerms.push(withFirst);
    }
  });
  return allPerms;
}

export function calculateCorpus(returns) {
  let nav = 10;
  let units = 0;
  let invested = 0;
  let corpus = 0;
  const history = [{ year: 0, nav: 10, units: 0, corpus: 0 }];
  
  returns.forEach((r, i) => {
    nav = nav * (1 + (r / 100));
    invested += 1000;
    units += 1000 / nav;
    history.push({ year: i + 1, nav, units, corpus: units * nav, returnPct: r });
  });
  corpus = units * nav;
  return { finalCorpus: corpus, totalUnits: units, history };
}
