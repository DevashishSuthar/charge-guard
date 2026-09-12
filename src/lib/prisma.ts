import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

// Prisma 7 removed the built-in query engine connection — every PrismaClient
// now needs an explicit driver adapter. We use Neon's adapter since this
// project is built against Neon Postgres (see README). It talks to Neon
// over HTTP/WebSocket instead of a raw TCP connection, which is what makes
// it safe to use from serverless functions in the first place.
const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL ?? "",
});

// Next.js dev mode hot-reloads modules, which would otherwise create a new
// PrismaClient (and a new connection pool) on every file save. Stashing the
// instance on `globalThis` survives the reload.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}