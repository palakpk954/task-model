import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing old data...');
  await prisma.rideRequest.deleteMany();
  await prisma.pool.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding initial data...');
  
  // Create Driver
  const jashim = await prisma.user.create({
    data: {
      name: 'Jashim',
      role: 'DRIVER',
      vehicles: {
        create: {
          name: 'Bullet',
          capacity: 3
        }
      }
    }
  });

  // Create Passengers
  const nusrat = await prisma.user.create({
    data: {
      name: 'Nusrat',
      role: 'PASSENGER'
    }
  });

  const rafiq = await prisma.user.create({
    data: {
      name: 'Rafiq',
      role: 'PASSENGER'
    }
  });

  const shirin = await prisma.user.create({
    data: {
      name: 'Shirin',
      role: 'PASSENGER'
    }
  });

  console.log('Database seeded successfully!');
  console.log('Test Users:');
  console.log(`Driver - Jashim (ID: ${jashim.id})`);
  console.log(`Passenger - Nusrat (ID: ${nusrat.id})`);
  console.log(`Passenger - Rafiq (ID: ${rafiq.id})`);
  console.log(`Passenger - Shirin (ID: ${shirin.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
