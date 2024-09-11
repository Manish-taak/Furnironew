import { PrismaClient } from '@prisma/client';

/**
 * Prisma client instance
 * 
 * We use a global variable to store the PrismaClient instance in development mode
 * to prevent creating multiple instances during hot reloading.
 */
let prisma: PrismaClient;

/**
 * In production, we instantiate PrismaClient normally.
 * In development, we use the global object to persist PrismaClient across hot reloads.
 */

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
} else {
    // Check if there's already a global PrismaClient instance; if not, create it.
    if (!(global as any).prisma) {
        (global as any).prisma = new PrismaClient();
    }
    prisma = (global as any).prisma;
}

// Export the Prisma client to use in the application
export default prisma;
