'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';
import { GameProvider, useGameState } from '@/lib/games/gameState';
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

const chapters = [
  {
    id: 'chapter1',
    num: '01',
    title: 'Season Survivor',
    desc: '10 years. 1 decision per year. Can you hold through the winters?',
    href: '/games/season-survivor',
    color: '#45D483' // spring green
  },
  {
    id: 'chapter2',
    num: '02',
    title: 'Sequence Shuffle',
    desc: '5 returns, you choose the order. Learn how sequence matters.',
    href: '/games/sequence-shuffle',
    color: '#FFC94A' // summer gold
  },
  {
    id: 'chapter3',
    num: '03',
    title: 'The Panic Room',
    desc: '6 real crises, 12 seconds each. Do you hit sell?',
    href: '/games/panic-room',
    color: '#FF5F73' // winter red
  },
  {
    id: 'chapter4',
    num: '04',
    title: 'Unit Rapid Fire',
    desc: '10 questions, 15 seconds each. Test your market mechanics.',
    href: '/games/rapid-fire',
    color: '#8FA3C8' // autumn blue-grey
  },
  {
    id: 'chapter5',
    num: '05',
    title: 'The Contrarian Signal',
    desc: 'Read real market extreme headlines, make a call, see what happened next.',
    href: '/games/contrarian-signal',
    color: '#3B82F6' // royal blue
  }
];

function HubContent() {
  const { vaultUnits, scores, resetGame } = useGameState();
  const allCompleted = scores.chapter1 !== null && scores.chapter2 !== null && scores.chapter3 !== null && scores.chapter4 !== null && scores.chapter5 !== null;

  return (
    <>
      <Navbar />
      
      <main className={styles.hubMain}>
        <motion.section 
          className={styles.hero}
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className={styles.subtitle}>An Investor Almanac by Knowith Capital</motion.div>
          <motion.h1 variants={fadeInUp} className={styles.title}>The Unit Vault</motion.h1>
          <motion.div variants={fadeInUp} className={styles.tagline}>Four seasons. One habit.</motion.div>
          <motion.blockquote variants={fadeInUp} className={styles.quote}>
            "Wealth in a SIP is not built by the returns you get. It is built by the units you own when the returns finally arrive."
          </motion.blockquote>

          <motion.div variants={fadeInUp} className={styles.vaultCounter}>
            <div className={styles.vaultLabel}>Total Vault Units Accumulated</div>
            <div className={styles.vaultValue}>{vaultUnits.toLocaleString()}</div>
            {vaultUnits > 0 && (
              <button 
                onClick={resetGame} 
                style={{ marginTop: '1rem', background: 'transparent', border: '1px solid var(--border-light)', color: 'var(--slate)', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer' }}
                title="Restart your session progress"
              >
                Reset Progress
              </button>
            )}
          </motion.div>
        </motion.section>

        <section className={styles.chaptersSection}>
          <div className={styles.chaptersGrid}>
            {chapters.map((chapter, i) => {
              const isComplete = scores[chapter.id] !== null;
              const score = scores[chapter.id];

              return (
                <motion.div 
                  key={chapter.id}
                  className={styles.chapterCard}
                  style={{ borderTop: `4px solid ${chapter.color}` }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className={styles.chapterNum}>Chapter {chapter.num}</div>
                  <h3 className={styles.chapterTitle}>{chapter.title}</h3>
                  <p className={styles.chapterDesc}>{chapter.desc}</p>
                  
                  <div className={styles.chapterAction}>
                    {isComplete ? (
                      <div className={styles.completedBadge}>
                        Completed ✓ (Score: {score})
                      </div>
                    ) : (
                      <Link href={chapter.href} className={styles.playButton}>
                        Play Chapter
                      </Link>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div 
            className={styles.finalScorecard}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h3>Final Scorecard</h3>
            <p>Complete all chapters to unlock your investor profile.</p>
            {allCompleted ? (
              <button className={styles.revealButton}>Reveal Your Investor DNA</button>
            ) : (
              <button className={styles.lockedButton} disabled>Locked (Complete all chapters)</button>
            )}
          </motion.div>
        </section>
      </main>

      <div className={styles.disclaimer}>
        AMFI Registered Mutual Fund Distributor. Mutual Fund investments are subject to market risks, read all scheme related documents carefully.
      </div>
      <Footer />
    </>
  );
}

export default function GamesHub() {
  return <HubContent />;
}
