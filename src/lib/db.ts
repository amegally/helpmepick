import { PrismaClient } from '@prisma/client';

// This is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
let prismaGlobal = global as typeof global & {
  prisma?: PrismaClient;
};

export const prisma = prismaGlobal.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  prismaGlobal.prisma = prisma;
} 