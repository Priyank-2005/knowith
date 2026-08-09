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
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for reaching out. A Knowith Capital wealth manager will contact you shortly.");
  };

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <section className={styles.contactSection}>
          <div className="container">
            <motion.div 
              className={styles.contactGrid}
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={fadeUp} className={styles.contactInfo}>
                <div className="eyebrow">Connect</div>
                <h1>Begin the Conversation</h1>
                <p>Schedule a confidential consultation to discuss your financial architecture. We operate on a strict appointment-only basis to ensure complete discretion.</p>
                
                <div className={styles.infoList}>
                  <div className={styles.infoItem}>
                    <h5>HEADQUARTERS</h5>
                    <p>Near Jain Digital Mart, Hiran Magri,<br/>Udaipur, Rajasthan</p>
                  </div>
                  <div className={styles.infoItem}>
                    <h5>DIRECT LINE</h5>
                    <p>+91 98765 43210</p>
                  </div>
                  <div className={styles.infoItem}>
                    <h5>PRIVATE ADVISORY DESK</h5>
                    <p>advisory@knowithcapital.demo</p>
                  </div>
                  <div className={styles.infoItem}>
                    <h5>HOURS</h5>
                    <p>Mon-Fri, 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </motion.div>

              <motion.form variants={fadeUp} className={styles.contactForm} onSubmit={handleSubmit}>
                <input type="text" placeholder="Full Name" className={styles.inputUnderline} required />
                <input type="email" placeholder="Email Address" className={styles.inputUnderline} required />
                <input type="tel" placeholder="Phone Number" className={styles.inputUnderline} />
                <select className={styles.inputUnderline} required defaultValue="">
                  <option value="" disabled style={{color: 'var(--ink)'}}>Select Reason</option>
                  <option value="portfolio" style={{color: 'var(--ink)'}}>Portfolio Review</option>
                  <option value="mutualfunds" style={{color: 'var(--ink)'}}>Mutual Fund Allocation</option>
                  <option value="other" style={{color: 'var(--ink)'}}>General Inquiry</option>
                </select>
                <input type="text" placeholder="Message / Details" className={styles.inputUnderline} />
                <button type="submit" className="btn btn-gold" style={{marginTop: '24px'}}>Send Message</button>
              </motion.form>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
