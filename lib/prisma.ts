import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

/**
 * Capped Prisma singleton. Homelab's shared Postgres (192.168.7.223)
 * runs N projects on a shared connection budget — uncapped pools cause
 * P2037 exhaustion under load. The doghouse pattern caps connection
 * count via the DATABASE_URL query string; we set sensible defaults
 * here too in case the env var omits them.
 *
 * Always assigns the global singleton (not just in dev) so HMR doesn't
 * spawn new clients per file change either.
 */
function buildClient(): PrismaClient {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const prisma: PrismaClient = global.__prisma ?? buildClient();

if (process.env.NODE_ENV !== "production") global.__prisma = prisma;
