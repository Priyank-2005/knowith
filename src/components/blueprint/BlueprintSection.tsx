import React from 'react';

interface BlueprintSectionProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

/**
 * Editorial section wrapper.
 * Replaces generic cards by providing strong typographic hierarchy and generous whitespace.
 */
export function BlueprintSection({ title, subtitle, children, className = '', fullWidth = false }: BlueprintSectionProps) {
  return (
    <section className={`relative print:break-inside-avoid print:py-8 ${className}`}>
      {(title || subtitle) && (
        <header className="mb-6 print:mb-6">
          {title && (
            <h2 className="font-serif text-2xl md:text-3xl text-[#0B2E33] font-medium tracking-tight mb-2 print:text-black">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-lg text-[#6B7876]  font-sans print:text-[#42504F]">
              {subtitle}
            </p>
          )}
        </header>
      )}
      
      <div className={`${fullWidth ? 'w-[100vw] relative left-1/2 -translate-x-1/2 px-6 md:px-12 max-w-[1200px]' : ''}`}>
        {children}
      </div>
    </section>
  );
}
