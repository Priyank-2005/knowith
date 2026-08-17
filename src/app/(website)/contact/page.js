"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';
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
  const [result, setResult] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult("Sending...");
    
    const formData = new FormData(e.target);
    // Add the Web3Forms access key. In a real app, this should be in .env.local
    formData.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "YOUR_ACCESS_KEY_HERE");
    
    // Optional: send to specific email (support@knowithcapital.com) if the key wasn't generated with it
    // formData.append("to", "support@knowithcapital.com");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setResult("Thank you for reaching out. A Knowith Capital wealth manager will contact you shortly.");
        e.target.reset();
      } else {
        console.error("Error", data);
        setResult(data.message || "Submission failed. Please try again.");
      }
    } catch (error) {
      setResult("Something went wrong! Please try again later.");
    }
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
                    <p>info@knowithcapital.demo</p>
                  </div>
                  <div className={styles.infoItem}>
                    <h5>HOURS</h5>
                    <p>Mon-Fri, 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </motion.div>

              <motion.form variants={fadeUp} className={styles.contactForm} onSubmit={handleSubmit}>
                {/* Prevent Web3Forms from redirecting or showing Captcha by default if needed */}
                <input type="hidden" name="subject" value="New Consultation Request from Knowith Capital" />
                <input type="hidden" name="from_name" value="Knowith Capital Contact Form" />
                
                <input type="text" name="name" placeholder="Full Name" className={styles.inputUnderline} required />
                <input type="email" name="email" placeholder="Email Address" className={styles.inputUnderline} required />
                <input type="tel" name="phone" placeholder="Phone Number" className={styles.inputUnderline} />
                <select name="reason" className={styles.inputUnderline} required defaultValue="">
                  <option value="" disabled style={{color: 'var(--ink)'}}>Select Reason</option>
                  <option value="portfolio" style={{color: 'var(--ink)'}}>Portfolio Review</option>
                  <option value="mutualfunds" style={{color: 'var(--ink)'}}>Mutual Fund Allocation</option>
                  <option value="other" style={{color: 'var(--ink)'}}>General Inquiry</option>
                </select>
                <input type="text" name="message" placeholder="Message / Details" className={styles.inputUnderline} />
                <button type="submit" className="btn btn-gold" style={{marginTop: '24px'}}>Send Message</button>
                
                {result && <p style={{marginTop: '16px', fontSize: '0.9rem', color: result.includes('Error') || result.includes('wrong') ? 'red' : 'green'}}>{result}</p>}
              </motion.form>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
