'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function DriverPage() {
  const searchParams = useSearchParams();
  const userName = searchParams.get('user');

  const [requests, setRequests] = useState([]);
  const [activePool, setActivePool] = useState<any>(null);

  const fetchRequests = async () => {
    // In a real app we'd fetch pending ride requests
    try {
      const res = await fetch('http://localhost:3001/rides/requests');
      const data = await res.json();
      setRequests(data);
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
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>Driver: {userName} (Bullet)</h1>
      
      {!activePool ? (
        <div style={{ marginTop: '2rem' }}>
          <h2>Pending Pool Requests</h2>
          {requests.length === 0 ? <p>No active requests right now.</p> : null}
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {requests.map((req: any) => (
              <div key={req.id} style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
                <p><strong>{req.passenger?.name}</strong> wants to go from {req.pickup} to {req.destination}</p>
                <p>Seats needed: {req.seats}</p>
                <button style={{ padding: '0.5rem 1rem', background: '#22c55e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Accept Request
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #22c55e', borderRadius: '8px' }}>
          <h2>Active Pool - Status: {activePool.status}</h2>
          <p>Passengers: {activePool.requests?.map((r: any) => r.passenger?.name).join(', ')}</p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button style={{ padding: '0.5rem 1rem', background: '#eab308', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Mark Arrived</button>
            <button style={{ padding: '0.5rem 1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Start Trip</button>
            <button style={{ padding: '0.5rem 1rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Complete Trip</button>
          </div>
        </div>
      )}
    </div>
  );
}
