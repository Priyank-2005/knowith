'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SITE_LINKS, safeNext } from '@/lib/config/site';
import { signOut, useSession } from '@/lib/auth/useSession';
import styles from './page.module.css';

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <header className={styles.header}>
          <div className="eyebrow">Client Access</div>
          <h1 className={styles.title}>Sign in to Knowith Capital</h1>
          <p className={styles.subtitle}>
            Choose how you work with us. Investments are held and transacted on FundzBazar; our research tools are open to registered investors.
          </p>
        </header>

        <div className={styles.grid}>
          <section className={styles.card}>
            <div className={styles.cardNo}>01</div>
            <h2>Existing client</h2>
            <p>View your portfolio, place transactions and download statements on your FundzBazar account.</p>
            <div className={styles.cardActions}>
              <a href={SITE_LINKS.fundzbazarWeb} target="_blank" rel="noopener noreferrer" className={styles.btnPrimary}>
                Client login on FundzBazar →
              </a>
              <div className={styles.appRow}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={SITE_LINKS.fundzbazarAppQr} alt="QR code to download the FundzBazar app" width={84} height={84} className={styles.qr} />
                <div>
                  <div className={styles.appTitle}>On your phone?</div>
                  <a href={SITE_LINKS.fundzbazarApp} target="_blank" rel="noopener noreferrer" className={styles.textLink}>
                    Get the FundzBazar app →
                  </a>
                  <div className={styles.qrHint}>or scan the code</div>
                </div>
              </div>
              {SITE_LINKS.partnerLogin && (
                <a href={SITE_LINKS.partnerLogin} target="_blank" rel="noopener noreferrer" className={styles.textLink}>
                  Registered through {SITE_LINKS.partnerName}? Sign in there →
                </a>
              )}
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.cardNo}>02</div>
            <h2>New to Knowith?</h2>
            <p>Open your free online mutual fund account in a few minutes — KYC, nominee and bank details, all online.</p>
            <div className={styles.cardActions}>
              <a href={SITE_LINKS.fundzbazarWeb} target="_blank" rel="noopener noreferrer" className={styles.btnPrimary}>
                Open a free account →
              </a>
              <Link href="/contact" className={styles.textLink}>Prefer to talk first? Book a consultation →</Link>
            </div>
          </section>

          <section className={`${styles.card} ${styles.cardFeature}`}>
            <div className={styles.cardNo}>03</div>
            <h2>Research &amp; tools</h2>
            <p>Registered investors can sign in with a one-time code sent to their email to use our AI planning tools and member research.</p>
            <Suspense fallback={null}>
              <OtpSignIn />
            </Suspense>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

function OtpSignIn() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get('next'), '/advisor');
  const { loading, member } = useSession();

  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const post = async (url: string, body: object) => {
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || 'Something went wrong. Please try again.');
    return json;
  };

  const requestCode = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await post('/api/v1/auth/otp/request', { email });
      setStep('code');
      setNotice(`We've emailed a 6-digit code to ${email.trim()}. It expires in 10 minutes.`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await post('/api/v1/auth/otp/verify', { email, code });
      router.push(next);
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  };

  if (loading) return <div className={styles.muted}>Checking your session…</div>;

  if (member) {
    return (
      <div className={styles.signedIn}>
        <p>Signed in as <strong>{member.name || member.email}</strong>.</p>
        <div className={styles.row}>
          <Link href={next} className={styles.btnPrimary}>Open tools →</Link>
          <button type="button" className={styles.btnGhost} onClick={async () => { await signOut('member'); router.refresh(); location.reload(); }}>
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return step === 'email' ? (
    <form onSubmit={requestCode} className={styles.form}>
      <label htmlFor="otp-email">Email registered with us</label>
      <input id="otp-email" type="email" autoComplete="email" required value={email}
        onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className={styles.input} />
      {error && <p className={styles.error} role="alert">{error}</p>}
      <button type="submit" disabled={busy} className={styles.btnPrimary}>{busy ? 'Sending…' : 'Email me a code'}</button>
    </form>
  ) : (
    <form onSubmit={verifyCode} className={styles.form}>
      {notice && <p className={styles.notice}>{notice}</p>}
      <label htmlFor="otp-code">6-digit code</label>
      <input id="otp-code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9 ]{6,7}" maxLength={7} required autoFocus
        value={code} onChange={e => setCode(e.target.value)} placeholder="••••••" className={`${styles.input} ${styles.codeInput}`} />
      {error && <p className={styles.error} role="alert">{error}</p>}
      <button type="submit" disabled={busy} className={styles.btnPrimary}>{busy ? 'Verifying…' : 'Sign in'}</button>
      <div className={styles.row}>
        <button type="button" className={styles.linkBtn} onClick={() => { setStep('email'); setCode(''); setError(null); }}>Use a different email</button>
        <button type="button" className={styles.linkBtn} disabled={busy} onClick={() => requestCode()}>Resend code</button>
      </div>
    </form>
  );
}
