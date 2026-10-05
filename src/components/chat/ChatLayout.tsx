"use client";

import React, { useState } from 'react';
import { ProfileSidebar } from './ProfileSidebar';
import { FieldMetadata } from '@/lib/config/types';
import { ShieldCheck, ChevronLeft, ClipboardList, X } from 'lucide-react';
import Link from 'next/link';

interface ChatLayoutProps {
  children: React.ReactNode;
  sidebarFields: FieldMetadata[];
  profileData: Record<string, any>;
  featureTitle: string;
}

export const ChatLayout: React.FC<ChatLayoutProps> = ({
  children,
  sidebarFields,
  profileData,
  featureTitle
}) => {
  const [showProfile, setShowProfile] = useState(false);
  const hasSidebar = sidebarFields && sidebarFields.length > 0;
  const filled = hasSidebar ? sidebarFields.filter(f => profileData[f.id] !== undefined && profileData[f.id] !== null && profileData[f.id] !== '').length : 0;

  return (
    <div className="flex flex-col h-full bg-[#F6F3EC] font-sans overflow-hidden print:h-auto print:overflow-visible print:bg-white min-w-0">

      {/* Top Navigation Bar */}
      <header className="h-16 bg-white/60 backdrop-blur-md border-b border-[#E8E2D2] flex items-center justify-between gap-3 px-4 md:px-6 shrink-0 z-20 print:hidden">
        <div className="flex items-center gap-3 md:gap-4 min-w-0">
          <Link href="/" aria-label="Back to website" className="text-[#839F9D] hover:text-[#0B2E33] transition-colors p-2 rounded-full hover:bg-white/80 shrink-0">
            <ChevronLeft size={20} />
          </Link>
          <div className="flex items-center gap-3 pl-2 border-l border-[#E8E2D2] min-w-0">
            <div className="bg-[#0B2E33] p-1.5 rounded text-[#D9B978] shadow-sm shrink-0">
              <ShieldCheck size={16} />
            </div>
            <span className="font-medium text-[#0B2E33] hidden sm:block font-serif text-lg tracking-wide shrink-0">Knowith Capital</span>
            <span className="text-[#C4D1D0] hidden sm:block">/</span>
            <h1 className="font-semibold text-[#B8873D] tracking-wider text-xs md:text-sm uppercase font-mono truncate">{featureTitle}</h1>
          </div>
        </div>

        {/* Profile snapshot toggle (the panel is inline on wide screens) */}
        {hasSidebar && (
          <button
            onClick={() => setShowProfile(true)}
            className="xl:hidden flex items-center gap-2 shrink-0 px-3 py-2 rounded-lg border border-[#E8E2D2] bg-white text-[#0B2E33] text-xs font-semibold hover:border-[#D9B978]"
          >
            <ClipboardList size={15} className="text-[#B8873D]" />
            <span className="hidden sm:inline">Your snapshot</span>
            <span className="text-[#839F9D] font-mono">{filled}/{sidebarFields.length}</span>
          </button>
        )}
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden print:overflow-visible print:block relative min-w-0">

        {/* Main Chat View */}
        <main className="flex-1 flex flex-col relative h-full print:h-auto print:block min-w-0">
          {children}
        </main>

        {/* Profile sidebar: inline on wide screens, slide-over below xl; hidden in print */}
        {hasSidebar && (
          <>
            {showProfile && (
              <div className="xl:hidden fixed inset-0 z-40 bg-black/30 print:hidden" onClick={() => setShowProfile(false)} aria-hidden />
            )}
            <div className={`print:hidden border-l border-[#E8E2D2] shadow-xl shrink-0 w-80 max-w-[85vw] bg-[#F6F3EC]
              fixed inset-y-0 right-0 z-50 transition-transform duration-200 ${showProfile ? 'translate-x-0' : 'translate-x-full'}
              xl:static xl:z-10 xl:translate-x-0 xl:transition-none`}
            >
              <button
                onClick={() => setShowProfile(false)}
                aria-label="Close snapshot"
                className="xl:hidden absolute top-4 right-4 z-10 p-1.5 rounded-full bg-white border border-[#E8E2D2] text-[#0B2E33]"
              >
                <X size={16} />
              </button>
              <ProfileSidebar
                fields={sidebarFields}
                profileData={profileData}
              />
            </div>
          </>
        )}
      </div>

    </div>
  );
};
