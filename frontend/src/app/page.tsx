import Link from 'next/link';

export default function Home() {
  return (
    <main className="layout-container">
      <div className="header">
        <h1>Dhaka Tesla Pool</h1>
        <p>Share a seat. Split the fare. Survive Dhaka traffic.</p>
      </div>
      
      <div className="grid">
        <div className="glass-card">
          <h2 style={{ marginBottom: '1rem' }}>Passenger Login</h2>
          <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>Jump in and request a ride as one of our passengers.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link href="/passenger?user=Nusrat" className="btn btn-primary">Login as Nusrat</Link>
            <Link href="/passenger?user=Rafiq" className="btn btn-primary">Login as Rafiq</Link>
            <Link href="/passenger?user=Shirin" className="btn btn-primary">Login as Shirin</Link>
          </div>
        </div>

        <div className="glass-card">
          <h2 style={{ marginBottom: '1rem' }}>Driver Login</h2>
          <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>Hit the road with Bullet and start accepting pools.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link href="/driver?user=Jashim" className="btn btn-secondary">Login as Jashim (Bullet)</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
