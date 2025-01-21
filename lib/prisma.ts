import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = 
  global.prisma || 
  new PrismaClient({
    log: ['error', 'warn'],
    // Remove the connection pool config since it's not valid here
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;