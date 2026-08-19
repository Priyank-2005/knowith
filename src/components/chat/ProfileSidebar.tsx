import React from 'react';
import { FieldMetadata } from '@/lib/config/types';
import { CheckCircle2, Circle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProfileSidebarProps {
  fields: FieldMetadata[];
  profileData: Record<string, any>;
  title?: string;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ fields, profileData, title = "Your Financial Snapshot" }) => {
  // Calculate completion percentage
  const totalRequired = fields.filter(f => f.required).length;
  const completedRequired = fields.filter(f => f.required && profileData[f.id] !== undefined && profileData[f.id] !== null).length;
  const progress = totalRequired === 0 ? 100 : Math.round((completedRequired / totalRequired) * 100);

  // Financial Readiness Score (Visual only for now, based on progress)
  const readinessScore = Math.min(progress, 99); // Max 99 until fully computed in the Blueprint

  return (
    <div className="w-80 bg-white h-full flex flex-col hidden lg:flex z-10 border-l border-gray-200">
      
      {/* Header & Readiness Score */}
      <div className="p-8 border-b border-gray-200 bg-white relative overflow-hidden">
        
        <h2 className="text-xl font-medium text-[#0B2E33] tracking-tight relative z-10 font-serif">{title}</h2>
        <p className="text-xs text-gray-500 mt-1 mb-6 relative z-10 font-mono uppercase tracking-wider">Data secured by Knowith AI</p>
        
        {/* Animated Circular Score */}
        <div className="flex items-center gap-5 relative z-10">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle cx="32" cy="32" r="28" fill="transparent" stroke="#F3F4F6" strokeWidth="6" />
              <motion.circle 
                cx="32" 
                cy="32" 
                r="28" 
                fill="transparent" 
                stroke="#D9B978" 
                strokeWidth="6" 
                strokeDasharray="175.93" 
                initial={{ strokeDashoffset: 175.93 }}
                animate={{ strokeDashoffset: 175.93 - (175.93 * progress) / 100 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-lg font-bold text-[#0B2E33] leading-none">{progress}%</span>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#0B2E33]">Readiness Score</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {progress === 100 ? "Ready for Blueprint" : "Collecting insights..."}
            </p>
          </div>
        </div>
      </div>

      {/* Verified Fields List */}
      <div className="flex-1 overflow-y-auto p-6 scroll-smooth bg-[#FAFAFA]">
        <div className="space-y-6">
          {fields.map((field, idx) => {
            const val = profileData[field.id];
            const isCompleted = val !== undefined && val !== null;
            
            return (
              <motion.div 
                key={field.id} 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="relative group"
              >
                <div className="flex items-center gap-3 mb-1.5">
                  <AnimatePresence mode="wait">
                    {isCompleted ? (
                      <motion.div
                        key="completed"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      >
                        <ShieldCheck size={18} className="text-[#D9B978] drop-shadow-sm" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="pending"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <Circle size={18} className="text-gray-300" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <label className={`text-[12px] font-semibold uppercase tracking-widest font-mono ${isCompleted ? 'text-[#0B2E33]' : 'text-gray-500'} transition-colors`}>
                    {field.label} {field.required && !isCompleted && <span className="text-[#D9B978]">*</span>}
                  </label>
                </div>
                
                <div className="pl-7 border-l-2 border-transparent group-hover:border-gray-200 transition-colors py-0.5">
                  <AnimatePresence mode="wait">
                    {isCompleted ? (
                      <motion.div 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-[#0B2E33] bg-white py-2 px-3 rounded-lg border border-gray-200 shadow-sm font-medium"
                      >
                        {field.type === 'currency' 
                          ? (typeof val === 'number' ? `₹ ${val.toLocaleString('en-IN')}` : String(val).includes('₹') ? val : `₹ ${val}`) 
                          : String(val)}
                      </motion.div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs font-medium text-gray-400 bg-gray-100 py-1.5 px-3 rounded inline-block"
                      >
                        Awaiting response...
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
