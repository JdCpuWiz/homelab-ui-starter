import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Liveness + DB probe. Returns 200 with `{ app, db }` both `"ok"` when
 * healthy; 503 if DB is unreachable so external probes (k8s, uptime
 * monitors, ansible's wait_for_connection) can detect partial outages.
 *
 * Pattern lifted from asset-den. Keep this route runtime=nodejs (Edge
 * can't reach Postgres).
 */
export async function GET() {
  let db: "ok" | "down" = "ok";
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    db = "down";
  }
  return NextResponse.json(
    { app: "ok", db, ts: new Date().toISOString() },
    { status: db === "ok" ? 200 : 503 },
  );
}
