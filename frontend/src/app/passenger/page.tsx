'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PassengerPage() {
  const searchParams = useSearchParams();
  const userName = searchParams.get('user');

  const [pickup, setPickup] = useState('Banani');
  const [destination, setDestination] = useState('Mohakhali');
  const [seats, setSeats] = useState(1);
  const [rideStatus, setRideStatus] = useState<any>(null);

  const requestRide = async () => {
    try {
      const res = await fetch('http://localhost:3001/rides/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passengerName: userName,
          pickup,
          destination,
          seats,
        })
      });
      const data = await res.json();
      setRideStatus(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <nav className="nav-bar">
        <Link href="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>← Back to Home</Link>
        <span>Passenger Profile: <strong>{userName}</strong></span>
      </nav>

      <main className="layout-container">
        {!rideStatus ? (
          <div className="glass-card" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Where to?</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ color: '#94a3b8' }}>Pickup Location</span>
                <select className="input-field" value={pickup} onChange={(e) => setPickup(e.target.value)}>
                  <option value="Banani">Banani</option>
                  <option value="Gulshan 1">Gulshan 1</option>
                  <option value="Mohakhali">Mohakhali</option>
                  <option value="Dhanmondi">Dhanmondi</option>
                </select>
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ color: '#94a3b8' }}>Destination Location</span>
                <select className="input-field" value={destination} onChange={(e) => setDestination(e.target.value)}>
                  <option value="Banani">Banani</option>
                  <option value="Gulshan 1">Gulshan 1</option>
                  <option value="Mohakhali">Mohakhali</option>
                  <option value="Dhanmondi">Dhanmondi</option>
                </select>
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ color: '#94a3b8' }}>Seats Needed</span>
                <input className="input-field" type="number" min="1" max="3" value={seats} onChange={(e) => setSeats(Number(e.target.value))} />
              </label>
              
              <button onClick={requestRide} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                Request Pool
              </button>
            </div>
          </div>
        ) : (
          <div className="glass-card" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
            <div className="status-badge" style={{ marginBottom: '1rem' }}>{rideStatus.status}</div>
            <h2 style={{ marginBottom: '2rem' }}>Ride Requested!</h2>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <span style={{ color: '#94a3b8' }}>Route</span>
              <strong>{rideStatus.pickup} → {rideStatus.destination}</strong>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <span style={{ color: '#94a3b8' }}>Seats</span>
              <strong>{rideStatus.seats} Reserved</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem' }}>
              <span style={{ color: '#94a3b8' }}>Estimated Fare</span>
              <strong style={{ color: '#10b981', fontSize: '1.25rem' }}>{(rideStatus.fare / 100).toFixed(2)} BDT</strong>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
