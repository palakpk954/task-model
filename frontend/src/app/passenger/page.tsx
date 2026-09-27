'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function PassengerPage() {
  const searchParams = useSearchParams();
  const userName = searchParams.get('user');

  const [pickup, setPickup] = useState('Banani');
  const [destination, setDestination] = useState('Mohakhali');
  const [seats, setSeats] = useState(1);
  const [rideStatus, setRideStatus] = useState<any>(null);

  const requestRide = async () => {
    try {
      // In a real app we'd fetch the user ID from the backend based on the name.
      // Assuming we have a /users endpoint, or we just send the name for now.
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
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>Passenger: {userName}</h1>
      
      {!rideStatus ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
          <h2>Request a Ride</h2>
          <label>
            Pickup:
            <select value={pickup} onChange={(e) => setPickup(e.target.value)} style={{ marginLeft: '1rem', padding: '0.5rem' }}>
              <option value="Banani">Banani</option>
              <option value="Gulshan 1">Gulshan 1</option>
              <option value="Mohakhali">Mohakhali</option>
              <option value="Dhanmondi">Dhanmondi</option>
            </select>
          </label>
          <label>
            Destination:
            <select value={destination} onChange={(e) => setDestination(e.target.value)} style={{ marginLeft: '1rem', padding: '0.5rem' }}>
              <option value="Banani">Banani</option>
              <option value="Gulshan 1">Gulshan 1</option>
              <option value="Mohakhali">Mohakhali</option>
              <option value="Dhanmondi">Dhanmondi</option>
            </select>
          </label>
          <label>
            Seats:
            <input type="number" min="1" max="3" value={seats} onChange={(e) => setSeats(Number(e.target.value))} style={{ marginLeft: '1rem', padding: '0.5rem', width: '60px' }} />
          </label>
          
          <button onClick={requestRide} style={{ padding: '0.75rem', background: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '1rem' }}>
            Request Pool
          </button>
        </div>
      ) : (
        <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h2>Ride Status: {rideStatus.status}</h2>
          <p>Pickup: {rideStatus.pickup}</p>
          <p>Destination: {rideStatus.destination}</p>
          <p>Seats Requested: {rideStatus.seats}</p>
          <p>Fare: {(rideStatus.fare / 100).toFixed(2)} BDT</p>
          {/* Add a polling or refresh mechanism here to check status updates */}
        </div>
      )}
    </div>
  );
}
