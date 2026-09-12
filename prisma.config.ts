// The Prisma CLI (prisma generate / migrate / studio) runs as its own process,
// separate from Next.js — it does NOT automatically read your .env file the
// way `next dev`/`next build` do. We load it ourselves with dotenv below.
import "dotenv/config";
import { defineConfig } from "@prisma/config";

export default defineConfig({
  // Tell Prisma where your schema is located
  schema: "prisma/schema.prisma",

  datasource: {
    // IMPORTANT: don't use the `env()` helper here. `env('DATABASE_URL')`
    // *throws* the moment this config file loads if the variable isn't set —
    // which breaks `prisma generate` (and therefore `pnpm install`/`pnpm
    // postinstall`) on a fresh clone, before you've even created a `.env`
    // file yet. Reading it directly lets `generate` run fine with no DB
    // configured; only `prisma migrate`/`db push` actually need a real URL.
    url: process.env.DATABASE_URL ?? "",
  },
});