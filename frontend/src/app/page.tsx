import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Dhaka Tesla Pool</h1>
      <p style={{ marginBottom: '2rem' }}>Share a seat. Split the fare. Survive Dhaka traffic.</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h2>Passenger Login</h2>
          <p>Login as one of the seed passengers.</p>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <Link href="/passenger?user=Nusrat" style={{ padding: '0.5rem 1rem', background: '#0070f3', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>Login as Nusrat</Link>
            <Link href="/passenger?user=Rafiq" style={{ padding: '0.5rem 1rem', background: '#0070f3', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>Login as Rafiq</Link>
            <Link href="/passenger?user=Shirin" style={{ padding: '0.5rem 1rem', background: '#0070f3', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>Login as Shirin</Link>
          </div>
        </div>

        <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h2>Driver Login</h2>
          <p>Login as Jashim with Bullet (Tesla).</p>
          <Link href="/driver?user=Jashim" style={{ display: 'inline-block', padding: '0.5rem 1rem', background: '#22c55e', color: 'white', textDecoration: 'none', borderRadius: '4px', marginTop: '1rem' }}>Login as Jashim</Link>
        </div>
      </div>
    </main>
  );
}
