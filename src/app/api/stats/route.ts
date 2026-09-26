import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [stats] = await sql`
      SELECT 
        COALESCE(SUM(c.raised_amount), 0)::numeric as total_raised,
        COALESCE(SUM(c.target_amount), 0)::numeric as total_target,
        COUNT(c.id)::int as total_campaigns,
        (SELECT COUNT(*)::int FROM volunteers) as total_volunteers,
        (SELECT COUNT(*)::int FROM donations) as total_donations,
        (SELECT COUNT(*)::int FROM tasks WHERE status = 'completed') as completed_tasks,
        (SELECT COUNT(*)::int FROM tasks) as total_tasks
      FROM campaigns c;
    `;

    const recentDonations = await sql`
      SELECT d.*, c.title as campaign_title
      FROM donations d
      JOIN campaigns c ON c.id = d.campaign_id
      ORDER BY d.created_at DESC
      LIMIT 5;
    `;

    const recentVolunteers = await sql`
      SELECT v.*, c.title as campaign_title
      FROM volunteers v
      LEFT JOIN campaigns c ON c.id = v.campaign_id
      ORDER BY v.created_at DESC
      LIMIT 5;
    `;

    return NextResponse.json({
      stats,
      recentDonations,
      recentVolunteers,
    });
  } catch (error: unknown) {
    console.error('Error fetching stats:', error);
    const msg = error instanceof Error ? error.message : 'Database error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
