'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DriverPage() {
  const searchParams = useSearchParams();
  const userName = searchParams.get('user');

  const [requests, setRequests] = useState([]);
  const [activePool, setActivePool] = useState<any>(null);

  const fetchRequests = async () => {
    try {
      const res = await fetch('http://localhost:3001/rides/requests');
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error(err);
    }
  };

  const acceptRequest = async (requestId: string) => {
    try {
      const res = await fetch('http://localhost:3001/rides/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          driverName: userName,
          requestId
        })
      });
      const pool = await res.json();
      if (res.ok) {
        setActivePool(pool);
        fetchRequests();
      } else {
        alert(pool.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (status: string) => {
    try {
      const res = await fetch(`http://localhost:3001/pools/${activePool.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const pool = await res.json();
      if (res.ok) {
        setActivePool(pool);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <nav className="nav-bar">
        <Link href="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>← Back to Home</Link>
        <span>Driver Profile: <strong style={{ color: '#10b981' }}>{userName} (Bullet)</strong></span>
      </nav>

      <main className="layout-container">
        {!activePool || activePool.status === 'COMPLETED' ? (
          <div>
            <h2 style={{ marginBottom: '2rem' }}>Available Requests</h2>
            {requests.length === 0 ? (
              <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <p style={{ color: '#94a3b8', fontSize: '1.25rem' }}>No active requests right now. Waiting for passengers...</p>
              </div>
            ) : (
              <div className="grid">
                {requests.map((req: any) => (
                  <div key={req.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="status-badge">REQUESTED</span>
                      <strong>{req.seats} Seat(s)</strong>
                    </div>
                    <div>
                      <p style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}><strong>{req.passenger?.name}</strong></p>
                      <p style={{ color: '#94a3b8' }}>{req.pickup} → {req.destination}</p>
                    </div>
                    <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.1rem' }}>
                      {(req.fare / 100).toFixed(2)} BDT
                    </div>
                    <button onClick={() => acceptRequest(req.id)} className="btn btn-secondary" style={{ marginTop: '0.5rem' }}>
                      Accept Pool
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="glass-card" style={{ border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ margin: 0 }}>Active Pool</h2>
              <span className="status-badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
                {activePool.status}
              </span>
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>Passengers onboard:</p>
              {activePool.requests?.map((r: any) => (
                <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '0.5rem' }}>
                  <span>{r.passenger?.name} ({r.seats} seats)</span>
                  <span>{r.pickup} → {r.destination}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              {activePool.status === 'MATCHED' && (
                <button onClick={() => updateStatus('DRIVER_ARRIVED')} className="btn btn-accent" style={{ flex: 1 }}>Mark Arrived</button>
              )}
              {activePool.status === 'DRIVER_ARRIVED' && (
                <button onClick={() => updateStatus('STARTED')} className="btn btn-primary" style={{ flex: 1 }}>Start Trip</button>
              )}
              {activePool.status === 'STARTED' && (
                <button onClick={() => updateStatus('COMPLETED')} className="btn btn-secondary" style={{ flex: 1 }}>Complete Trip</button>
              )}
            </div>

            {activePool.status !== 'COMPLETED' && (
              <div style={{ marginTop: '3rem', borderTop: '1px solid var(--glass-border)', paddingTop: '2rem' }}>
                <h3>Add to Pool</h3>
                <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>You can still accept matching requests if you have seats left.</p>
                <div className="grid">
                  {requests.filter((r: any) => r.id !== activePool.id).map((req: any) => (
                    <div key={req.id} className="glass-card" style={{ padding: '1rem' }}>
                      <p><strong>{req.passenger?.name}</strong> • {req.seats} seat(s)</p>
                      <button onClick={() => acceptRequest(req.id)} className="btn btn-secondary" style={{ width: '100%', padding: '0.5rem', marginTop: '1rem' }}>
                        Accept & Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
