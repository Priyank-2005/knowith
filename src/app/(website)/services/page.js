"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const services = [
  { title: "Financial Structuring", desc: "Comprehensive roadmaps aligned with your life goals.", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg> },
  { title: "Wealth Distributor", desc: "Holistic management of your assets for long-term growth.", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg> },
  { title: "Investment Portfolio", desc: "Diversified baskets of equity, debt, and gold.", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg> },
  { title: "Mutual Funds", desc: "Expert selection of top-performing funds.", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg> },
  { title: "Insurance Planning", desc: "Protecting your family and assets against uncertainties.", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
  { title: "Amortisation Schedule", desc: "Understand your investment growth and withdrawal impact.", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { title: "Retirement Roadmap", desc: "Secure your golden years with stress-free corpus building.", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
  { title: "NRI Solutions", desc: "Specialized investment services for global Indians.", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg> }
];

export default function Services() {
  const [activeService, setActiveService] = React.useState(null);

  // Close modal when Escape key is pressed
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveService(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <section className={`section-light ${styles.header}`}>
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="container">
            <motion.div variants={fadeUp} className="eyebrow" style={{justifyContent: 'center'}}>Architecture</motion.div>
            <motion.h1 variants={fadeUp} className={styles.title}>Structuring Your Wealth</motion.h1>
            <motion.p variants={fadeUp} className={styles.subtitle}>
              At <strong style={{color: 'var(--ink)'}}>Knowith Capital</strong>, this is how we meticulously plan and structure your wealth to ensure long-term growth and stability.
            </motion.p>
          </motion.div>
        </section>

        <section className="section-light-2 relative">
          <div className="container">
            <motion.div 
              className={`hairline-grid hairline-grid-light ${styles.servicesGrid}`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              {services.map((service, i) => {
                return (
                  <motion.div 
                    key={i} 
                    variants={fadeUp} 
                    className={`hairline-cell-light ${styles.serviceCard} group cursor-pointer hover:bg-[#EFEAE0]/50 transition-colors`}
                    onClick={() => setActiveService(service)}
                  >
                    <div className={styles.iconWrapper}>
                      {service.icon}
                    </div>
                    <h3>{service.title}</h3>
                    <p>{service.desc}</p>
                    
                    <div className="mt-4 text-[var(--gold)] text-[0.9rem] font-bold opacity-80 group-hover:opacity-100 transition-opacity">
                      Read Details &rarr;
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />

      {/* Modal Popup */}
      {activeService && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer" 
            onClick={() => setActiveService(null)}
          ></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-[var(--marble)] rounded-2xl p-8 md:p-12 max-w-2xl w-full shadow-2xl z-10 text-center"
          >
            <button 
              onClick={() => setActiveService(null)}
              className="absolute top-4 right-4 p-2 text-[var(--slate)] hover:text-[var(--ink)] transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
            
            <div className="flex justify-center mb-6 text-[var(--gold)]">
              {React.cloneElement(activeService.icon, { width: 48, height: 48 })}
            </div>
            
            <h2 className="text-3xl font-serif text-[var(--ink)] mb-4">
              {activeService.title}
            </h2>
            
            <p className="text-[var(--slate-soft)] text-lg mb-8">
              {activeService.desc}
            </p>
            
            <div className="border-t border-[var(--border-light)] pt-8 text-left space-y-4">
              <p className="text-[var(--slate)]">
                This service provides institutional-level frameworks tailored specifically to your unique goals. We employ data-driven strategies to maximize returns while managing downside risk effectively.
              </p>
              <p className="text-[var(--slate)]">
                Our approach involves a rigorous quantitative process coupled with qualitative insights to adapt to evolving market dynamics, ensuring your wealth distribution stays perfectly aligned with your long-term aspirations.
              </p>
            </div>
            
            <div className="mt-10 flex justify-center">
              <button 
                onClick={() => setActiveService(null)}
                className="px-8 py-3 border border-[var(--gold)] text-[var(--gold)] font-bold text-sm tracking-widest uppercase hover:bg-[var(--gold)] hover:text-[var(--ink)] transition-all rounded"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
