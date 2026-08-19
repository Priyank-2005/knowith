import React from 'react';
import { ProfileSidebar } from './ProfileSidebar';
import { FieldMetadata } from '@/lib/config/types';
import { ShieldCheck, ChevronLeft } from 'lucide-react';
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
  return (
    <div className="flex flex-col h-screen bg-[#F6F3EC] font-sans overflow-hidden print:h-auto print:overflow-visible print:bg-white">
      
      {/* Top Navigation Bar */}
      <header className="h-16 bg-white/60 backdrop-blur-md border-b border-[#E8E2D2] flex items-center justify-between px-6 shrink-0 z-20 print:hidden">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-[#839F9D] hover:text-[#0B2E33] transition-colors p-2 rounded-full hover:bg-white/80">
            <ChevronLeft size={20} />
          </Link>
          <div className="flex items-center gap-3 pl-2 border-l border-[#E8E2D2]">
            <div className="bg-[#0B2E33] p-1.5 rounded text-[#D9B978] shadow-sm">
              <ShieldCheck size={16} />
            </div>
            <h1 className="font-medium text-[#0B2E33] hidden sm:block font-serif text-lg tracking-wide">Knowith Capital</h1>
            <span className="text-[#C4D1D0] hidden sm:block">/</span>
            <h2 className="font-semibold text-[#D9B978] tracking-wider text-sm uppercase font-mono">{featureTitle}</h2>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden print:overflow-visible print:block relative">
        
        {/* Main Chat View */}
        <main className="flex-1 flex flex-col relative h-full print:h-auto print:block">
          {children}
        </main>

        {/* Dynamic Sidebar (Hidden on mobile and print) */}
        {sidebarFields && sidebarFields.length > 0 && (
          <div className="print:hidden border-l border-[#E8E2D2] shadow-xl z-10 shrink-0">
            <ProfileSidebar 
              fields={sidebarFields} 
              profileData={profileData} 
            />
          </div>
        )}
      </div>

    </div>
  );
};
