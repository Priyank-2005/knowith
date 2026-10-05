"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from '@/lib/auth/useSession';

/**
 * UI-level guard for the dashboard area. The real enforcement happens in
 * src/proxy.ts (signed session cookies); this only avoids flashing a page
 * whose session expired while the tab was open.
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { loading, admin, member } = useSession();

  const isAdminArea = pathname.startsWith('/admin');
  const authorized = isAdminArea ? Boolean(admin) : Boolean(member || admin);

  useEffect(() => {
    if (loading || authorized) return;
    router.replace(isAdminArea ? `/admin?next=${encodeURIComponent(pathname)}` : `/login?next=${encodeURIComponent(pathname)}`);
  }, [loading, authorized, isAdminArea, pathname, router]);

  if (!authorized) {
    // Match the area's background (dark admin, light member tools) to avoid a flash
    return (
      <div className={`h-[100dvh] w-full flex items-center justify-center ${isAdminArea ? 'bg-[#050505]' : 'bg-[#F6F3EC]'}`}>
        <div className="h-6 w-6 rounded-full border-2 border-[#D9B978] border-t-transparent animate-spin" aria-label="Loading" />
      </div>
    );
  }
  return <>{children}</>;
}
