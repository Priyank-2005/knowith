import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_COOKIE, MEMBER_COOKIE, adminIpAllowed, clientIp, verifyAdminToken, verifyMemberToken } from '@/lib/auth/session';

// ────────────────────────────────────────────────────────────────
// Access control
//   • /admin (login) and everything admin-only is restricted to
//     ADMIN_IP_ALLOWLIST when set, and requires a signed admin session.
//   • Member tools (AI advisor etc.) require an approved client (email OTP)
//     or an admin session.
// Route handlers that mutate data also verify the session themselves.
// ────────────────────────────────────────────────────────────────

const MEMBER_PAGES = ['/advisor', '/health', '/news', '/portfolio', '/sip', '/support', '/tax'];
const MEMBER_APIS = ['/api/v1/advisor', '/api/v1/health', '/api/v1/portfolio', '/api/v1/tax', '/api/v1/sip'];

const under = (path: string, prefix: string) => path === prefix || path.startsWith(prefix + '/');

function isAdminApi(req: NextRequest): boolean {
  const { pathname, searchParams } = req.nextUrl;
  const method = req.method;

  if (['/api/v1/campaigns', '/api/v1/contacts', '/api/v1/templates', '/api/v1/admin', '/api/v1/leads', '/api/v1/uploads', '/api/v1/insights/convert']
    .some(p => under(pathname, p))) return true;

  if (under(pathname, '/api/v1/insights')) {
    return method !== 'GET' || searchParams.get('all') === '1' || searchParams.get('preview') === '1';
  }
  if (under(pathname, '/api/v1/market-data')) {
    // GET /generate is the Vercel cron (CRON_SECRET-protected in the handler)
    if (pathname === '/api/v1/market-data/generate') return method !== 'GET';
    // Public: the live report and Indian fund data. Everything else (report by id, delete) is admin.
    if (pathname === '/api/v1/market-data' || pathname === '/api/v1/market-data/india') return method !== 'GET';
    return true;
  }
  if (pathname === '/api/v1/games/config') return method !== 'GET';
  return false;
}

const notFound = () => new NextResponse('Not found', { status: 404 });

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isApi = pathname.startsWith('/api/');

  // ── Admin area ────────────────────────────────────────────────
  const adminLogin = pathname === '/admin' || under(pathname, '/api/v1/auth/admin');
  const adminPage = pathname.startsWith('/admin/');
  const adminApi = isApi && isAdminApi(req);

  if (adminLogin || adminPage || adminApi) {
    if (!adminIpAllowed(clientIp(req.headers))) return notFound();
    if (adminLogin) return NextResponse.next();

    const admin = await verifyAdminToken(req.cookies.get(ADMIN_COOKIE)?.value);
    if (!admin) {
      if (isApi) return NextResponse.json({ error: 'Admin sign-in required' }, { status: 401 });
      const url = new URL('/admin', req.url);
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // ── Member tools ──────────────────────────────────────────────
  const memberPage = MEMBER_PAGES.some(p => under(pathname, p));
  const memberApi = MEMBER_APIS.some(p => under(pathname, p)) || pathname === '/api/v1/market';
  if (memberPage || memberApi) {
    const member = await verifyMemberToken(req.cookies.get(MEMBER_COOKIE)?.value);
    const admin = member ? null : await verifyAdminToken(req.cookies.get(ADMIN_COOKIE)?.value);
    if (!member && !admin) {
      if (isApi) return NextResponse.json({ error: 'Please sign in to use this tool' }, { status: 401 });
      const url = new URL('/login', req.url);
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/v1/:path*',
    '/advisor/:path*', '/health/:path*', '/news/:path*', '/portfolio/:path*', '/sip/:path*', '/support/:path*', '/tax/:path*',
  ],
};
