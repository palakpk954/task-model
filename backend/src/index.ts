import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from './prisma';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Users
app.get('/users', async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    include: {
      vehicles: true
    }
  });
  res.json(users);
});

// Create a ride request
app.post('/rides/request', async (req: Request, res: Response) => {
  try {
    const { passengerName, pickup, destination, seats } = req.body;
    
    const passenger = await prisma.user.findFirst({ where: { name: passengerName, role: 'PASSENGER' } });
    if (!passenger) {
      return res.status(404).json({ error: 'Passenger not found' });
    }

    const baseFare = 5000;
    const distanceCharge = 10000;
    const poolDiscount = seats === 1 ? 2000 : 0;
    const fare = baseFare + distanceCharge - poolDiscount;

    const rideRequest = await prisma.rideRequest.create({
      data: {
        passengerId: passenger.id,
        pickup,
        destination,
        seats,
        status: 'REQUESTED',
        fare
      }
    });

    res.status(201).json(rideRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get pending ride requests
app.get('/rides/requests', async (req: Request, res: Response) => {
  try {
    const requests = await prisma.rideRequest.findMany({
      where: { status: 'REQUESTED' },
      include: { passenger: true }
    });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Driver accepts a ride request
app.post('/rides/accept', async (req: Request, res: Response) => {
  try {
    const { driverName, requestId } = req.body;

    const driver = await prisma.user.findFirst({
      where: { name: driverName, role: 'DRIVER' },
      include: { vehicles: true }
    });

    if (!driver || driver.vehicles.length === 0) {
      return res.status(404).json({ error: 'Driver or vehicle not found' });
    }
    const vehicle = driver.vehicles[0];

    const rideRequest = await prisma.rideRequest.findUnique({ where: { id: requestId } });
    if (!rideRequest || rideRequest.status !== 'REQUESTED') {
      return res.status(400).json({ error: 'Invalid or already accepted request' });
    }

    // Use a transaction to ensure concurrency safety
    const result = await prisma.$transaction(async (tx) => {
      // Find active pool
      let activePool = await tx.pool.findFirst({
        where: {
          driverId: driver.id,
          status: { in: ['MATCHED', 'DRIVER_ARRIVED', 'STARTED'] }
        },
        include: { requests: true }
      });

      let currentSeats = 0;
      if (activePool) {
        currentSeats = activePool.requests.reduce((sum, req) => sum + req.seats, 0);
      }

      if (currentSeats + rideRequest.seats > vehicle.capacity) {
        throw new Error('Vehicle capacity exceeded');
      }

      if (!activePool) {
        activePool = await tx.pool.create({
          data: {
            driverId: driver.id,
            vehicleId: vehicle.id,
            status: 'MATCHED'
          },
          include: { requests: true }
        });
      }

      await tx.rideRequest.update({
        where: { id: requestId },
        data: {
          status: 'MATCHED',
          poolId: activePool.id
        }
      });

      return activePool;
    });

    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Update pool status
app.post('/pools/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // DRIVER_ARRIVED, STARTED, COMPLETED, CANCELLED

    const updatedPool = await prisma.$transaction(async (tx) => {
      const pool = await tx.pool.update({
        where: { id },
        data: { status }
      });

      await tx.rideRequest.updateMany({
        where: { poolId: id },
        data: { status }
      });

      return pool;
    });

    res.json(updatedPool);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Backend is running at http://localhost:${port}`);
});
