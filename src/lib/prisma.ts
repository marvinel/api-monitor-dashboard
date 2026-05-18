import { PrismaClient } from "@prisma/client";

// This prevents creating multiple Prisma instances in development
// (Next.js hot-reloads and would create a new connection each time)
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
