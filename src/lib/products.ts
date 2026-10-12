// Curated product lists for the Indian Market page (SIF, Gift City, PMS).

export const PRODUCT_CATEGORIES = [
  { id: 'SIF', label: 'SIF', full: 'Specialized Investment Funds' },
  { id: 'GIFT_CITY', label: 'Gift City', full: 'Gift City Funds' },
  { id: 'PMS', label: 'PMS', full: 'Portfolio Management Services' },
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]['id'];

export const isProductCategory = (v: unknown): v is ProductCategory =>
  PRODUCT_CATEGORIES.some(c => c.id === v);

export interface Product {
  id: string;
  category: ProductCategory;
  name: string;
  provider: string | null;
  strategy: string | null;
  minInvestment: string | null;
  return1y: number | null;
  return3y: number | null;
  return5y: number | null;
  aum: string | null;
  benchmark: string | null;
  fees: string | null;
  notes: string | null;
  url: string | null;
}

/** Editable fields, in the order they appear in the Excel template. */
export const PRODUCT_FIELDS = [
  { key: 'name', header: 'Name', required: true },
  { key: 'provider', header: 'Provider' },
  { key: 'strategy', header: 'Strategy' },
  { key: 'minInvestment', header: 'Min Investment' },
  { key: 'return1y', header: '1Y Return %' },
  { key: 'return3y', header: '3Y Return %' },
  { key: 'return5y', header: '5Y Return %' },
  { key: 'aum', header: 'AUM' },
  { key: 'benchmark', header: 'Benchmark' },
  { key: 'fees', header: 'Fees' },
  { key: 'notes', header: 'Notes' },
  { key: 'url', header: 'Link' },
] as const;

export type ProductInput = Partial<Record<(typeof PRODUCT_FIELDS)[number]['key'], string | number | null>>;

const text = (v: unknown, max: number): string | null => {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s ? s.slice(0, max) : null;
};

const num = (v: unknown): number | null => {
  if (v === null || v === undefined || v === '') return null;
  const n = typeof v === 'number' ? v : parseFloat(String(v).replace(/[%,\s]/g, ''));
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : null;
};

/** Only http(s) links are kept, so a pasted `javascript:` URL can never end up in the page. */
const link = (v: unknown): string | null => {
  const s = text(v, 500);
  if (!s) return null;
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(s) ? s : `https://${s}`;
  try {
    const u = new URL(withScheme);
    return u.protocol === 'http:' || u.protocol === 'https:' ? u.toString() : null;
  } catch {
    return null;
  }
};

/** Cleans one row from the admin form or an uploaded sheet. Returns null when the name is missing. */
export function sanitizeProduct(input: ProductInput) {
  const name = text(input.name, 200);
  if (!name) return null;
  return {
    name,
    provider: text(input.provider, 200),
    strategy: text(input.strategy, 200),
    minInvestment: text(input.minInvestment, 100),
    return1y: num(input.return1y),
    return3y: num(input.return3y),
    return5y: num(input.return5y),
    aum: text(input.aum, 100),
    benchmark: text(input.benchmark, 200),
    fees: text(input.fees, 300),
    notes: text(input.notes, 1000),
    url: link(input.url),
  };
}
