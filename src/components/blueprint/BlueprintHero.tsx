import React from 'react';
import { Download } from 'lucide-react';

interface BlueprintHeroProps {
  title: string;
  subtitle?: string;
  primaryMetric?: string | number;
  primaryMetricLabel?: string;
  onDownload?: () => void;
}

/**
 * High-impact, typographic hero section for Blueprints.
 */
export function BlueprintHero({ title, subtitle, primaryMetric, primaryMetricLabel, onDownload }: BlueprintHeroProps) {
  const currentDate = new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  return (
    <header className="w-full flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 md:pb-10 border-b border-[#E8E2D2]  print:pb-8 print:border-black">
      <div className="max-w-2xl">
        <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-widest text-[#6B7876] mb-4 print:text-black">
          <span>Prepared by Knowith AI</span>
          <span className="w-1 h-1 bg-[#D9B978] rounded-full"></span>
          <span>{currentDate}</span>
        </div>
        
        <h1 className="font-serif text-4xl md:text-5xl text-[#0B2E33] font-medium tracking-tight leading-[1.1] mb-4 print:text-black">
          {title}
        </h1>
        
        {subtitle && (
          <p className="text-lg text-[#42504F] font-sans leading-relaxed print:text-[#0B2E33]">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex flex-col items-start md:items-end gap-6 shrink-0">
        {primaryMetric !== undefined && (
          <div className="text-left md:text-right">
            <div className="font-serif text-5xl md:text-6xl text-[#0B2E33] tracking-tighter print:text-black">
              {primaryMetric}
            </div>
            {primaryMetricLabel && (
              <div className="text-sm font-medium text-[#6B7876] uppercase tracking-widest mt-2 print:text-[#42504F]">
                {primaryMetricLabel}
              </div>
            )}
          </div>
        )}

        {onDownload && (
          <button 
            onClick={onDownload}
            className="group flex items-center gap-2 px-5 py-2.5 bg-[#0B2E33]  text-white  rounded-full font-medium text-sm transition-all hover:scale-105 active:scale-95 print:hidden shadow-sm"
          >
            <Download className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
            <span>Download PDF</span>
          </button>
        )}
      </div>
    </header>
  );
}
