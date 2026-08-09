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

export default function About() {
  return (
    <>
      <Navbar />
      <main>
        <section className={`section-light ${styles.header}`}>
          <div className="container" style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <motion.div variants={fadeUp} initial="hidden" animate="visible" className="eyebrow">Our Philosophy</motion.div>
            <motion.h1 
              initial="hidden" animate="visible" variants={fadeUp}
              className={styles.title}
            >
              Built on clarity.<br/>Driven by analytics.
            </motion.h1>
            <motion.p 
              initial="hidden" animate="visible" variants={fadeUp}
              className={styles.subtitle}
            >
              Knowith Capital is Udaipur's premier institutional-grade wealth advisory, bringing global financial standards to local investors.
            </motion.p>
          </div>
        </section>

        <section className="section-light-2">
          <div className="container">
            <motion.div 
              className={styles.contentBox}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.h3 variants={fadeUp}>A Structured Approach</motion.h3>
              <motion.p variants={fadeUp}>
                In an industry clouded by noise and speculation, we believe in the power of structure. We approach wealth management not as a series of disconnected gambles, but as a carefully architected framework designed to withstand market volatility.
              </motion.p>
              <motion.p variants={fadeUp}>
                We prioritize radical transparency. When you invest through Knowith Capital, you understand exactly where your capital is deployed, the associated risks, and the realistic timeline for your returns.
              </motion.p>
              
              <motion.h3 variants={fadeUp}>The Partners</motion.h3>
              <motion.p variants={fadeUp}>
                Our leadership brings decades of combined experience in institutional finance, portfolio construction, and macroeconomic analysis. We treat your capital with the same rigorous scrutiny we apply to our own.
              </motion.p>
            </motion.div>

            <motion.div 
              className={`hairline-grid hairline-grid-light ${styles.statsGrid}`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeUp} className={`hairline-cell-light ${styles.statItem}`}>
                <h4>2014</h4>
                <p>Founded</p>
              </motion.div>
              <motion.div variants={fadeUp} className={`hairline-cell-light ${styles.statItem}`}>
                <h4>₹250Cr+</h4>
                <p>Assets Managed</p>
              </motion.div>
              <motion.div variants={fadeUp} className={`hairline-cell-light ${styles.statItem}`}>
                <h4>98%</h4>
                <p>Client Retention</p>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
