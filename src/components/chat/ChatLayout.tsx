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
    <div className="flex flex-col h-screen bg-white font-sans overflow-hidden print:h-auto print:overflow-visible print:bg-white">
      
      {/* Top Navigation Bar */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm print:hidden">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-400 hover:text-[#0B2E33] transition-colors bg-gray-50 hover:bg-gray-100 p-2 rounded-full">
            <ChevronLeft size={20} />
          </Link>
          <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
            <div className="bg-[#0B2E33] p-1.5 rounded text-[#D9B978] shadow-sm">
              <ShieldCheck size={16} />
            </div>
            <h1 className="font-medium text-[#0B2E33] hidden sm:block font-serif text-lg tracking-wide">Knowith Capital</h1>
            <span className="text-gray-300 hidden sm:block">/</span>
            <h2 className="font-semibold text-[#D9B978] tracking-wider text-sm uppercase font-mono">{featureTitle}</h2>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden print:overflow-visible print:block bg-[#FAFAFA]">
        
        {/* Main Chat View */}
        <main className="flex-1 flex flex-col relative h-full print:h-auto print:block">
          {children}
        </main>

        {/* Dynamic Sidebar (Hidden on mobile and print) */}
        {sidebarFields && sidebarFields.length > 0 && (
          <div className="print:hidden border-l border-gray-200 shadow-xl z-10">
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
