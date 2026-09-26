import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaignId');

    let volunteers;
    if (campaignId) {
      volunteers = await sql`
        SELECT v.*, c.title as campaign_title
        FROM volunteers v
        LEFT JOIN campaigns c ON c.id = v.campaign_id
        WHERE v.campaign_id = ${campaignId}
        ORDER BY v.created_at DESC;
      `;
    } else {
      volunteers = await sql`
        SELECT v.*, c.title as campaign_title
        FROM volunteers v
        LEFT JOIN campaigns c ON c.id = v.campaign_id
        ORDER BY v.created_at DESC;
      `;
    }

    return NextResponse.json(volunteers);
  } catch (error: unknown) {
    console.error('Error fetching volunteers:', error);
    const msg = error instanceof Error ? error.message : 'Database error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, skills, availability, campaign_id } = body;

    if (!name || !email || !phone || !skills || !availability) {
      return NextResponse.json({ error: 'Name, email, phone, skills, and availability are required' }, { status: 400 });
    }

    const inserted = await sql`
      INSERT INTO volunteers (name, email, phone, skills, availability, campaign_id, status)
      VALUES (${name}, ${email}, ${phone}, ${skills}, ${availability}, ${campaign_id || null}, 'active')
      RETURNING *;
    `;

    return NextResponse.json(inserted[0], { status: 201 });
  } catch (error: unknown) {
    console.error('Error registering volunteer:', error);
    const msg = error instanceof Error ? error.message : 'Database error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, campaign_id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Volunteer ID required' }, { status: 400 });
    }

    const updated = await sql`
      UPDATE volunteers
      SET
        status = COALESCE(${status || null}, status),
        campaign_id = CASE WHEN ${campaign_id !== undefined} THEN ${campaign_id ? Number(campaign_id) : null} ELSE campaign_id END
      WHERE id = ${id}
      RETURNING *;
    `;

    return NextResponse.json(updated[0]);
  } catch (error: unknown) {
    console.error('Error updating volunteer:', error);
    const msg = error instanceof Error ? error.message : 'Database error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Volunteer ID required' }, { status: 400 });
    }

    await sql`DELETE FROM volunteers WHERE id = ${id};`;

    return NextResponse.json({ success: true, message: 'Volunteer removed successfully' });
  } catch (error: unknown) {
    console.error('Error deleting volunteer:', error);
    const msg = error instanceof Error ? error.message : 'Database error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

