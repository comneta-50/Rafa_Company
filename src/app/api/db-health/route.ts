import { NextResponse, connection } from "next/server";

// GET /api/db-health — checks that the app can reach the Neon database.
export async function GET() {
  // Opt out of prerendering: always query the database at request time.
  await connection();

  try {
    const { sql } = await import("@/lib/db");
    const [row] = await sql`SELECT current_database() AS database, current_user AS role, now() AS server_time`;
    return NextResponse.json({ ok: true, ...row });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
