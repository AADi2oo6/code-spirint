import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaignId');

    let donations;
    if (campaignId) {
      donations = await sql`
        SELECT d.*, c.title as campaign_title
        FROM donations d
        JOIN campaigns c ON c.id = d.campaign_id
        WHERE d.campaign_id = ${campaignId}
        ORDER BY d.created_at DESC
        LIMIT 50;
      `;
    } else {
      donations = await sql`
        SELECT d.*, c.title as campaign_title
        FROM donations d
        JOIN campaigns c ON c.id = d.campaign_id
        ORDER BY d.created_at DESC
        LIMIT 50;
      `;
    }

    return NextResponse.json(donations);
  } catch (error: unknown) {
    console.error('Error fetching donations:', error);
    const msg = error instanceof Error ? error.message : 'Database error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      campaign_id,
      donor_name,
      donor_email,
      amount,
      payment_method = 'Card',
      message = '',
      is_anonymous = false,
    } = body;

    const parsedAmount = parseFloat(amount);
    if (!campaign_id || !donor_name || !donor_email || isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json({ error: 'Valid campaign, donor details, and positive amount are required' }, { status: 400 });
    }

    // Generate reference code
    const txnId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;

    // Atomic transaction: Insert donation & update campaign raised_amount
    const result = await sql.begin(async (tx) => {
      const [donation] = await tx`
        INSERT INTO donations (
          campaign_id, donor_name, donor_email, amount, 
          payment_method, message, is_anonymous, transaction_id
        ) VALUES (
          ${campaign_id}, ${donor_name}, ${donor_email}, ${parsedAmount}, 
          ${payment_method}, ${message}, ${is_anonymous}, ${txnId}
        )
        RETURNING *;
      `;

      await tx`
        UPDATE campaigns
        SET raised_amount = raised_amount + ${parsedAmount}
        WHERE id = ${campaign_id};
      `;

      return donation;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: unknown) {
    console.error('Error recording donation:', error);
    const msg = error instanceof Error ? error.message : 'Database error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
