import { neon } from "@neondatabase/serverless";

// Server-side only. Never import this file from a "use client" component:
// DATABASE_URL contains the database password.
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is not set. Add it to .env.local (local) or Vercel Environment Variables (deploy)."
  );
}

export const sql = neon(databaseUrl);
