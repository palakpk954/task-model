# Dhaka Tesla Pool MVP

Share a seat. Split the fare. Survive Dhaka traffic.

## Overview
This is a full-stack Minimum Viable Product (MVP) for Dhaka Tesla Pool. It allows passengers to request rides, which a driver (owning a Tesla with fixed capacity) can accept. Passengers can share the same Tesla, forming a "Pool" as long as the capacity is not exceeded. Each passenger receives an individual fare based on distance and pool sharing discount.

## Tech Stack & Justification

- **Frontend:** Next.js (App Router), React. Selected because it provides excellent routing and component structuring out-of-the-box. CSS Modules used for simplicity (per requirements avoiding Tailwind unless requested).
- **Backend:** Node.js with Express and TypeScript. Selected for its lightweight nature, perfect for a fast MVP, and straightforward request/response handling.
- **Database:** Prisma ORM with SQLite for rapid local development, but architected to seamlessly transition to PostgreSQL for deployment (the provided `docker-compose.yml` runs PostgreSQL). Relational data is necessary to enforce constraints (foreign keys for users/vehicles/pools).
- **Docker:** `docker-compose.yml` configures the frontend app, backend API, and Postgres DB. 

*Why this stack?* For a ride-pooling MVP, a robust relational schema is critical to enforce seat capacity accurately. Prisma gives excellent type-safety with TypeScript, preventing runtime errors. Express is lean and un-opinionated, ideal for setting up basic routing quickly.

## Project Structure
- `/frontend` - Next.js React application (Ports 3000)
- `/backend` - Express + Prisma Node.js application (Ports 3001)

## Setup & Running

### Environment Variables
Copy `.env.example` to `.env` in the root folder.

### Running via Docker
Run the entire stack using docker-compose:
```bash
docker-compose up -build -d
```
*Note: Due to environment limitations, SQLite is configured by default for dev. To switch to PostgreSQL, update `backend/prisma/schema.prisma` datasource to use the `postgresql` provider and env("DATABASE_URL").*

### Running Locally (Without Docker)
1. **Backend:**
```bash
cd backend
npm install
npm run start:migrate
npm run seed
npm run dev
```

2. **Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Features Implemented
- Passenger can request a ride (pick up, destination, seats).
- Driver can see requests and accept them, enforcing capacity limits.
- State transitions: `REQUESTED` -> `MATCHED` -> `DRIVER_ARRIVED` -> `STARTED` -> `COMPLETED`.
- Fare calculation based on distance and pooling discount. Stored in poysha (integers) to prevent float inaccuracies.

## Concurrency Handling
*Problem:* Two passengers trying to claim the last seat simultaneously.
*Current Solution:* The backend uses a database transaction (`prisma.$transaction`). While this provides atomicity, at high scale, concurrent reads without explicit locks might cause a race condition.
*Scale-up Solution:* For millions of users, we would implement:
1. Row-level locking (e.g., `SELECT ... FOR UPDATE` on the Pool or Vehicle row) to prevent concurrent writes on the same Pool.
2. A distributed lock using Redis (e.g., Redlock) per vehicle.
3. Event queues (Kafka/RabbitMQ) to serialize matching requests.

## AI Usage
AI (Antigravity Assistant) was utilized to rapidly scaffold the Next.js and Express architecture, define the Prisma schema, and write boilerplate endpoint routing. 
- *Accepted Suggestion:* Storing money in integer (poysha) instead of decimal to prevent floating-point calculation errors.
- *Rejected Suggestion:* Suggestion to use TailwindCSS was rejected to stick closely to the standard CSS requirements unless overridden by user preferences.
