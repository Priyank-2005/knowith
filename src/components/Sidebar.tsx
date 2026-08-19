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
    <div className="flex h-screen w-[260px] flex-col bg-[#0B2E33] border-r border-[#15464D] text-white print:hidden shrink-0">
      {/* Logo */}
      <div className="px-6 py-8">
        <h1 className="text-2xl font-serif text-[#F6F3EC] tracking-wide">
          {sidebarTitle}
        </h1>
        <p className="text-[10px] text-[#D9B978] mt-1 tracking-widest uppercase font-mono">{sidebarSubtitle}</p>
      </div>

      {/* Section Label */}
      <div className="px-6 pb-2 mt-2">
        <p className="text-[10px] font-semibold text-[#839F9D] uppercase tracking-widest font-mono">
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
                  ? "bg-[#0F3A3F] text-[#D9B978] shadow-inner border border-[#1A5C66]" 
                  : "text-[#C4D1D0] hover:text-white hover:bg-[#0F3A3F]"
              )}
            >
              <Icon className={cn("w-[18px] h-[18px] shrink-0", isActive ? "text-[#D9B978]" : "text-[#839F9D]")} />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Card + Logout */}
      <div className="p-4 border-t border-[#15464D] space-y-3 bg-[#0B2E33] relative z-20">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#0F3A3F] border border-[#1A5C66]">
          <div className={cn(
            "w-8 h-8 rounded flex items-center justify-center text-xs font-bold shrink-0 text-[#0B2E33] shadow-sm",
            userRole === 'ADMIN' 
              ? "bg-[#D9B978]" 
              : "bg-[#D9B978]"
          )}>
            {userName ? userName.charAt(0).toUpperCase() : 'K'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-[#F6F3EC] truncate">{userName || 'User'}</p>
            <p className="text-[10px] text-[#D9B978] uppercase font-mono tracking-wider">{userRole?.replace('_', '-')?.toLowerCase() || 'Guest'}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-[11px] uppercase font-mono tracking-widest text-[#839F9D] hover:text-[#ef4444] hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
