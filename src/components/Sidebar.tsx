"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSession, signOut } from '@/lib/auth/useSession';
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
  Globe,
  PlayCircle,
  UserCheck,
  Menu,
  X,
  ArrowLeft
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// AI tools — for approved clients (email OTP) and admins
const aiFeatureItems = [
  { name: 'Investment Advisor', href: '/advisor', icon: TrendingUp },
  { name: 'Financial Health', href: '/health', icon: Activity },
  { name: 'Portfolio Analyzer', href: '/portfolio', icon: PieChart },
  { name: 'SIP Calculator', href: '/sip', icon: Target },
  { name: 'Tax Advisor', href: '/tax', icon: ShieldCheck },
  { name: 'Market News', href: '/news', icon: Newspaper },
];

const adminItems = [
  { name: 'Campaigns', href: '/admin/campaigns', icon: Mail },
  { name: 'Email Templates', href: '/admin/campaigns/templates', icon: LayoutTemplate },
  { name: 'Audience', href: '/admin/campaigns/contacts', icon: Users },
  { name: 'Chat Logs', href: '/admin/chats', icon: Headphones },
  { name: 'Market Data', href: '/admin/market-data', icon: Globe },
  { name: 'Insights', href: '/admin/insights', icon: Newspaper },
  { name: 'Client Access', href: '/admin/clients', icon: UserCheck },
  { name: 'Games config', href: '/admin/games', icon: PlayCircle },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, member } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  // The admin area shows staff tools; everything else is the member tools area
  const userRole = pathname.startsWith('/admin') && admin ? 'ADMIN' : 'MEMBER';
  const userName = (userRole === 'ADMIN' ? admin?.name || admin?.email : member?.name || member?.email || admin?.email) ?? '';

  const handleLogout = async () => {
    await signOut(userRole === 'ADMIN' ? 'admin' : 'member');
    router.push(userRole === 'ADMIN' ? '/admin' : '/');
  };

  const navItems = userRole === 'ADMIN' ? adminItems : aiFeatureItems;
  const sidebarTitle = userRole === 'ADMIN' ? 'Knowith Admin' : 'Knowith AI';
  const sidebarSubtitle = userRole === 'ADMIN' ? 'Admin Console' : 'Capital Intelligence';

  return (
    <>
    {/* Mobile top bar */}
    <div className="lg:hidden fixed top-0 inset-x-0 z-40 h-14 flex items-center justify-between px-4 bg-[#0B2E33] border-b border-[#15464D] print:hidden">
      <div>
        <div className="text-lg font-serif text-[#F6F3EC] leading-none">{sidebarTitle}</div>
        <div className="text-[9px] text-[#D9B978] mt-1 tracking-widest uppercase font-mono">{sidebarSubtitle}</div>
      </div>
      <button onClick={() => setMobileOpen(true)} aria-label="Open menu" className="p-2 rounded-lg text-[#F6F3EC] hover:bg-[#0F3A3F]">
        <Menu className="w-5 h-5" />
      </button>
    </div>

    {/* Drawer backdrop (mobile) */}
    {mobileOpen && (
      <div className="lg:hidden fixed inset-0 z-40 bg-black/50 print:hidden" onClick={() => setMobileOpen(false)} aria-hidden />
    )}

    <div className={cn(
      "fixed top-0 left-0 bottom-0 z-50 flex w-[260px] flex-col bg-[#0B2E33] border-r border-[#15464D] text-white print:hidden transition-transform duration-200",
      mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
    )}>
      {/* Logo */}
      <div className="px-6 py-8 flex items-start justify-between">
        <div>
          <div className="text-2xl font-serif text-[#F6F3EC] tracking-wide">
            {sidebarTitle}
          </div>
          <p className="text-[10px] text-[#D9B978] mt-1 tracking-widest uppercase font-mono">{sidebarSubtitle}</p>
        </div>
        <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="lg:hidden p-1 rounded text-[#839F9D] hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Section Label */}
      <div className="px-6 pb-2 mt-2">
        <p className="text-[10px] font-semibold text-[#839F9D] uppercase tracking-widest font-mono">
          {userRole === 'ADMIN' ? 'Manage' : 'AI Tools'}
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
              onClick={() => setMobileOpen(false)}
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

        {userRole !== 'ADMIN' && (
          <Link href="/" className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-[11px] uppercase font-mono tracking-widest text-[#C4D1D0] hover:text-white hover:bg-[#0F3A3F] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to website
          </Link>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-[11px] uppercase font-mono tracking-widest text-[#839F9D] hover:text-[#ef4444] hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>
    </div>
    </>
  );
}
