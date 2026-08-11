import Link from 'next/link';

export default function GameHeader() {
  return (
    <header style={{
      width: '100%',
      padding: '1.5rem 2rem',
      display: 'flex',
      justifyContent: 'center',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      backgroundColor: 'var(--ink)'
    }}>
      <Link href="/" style={{
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2px'
      }}>
        <span style={{
          fontFamily: 'var(--font-display), serif',
          fontSize: '1.75rem',
          fontWeight: '700',
          color: '#fff',
          lineHeight: '1'
        }}>Knowith</span>
        <span style={{
          fontFamily: 'var(--font-mono), monospace',
          fontSize: '0.55rem',
          letterSpacing: '0.2em',
          color: 'var(--gold, #FFC94A)',
          textTransform: 'uppercase'
        }}>CAPITAL &middot; UDAIPUR</span>
      </Link>
    </header>
  );
}
