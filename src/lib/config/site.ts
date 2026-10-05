// External links used by the login page. Update here when the client confirms them.
export const SITE_LINKS = {
  /** Knowith's FundzBazar link for the website — existing clients sign in, new investors sign up */
  fundzbazarWeb: 'https://fundzbazar.com/Link/UCWewZi9UcM',
  /** Knowith's FundzBazar mobile app link */
  fundzbazarApp: 'https://fundzbazar.com/Link/qbGeni6zST0',
  /** QR codes for the same links (shown on desktop so visitors can scan with their phone) */
  fundzbazarWebQr: '/images/fundzbazar-website-qr.png',
  fundzbazarAppQr: '/images/fundzbazar-app-qr.png',
  /** Investors registered through a partner platform (e.g. Prudent). Leave empty to hide the option. */
  partnerLogin: '',
  partnerName: 'Prudent',
};

/** Allow only same-site relative redirects (prevents open redirects via ?next=). */
export function safeNext(next: string | null | undefined, fallback: string, prefix = '/'): string {
  if (!next || !next.startsWith(prefix) || next.startsWith('//') || next.includes('\\')) return fallback;
  return next;
}
