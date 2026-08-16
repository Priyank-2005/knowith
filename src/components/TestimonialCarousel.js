'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './TestimonialCarousel.module.css';

const TESTIMONIALS = [
  { 
    quote: "Knowith transformed our scattered investments into a cohesive, generational wealth plan. Their structured approach brought clarity to our family's financial future.", 
    attr: "CEO, Tech Firm" 
  },
  { 
    quote: "Their transparent, fee-only model gave us the confidence we were lacking. We finally feel like our advisors are truly on our side.", 
    attr: "Retired Executive" 
  },
  { 
    quote: "Exceptional service and deep understanding of NRI tax implications. They navigated complex cross-border regulations effortlessly.", 
    attr: "NRI Investor" 
  },
  { 
    quote: "The phased execution strategy helped us deploy a large corpus during volatile markets without losing sleep.", 
    attr: "Serial Entrepreneur" 
  },
  { 
    quote: "Proactive rebalancing and continuous review mean I no longer have to micromanage my portfolio. A true institutional-grade experience.", 
    attr: "Senior Partner, Law Firm" 
  }
];

export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000); // Rotate every 6 seconds
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carouselTrack}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className={styles.testimonialWrapper}
          >
            <div className={styles.quoteMark}>"</div>
            <p className={styles.quoteText}>{TESTIMONIALS[currentIndex].quote}</p>
            <div className={styles.author}>{TESTIMONIALS[currentIndex].attr}</div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className={styles.dotsContainer}>
        {TESTIMONIALS.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
