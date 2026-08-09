"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('knowith_user');
      if (!stored) {
        // No user found, redirect to login
        router.push('/login');
        return;
      }

      const user = JSON.parse(stored);
      
      // Role-based routing protection
      if (user.role === 'ADMIN' && !pathname.startsWith('/admin')) {
        // Admin shouldn't be in AI tools
        router.push('/admin/campaigns');
        return;
      }
      
      if (user.role !== 'ADMIN' && pathname.startsWith('/admin')) {
        // Non-admin shouldn't be in admin tools
        router.push('/advisor');
        return;
      }

      // If we made it here, they are authorized for this route
      setIsAuthorized(true);
    } catch (error) {
      // JSON parse error or something else, force login
      localStorage.removeItem('knowith_user');
      router.push('/login');
    }
  }, [router, pathname]);

  // Don't render children until we've confirmed authorization to prevent flash of unauthorized content
  if (!isAuthorized) {
    return <div className="h-screen w-screen bg-[#050505]" />; // Blank screen while checking
  }

  return <>{children}</>;
}
