import Link from 'next/link';
import Image from 'next/image';

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
      <Link href="/" aria-label="Knowith Capital — home" style={{ display: 'flex' }}>
        <Image src="/images/brand/logo-horizontal-dark.png" alt="Knowith Capital" width={226} height={40} style={{ height: '40px', width: 'auto' }} priority />
      </Link>
    </header>
  );
}
