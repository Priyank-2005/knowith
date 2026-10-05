import React from 'react';

interface MetricItem {
  label: string;
  value: string | number;
  max?: number;
}

interface MetricStripProps {
  metrics: MetricItem[];
}

/**
 * A sleek, horizontal data visualization strip replacing bulky score cards.
 */
export function MetricStrip({ metrics }: MetricStripProps) {
  return (
    <div className="w-full flex flex-col sm:flex-row border-y border-[#E8E2D2]  divide-y sm:divide-y-0 sm:divide-x divide-[#E8E2D2]  print:border-black print:divide-black">
      {metrics.map((metric, idx) => (
        <div key={idx} className="flex-1 py-6 sm:px-8 first:sm:pl-0 last:sm:pr-0">
          <div className="text-sm font-medium text-[#6B7876] uppercase tracking-widest mb-3 print:text-[#42504F]">
            {metric.label}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-4xl text-[#0B2E33]  print:text-black">
              {metric.value}
            </span>
            {metric.max !== undefined && (
              <span className="text-sm font-medium text-[#839F9D] print:text-[#42504F]">
                / {metric.max}
              </span>
            )}
          </div>
          
          {/* Subtle Progress Indicator if numeric and max provided */}
          {typeof metric.value === 'number' && metric.max !== undefined && (
            <div className="mt-4 w-full h-1 bg-[#EFEAE0]  rounded-full overflow-hidden print:bg-[#EFEAE0]">
              <div 
                className="h-full bg-[#B8873D] rounded-full print:bg-black"
                style={{ width: `${Math.min(100, Math.max(0, (metric.value / metric.max) * 100))}%` }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
