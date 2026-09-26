import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  try {
    const result = await sql`
      SELECT 
        current_database() as database_name,
        current_user as db_user,
        version() as pg_version,
        NOW() as server_time;
    `;

    const latencyMs = Date.now() - startTime;

    return NextResponse.json({
      status: 'connected',
      latencyMs,
      info: result[0],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown database error';
    return NextResponse.json(
      {
        status: 'error',
        error: message,
      },
      { status: 500 }
    );
  }
}
