import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const donations = await sql`
      SELECT 
        d.transaction_id,
        d.donor_name,
        d.donor_email,
        d.amount,
        d.payment_method,
        d.is_anonymous,
        d.message,
        d.created_at,
        c.title as campaign_title
      FROM donations d
      JOIN campaigns c ON c.id = d.campaign_id
      ORDER BY d.created_at DESC;
    `;

    // Build CSV
    const headers = [
      'Transaction ID',
      'Donor Name',
      'Donor Email',
      'Campaign Title',
      'Amount (USD)',
      'Payment Method',
      'Anonymous',
      'Message',
      'Timestamp',
    ];

    const rows = donations.map((d) => [
      `"${d.transaction_id}"`,
      `"${d.is_anonymous ? 'Anonymous Supporter' : d.donor_name.replace(/"/g, '""')}"`,
      `"${d.is_anonymous ? 'hidden' : d.donor_email.replace(/"/g, '""')}"`,
      `"${(d.campaign_title || '').replace(/"/g, '""')}"`,
      Number(d.amount).toFixed(2),
      `"${d.payment_method}"`,
      d.is_anonymous ? 'Yes' : 'No',
      `"${(d.message || '').replace(/"/g, '""')}"`,
      `"${new Date(d.created_at).toISOString()}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="reliefgrid-donations-export.csv"',
      },
    });
  } catch (error: unknown) {
    console.error('CSV export error:', error);
    const msg = error instanceof Error ? error.message : 'Database error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
