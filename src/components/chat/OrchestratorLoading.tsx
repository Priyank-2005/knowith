import React, { useState, useEffect } from 'react';

const steps = [
  "Initializing Multi-Agent Framework...",
  "Analyst AI evaluating financial surplus...",
  "Strategist AI building asset allocation...",
  "Psychologist AI profiling risk behavior...",
  "Educator AI drafting bespoke insights...",
  "Assembling final Wealth Blueprint..."
];

export function OrchestratorLoading() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Cycle through steps every 6 seconds to cover the ~36s wait
    const interval = setInterval(() => {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 w-full h-full flex flex-col items-center justify-center bg-[#F6F3EC] p-6">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] p-10 flex flex-col items-center text-center overflow-hidden border border-[#E8E2D2]">
        
        {/* Pulsing background effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#B8873D] via-[#D9B978] to-[#B8873D] animate-pulse" />
        
        <div className="relative w-24 h-24 mb-8">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 rounded-full border-4 border-[#E8E2D2] border-t-[#B8873D] animate-spin" />
          {/* Inner pulse */}
          <div className="absolute inset-4 rounded-full bg-[#F6F3EC] animate-pulse flex items-center justify-center">
            <svg className="w-8 h-8 text-[#B8873D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-[#0B2E33] mb-2">
          Generating Blueprint
        </h3>
        
        <div className="h-8 flex items-center justify-center">
          <p className="text-sm font-medium text-[#B8873D] animate-pulse">
            {steps[currentStep]}
          </p>
        </div>

        <div className="mt-8 w-full bg-[#EFEAE0] rounded-full h-1.5 overflow-hidden">
          <div 
            className="h-full bg-[#0B2E33] rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
        
        <p className="mt-6 text-xs text-[#839F9D]">
          Powered by Knowith Capital AI Framework
        </p>
      </div>
    </div>
  );
}
