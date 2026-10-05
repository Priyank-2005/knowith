import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  faqs: FAQItem[];
}

/**
 * Clean, borderless accordion for FAQs.
 */
export function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="w-full max-w-3xl space-y-2">
      {faqs.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div key={idx} className="border-b border-[#E8E2D2]  print:border-[#D9D2C3]">
            <button
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className="w-full flex items-center justify-between py-5 text-left transition-colors hover:text-[#B8873D] :text-[#B8873D]"
            >
              <span className="font-semibold text-lg text-[#0B2E33]  print:text-black pr-8">
                {faq.question}
              </span>
              <ChevronDown 
                className={`w-5 h-5 text-[#839F9D] transition-transform duration-300 print:hidden ${isOpen ? 'rotate-180 text-[#B8873D]' : ''}`} 
              />
            </button>
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 mb-6' : 'max-h-0 opacity-0'} print:max-h-none print:opacity-100 print:mb-6`}
            >
              <p className="text-[#42504F]  leading-relaxed print:text-[#0B2E33]">
                {faq.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
