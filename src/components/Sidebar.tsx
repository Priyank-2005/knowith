"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Activity, 
  PieChart, 
  Target, 
  ShieldCheck, 
  Headphones, 
  Newspaper,
  Mail,
  Users,
  LayoutTemplate,
  LogOut,
  Globe
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// AI Features — visible to NON_CLIENT only
const aiFeatureItems = [
  { name: 'Investment Advisor', href: '/advisor', icon: TrendingUp },
  { name: 'Financial Health', href: '/health', icon: Activity },
  { name: 'Portfolio Analyzer', href: '/portfolio', icon: PieChart },
  { name: 'SIP Calculator', href: '/sip', icon: Target },
  { name: 'Tax Advisor', href: '/tax', icon: ShieldCheck },
  { name: 'Market News', href: '/market', icon: Newspaper },
];

// Email Marketing & Admin Tools — visible to ADMIN only
const adminItems = [
  { name: 'Campaigns', href: '/admin/campaigns', icon: Mail },
  { name: 'Email Templates', href: '/admin/campaigns/templates', icon: LayoutTemplate },
  { name: 'Audience', href: '/admin/campaigns/contacts', icon: Users },
  { name: 'Chat Logs', href: '/admin/chats', icon: Headphones },
  { name: 'Market Data', href: '/admin/market-data', icon: Globe },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('knowith_user');
      if (stored) {
        const user = JSON.parse(stored);
        setUserRole(user.role);
        setUserName(user.name || user.email);
      }
    } catch {}
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('knowith_user');
    router.push('/login');
  };

  // Determine which nav items to show based on role
  let navItems: typeof aiFeatureItems = [];
  let sidebarTitle = 'Knowith AI';
  let sidebarSubtitle = 'Capital Intelligence';

  if (userRole === 'ADMIN') {
    navItems = adminItems;
    sidebarTitle = 'Knowith Admin';
    sidebarSubtitle = 'Email Marketing';
  } else if (userRole === 'NON_CLIENT') {
    navItems = aiFeatureItems;
    sidebarTitle = 'Knowith AI';
    sidebarSubtitle = 'Capital Intelligence';
  } else {
    // Default: show AI features (fallback)
    navItems = aiFeatureItems;
  }

  return (
    <div className="flex h-screen w-[260px] flex-col bg-[var(--ink)] border-r border-[rgba(217,185,120,0.1)] text-white print:hidden shrink-0">
      {/* Logo */}
      <div className="px-6 py-6">
        <h1 className="text-2xl font-normal text-[var(--marble)]" style={{ fontFamily: 'var(--font-display), serif' }}>
          {sidebarTitle}
        </h1>
        <p className="text-[11px] text-[var(--gold)] mt-1 tracking-wider uppercase font-mono">{sidebarSubtitle}</p>
      </div>

      {/* Section Label */}
      <div className="px-6 pb-2 mt-2">
        <p className="text-[10px] font-semibold text-[var(--on-dark-soft)] uppercase tracking-widest font-mono">
          {userRole === 'ADMIN' ? 'Email Marketing' : 'AI Tools'}
        </p>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 space-y-1 px-3 overflow-y-auto mt-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-[13.5px] font-medium transition-all duration-200",
                isActive 
                  ? "bg-[var(--gold)] text-[var(--ink)] shadow-md" 
                  : "text-[var(--marble)] hover:text-white hover:bg-[rgba(217,185,120,0.1)]"
              )}
            >
              <Icon className={cn("w-[18px] h-[18px] shrink-0", isActive ? "text-[var(--ink)]" : "text-[var(--gold)]")} />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Card + Logout */}
      <div className="p-3 border-t border-[rgba(217,185,120,0.1)] space-y-2">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[rgba(217,185,120,0.05)] border border-[rgba(217,185,120,0.1)]">
          <div className={cn(
            "w-8 h-8 rounded flex items-center justify-center text-xs font-bold shrink-0 text-[var(--ink)]",
            userRole === 'ADMIN' 
              ? "bg-[var(--gold)]" 
              : "bg-[var(--gold)]"
          )}>
            {userName ? userName.charAt(0).toUpperCase() : 'K'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-[var(--marble)] truncate">{userName || 'User'}</p>
            <p className="text-[11px] text-[var(--on-dark-soft)] capitalize font-mono">{userRole?.replace('_', '-')?.toLowerCase() || 'Guest'}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] uppercase font-mono tracking-wide text-[var(--on-dark-soft)] hover:text-[#ef4444] hover:bg-[rgba(217,185,120,0.05)] transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
