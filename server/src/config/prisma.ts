// =============================================================
// Prisma Client Singleton
// Ensures a single PrismaClient instance across the application
// =============================================================

import { PrismaClient } from '@prisma/client';

/**
 * Global PrismaClient singleton to prevent multiple instances
 * during development with hot-reloading (tsx watch)
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
