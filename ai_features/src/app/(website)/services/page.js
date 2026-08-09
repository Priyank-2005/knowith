"use client";

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

        <section className="section-light-2">
          <div className="container">
            <motion.div 
              className={`hairline-grid hairline-grid-light ${styles.servicesGrid}`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              {services.map((service, i) => (
                <motion.div key={i} variants={fadeUp} className={`hairline-cell-light ${styles.serviceCard}`}>
                  <div className={styles.iconWrapper}>
                    {service.icon}
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
