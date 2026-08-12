"use client";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function Home() {
  // SIP Calculator State
  const [amount, setAmount] = useState(25000);
  const [returnRate, setReturnRate] = useState(12);
  const [years, setYears] = useState(15);
  
  const [invested, setInvested] = useState(0);
  const [corpus, setCorpus] = useState(0);

  useEffect(() => {
    const P = amount;
    const n = years * 12;
    const i = returnRate / 12 / 100;
    const M = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const totalInvested = P * n;
    
    setInvested(totalInvested);
    setCorpus(M);
  }, [amount, returnRate, years]);

  const formatCurr = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("This is a demo contact form.");
  };

  return (
    <>
      <Navbar />
      
      {/* 1. Hero */}
      <section className={styles.hero}>
        <motion.div 
          className={styles.heroContent}
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="eyebrow">A Legacy of Trust</motion.div>
          <motion.h1 variants={fadeInUp} className={styles.heroHeadline}>
            Architecting Wealth for the <span>Next Generation</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className={styles.heroSub}>
            Institutional-grade mutual fund advisory and financial planning in Udaipur. We build relationships, not just portfolios, grounding your financial future in structure and stability.
          </motion.p>
          <motion.div variants={fadeInUp} className={styles.heroButtons}>
            <Link href="/contact" className="btn btn-gold">Book Consultation</Link>
            <Link href="/about" className="btn btn-ghost">Our Approach</Link>
          </motion.div>
          
          <motion.div variants={fadeInUp} className={styles.heroStats}>
            <div className={styles.statItem}>
              <h4>₹250Cr+</h4>
              <p>AUM Managed (Placeholder)</p>
            </div>
            <div className={styles.statItem}>
              <h4>12+</h4>
              <p>Years Experience</p>
            </div>
            <div className={styles.statItem}>
              <h4>300+</h4>
              <p>Families Served</p>
            </div>
          </motion.div>
        </motion.div>
        
        {/* The Graphic */}
        <div className={styles.heroGraphic}>
          <div className={styles.rippleRing}></div>
          <div className={styles.rippleRing}></div>
          <div className={styles.rippleRing}></div>
          <img src="/images/skyline.jpg" alt="Skyline Placeholder" className={styles.citySkyline} style={{mixBlendMode: 'luminosity', filter: 'sepia(1) hue-rotate(10deg) opacity(0.3)'}} />
          <img src="/images/skyline.jpg" alt="Skyline Reflect" className={styles.citySkylineReflect} style={{mixBlendMode: 'luminosity', filter: 'sepia(1) hue-rotate(10deg)'}} />
        </div>
      </section>

      {/* 2. Trust Bar */}
      <section className={styles.trustBar}>
        <span>AMFI Registered (Fake ARN-123456)</span>
        <span>SEBI Reg. Placeholder</span>
        <span>BSE Star MF Partner</span>
        <span>ISO 9001:2015</span>
      </section>

      {/* 3. Approach */}
      <section className="section-light" id="approach">
        <motion.div 
          className="container"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="eyebrow">The Knowith Method</motion.div>
          <motion.h2 variants={fadeInUp}>Structured Financial Engineering</motion.h2>
          <br /><br />
          <motion.div variants={fadeInUp} className={`hairline-grid hairline-grid-light ${styles.approachCards}`}>
            <div className={`hairline-cell-light ${styles.approachCard}`}>
              <div className={styles.stepNum}>01 / LISTEN</div>
              <h3>Audit & Discovery</h3>
              <p>We begin by understanding your current asset allocation, liabilities, and long-term generational goals before making any recommendations.</p>
            </div>
            <div className={`hairline-cell-light ${styles.approachCard}`}>
              <div className={styles.stepNum}>02 / DESIGN</div>
              <h3>Strategic Architecture</h3>
              <p>Crafting a tailored roadmap utilizing optimal tax-efficient instruments across equity, debt, and alternative assets.</p>
            </div>
            <div className={`hairline-cell-light ${styles.approachCard}`}>
              <div className={styles.stepNum}>03 / DEPLOY</div>
              <h3>Phased Execution</h3>
              <p>Systematic deployment of capital to mitigate timing risk, ensuring your portfolio is built on a solid foundation.</p>
            </div>
            <div className={`hairline-cell-light ${styles.approachCard}`}>
              <div className={styles.stepNum}>04 / REBALANCE</div>
              <h3>Continuous Review</h3>
              <p>Proactive monitoring and algorithmic rebalancing to maintain optimal asset allocation as market dynamics shift.</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 4. Services */}
      <section className="section-light-2">
        <motion.div 
          className="container"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="eyebrow">Core Capabilities</motion.div>
          <motion.h2 variants={fadeInUp}>Wealth Management Services</motion.h2>
          <br /><br />
          <div className={`hairline-grid hairline-grid-light ${styles.servicesGrid}`}>
            {[
              { num: '01', title: 'Financial Structuring', desc: 'Comprehensive roadmaps aligned with your life goals.' },
              { num: '02', title: 'Wealth Distribution', desc: 'Holistic management of your assets for long-term growth.' },
              { num: '03', title: 'Investment Portfolio', desc: 'Diversified baskets of equity, debt, and gold.' },
              { num: '04', title: 'Mutual Funds', desc: 'Expert selection of top-performing active and passive funds.' },
              { num: '05', title: 'Insurance Planning', desc: 'Protecting your family and assets against uncertainties.' },
              { num: '06', title: 'NRI Solutions', desc: 'Specialized investment services for global Indians.' },
            ].map((srv, i) => (
              <motion.div variants={fadeInUp} key={i} className={`hairline-cell-light ${styles.serviceCard}`}>
                <div className="eyebrow" style={{marginBottom: '16px'}}>{srv.num}</div>
                <h3>{srv.title}</h3>
                <p>{srv.desc}</p>
                <Link href="/services" className={styles.serviceLink}>Learn More &rarr;</Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 5. Products */}
      <section className={styles.productsStrip} id="products">
        {['Mutual Funds', 'PMS & AIF', 'Direct Equity', 'Bonds & FDs', 'Gold ETFs', 'NPS / Retirement'].map((prod, i) => (
          <motion.div 
            key={i} 
            className={styles.productItem}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <h4>{prod}</h4>
          </motion.div>
        ))}
      </section>

      {/* 6. Calculator */}
      <section className="section-light">
        <motion.div 
          className="container"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="eyebrow">Wealth Projection</motion.div>
          <motion.h2 variants={fadeInUp}>SIP Growth Calculator</motion.h2>
          <br /><br />
          <motion.div variants={fadeInUp} className={styles.calcBox}>
            <div className={styles.calcControls}>
              <div className={styles.formGroup}>
                <label><span>Monthly Investment</span> <span>{formatCurr(amount)}</span></label>
                <input type="range" min="1000" max="200000" step="1000" value={amount} onChange={e => setAmount(Number(e.target.value))} />
              </div>
              <div className={styles.formGroup}>
                <label><span>Expected Return (p.a)</span> <span>{returnRate}%</span></label>
                <input type="range" min="5" max="25" step="0.5" value={returnRate} onChange={e => setReturnRate(Number(e.target.value))} />
              </div>
              <div className={styles.formGroup}>
                <label><span>Time Period</span> <span>{years} Years</span></label>
                <input type="range" min="1" max="40" step="1" value={years} onChange={e => setYears(Number(e.target.value))} />
              </div>
            </div>
            
            <div className={styles.calcOutput}>
              <div className={styles.outputLabel}>Estimated Corpus</div>
              <div className={styles.outputValue}>{formatCurr(corpus)}</div>
              
              <div className={styles.chartContainer}>
                {Array.from({ length: 15 }).map((_, i) => {
                  const progress = (i + 1) / 15;
                  const h = Math.max(10, progress * progress * 100);
                  return <div key={i} className={styles.chartBar} style={{ height: `${h}%` }}></div>;
                })}
              </div>
              
              <div className={styles.chartLegend}>
                <span>Invested: {formatCurr(invested)}</span>
                <span>Gain: {formatCurr(corpus - invested)}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 7. Insights */}
      <section className="section-light-2">
        <motion.div 
          className="container"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="eyebrow">Market Intelligence</motion.div>
          <motion.h2 variants={fadeInUp}>Insights & Perspectives</motion.h2>
          <br /><br />
          <div className={`hairline-grid hairline-grid-light ${styles.insightsGrid}`}>
            {[
              { tag: 'Market Update', title: 'Navigating Volatility in Q3', desc: 'How structured asset allocation protects against downside risk.' },
              { tag: 'Taxation', title: 'New LTCG Rules Explained', desc: 'Adjusting your portfolio for optimal tax harvesting.' },
              { tag: 'Retirement', title: 'The 4% Rule in India', desc: 'Why standard withdrawal rates need adjustment for domestic inflation.' }
            ].map((article, i) => (
              <motion.div variants={fadeInUp} key={i} className={`hairline-cell-light ${styles.insightCard}`}>
                <div className={styles.insightMedia}></div>
                <div className={styles.insightContent}>
                  <div className="eyebrow" style={{marginBottom: 0}}>{article.tag}</div>
                  <h3>{article.title}</h3>
                  <p>{article.desc}</p>
                  <Link href="/insights" className={styles.serviceLink}>Read the note &rarr;</Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 8. Team */}
      <section className="section-light">
        <motion.div 
          className="container"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="eyebrow">Leadership</motion.div>
          <motion.h2 variants={fadeInUp} style={{textAlign: 'center'}}>Guided by Experience</motion.h2>
          <div className={`hairline-grid hairline-grid-light ${styles.teamGrid}`}>
            {[
              { initials: 'PT', name: 'Pradnya Tamhane', role: 'Founder & Principal' },
              { initials: 'AD', name: 'Placeholder Name', role: 'Head of Research' },
              { initials: 'RK', name: 'Placeholder Name', role: 'Wealth Manager' }
            ].map((member, i) => (
              <motion.div variants={fadeInUp} key={i} className={styles.teamCard}>
                <div className={styles.avatar}>{member.initials}</div>
                <h4>{member.name}</h4>
                <div className={styles.teamRole}>{member.role}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 9. Testimonials */}
      <section className="section-light-2">
        <motion.div 
          className="container"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="eyebrow">Client Experience</motion.div>
          <motion.h2 variants={fadeInUp}>Relationships Built on Trust</motion.h2>
          <br /><br />
          <div className={`hairline-grid hairline-grid-light ${styles.testiGrid}`}>
            {[
              { quote: "Knowith transformed our scattered investments into a cohesive, generational wealth plan.", attr: "CEO, Tech Firm (Placeholder)" },
              { quote: "Their transparent, fee-only model gave us the confidence we were lacking.", attr: "Retired Executive (Placeholder)" },
              { quote: "Exceptional service and deep understanding of NRI tax implications.", attr: "NRI Investor (Placeholder)" }
            ].map((testi, i) => (
              <motion.div variants={fadeInUp} key={i} className={`hairline-cell-light ${styles.testiCard}`}>
                <p className={styles.testiQuote}>"{testi.quote}"</p>
                <div className={styles.testiAttr}>{testi.attr}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 10. Contact (Dark) */}
      <section className="section-dark">
        <motion.div 
          className="container"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <div className={styles.contactGrid}>
            <motion.div variants={fadeInUp} className={styles.contactInfo}>
              <div className="eyebrow">Connect</div>
              <h2>Begin the Conversation</h2>
              <p>Schedule a confidential consultation to discuss your financial architecture.</p>
              
              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <h5>VISIT US</h5>
                  <p>Near Jain Digital Mart, Hiran Magri,<br/>Udaipur, Rajasthan</p>
                </div>
                <div className={styles.infoItem}>
                  <h5>CALL US</h5>
                  <p>+91 98765 43210</p>
                </div>
                <div className={styles.infoItem}>
                  <h5>EMAIL</h5>
                  <p>advisory@knowithcapital.demo</p>
                </div>
              </div>
            </motion.div>

            <motion.form variants={fadeInUp} className={styles.contactForm} onSubmit={handleSubmit}>
              <input type="text" placeholder="Full Name" className={styles.inputUnderline} required />
              <input type="email" placeholder="Email Address" className={styles.inputUnderline} required />
              <input type="tel" placeholder="Phone Number" className={styles.inputUnderline} />
              <input type="text" placeholder="How can we help?" className={styles.inputUnderline} />
              <button type="submit" className="btn btn-gold" style={{marginTop: '24px'}}>Send Message</button>
            </motion.form>
          </div>
        </motion.div>
      </section>

      <Footer />
    </>
  );
}
