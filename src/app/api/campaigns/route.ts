import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const urgency = searchParams.get('urgency');
    const search = searchParams.get('search');

    let query = sql`
      SELECT 
        c.*,
        COUNT(DISTINCT d.id)::int as donation_count,
        COUNT(DISTINCT v.id)::int as volunteer_count,
        COUNT(DISTINCT t.id)::int as task_count
      FROM campaigns c
      LEFT JOIN donations d ON d.campaign_id = c.id
      LEFT JOIN volunteers v ON v.campaign_id = c.id
      LEFT JOIN tasks t ON t.campaign_id = c.id
      WHERE 1=1
    `;

    // Note: using basic filtering
    const campaigns = await sql`
      SELECT 
        c.id,
        c.title,
        c.description,
        c.category,
        c.target_amount::numeric as target_amount,
        c.raised_amount::numeric as raised_amount,
        c.location,
        c.urgency,
        c.status,
        c.beneficiaries_count,
        c.end_date,
        c.image_url,
        c.created_at,
        COUNT(DISTINCT d.id)::int as donation_count,
        COUNT(DISTINCT v.id)::int as volunteer_count,
        COUNT(DISTINCT t.id)::int as task_count
      FROM campaigns c
      LEFT JOIN donations d ON d.campaign_id = c.id
      LEFT JOIN volunteers v ON v.campaign_id = c.id
      LEFT JOIN tasks t ON t.campaign_id = c.id
      GROUP BY c.id
      ORDER BY 
        CASE WHEN c.urgency = 'Critical' THEN 1 WHEN c.urgency = 'High' THEN 2 ELSE 3 END,
        c.created_at DESC
    `;

    return NextResponse.json(campaigns);
  } catch (error: unknown) {
    console.error('Error fetching campaigns:', error);
    const msg = error instanceof Error ? error.message : 'Database error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      category,
      target_amount,
      location,
      urgency = 'Normal',
      beneficiaries_count = 0,
      end_date,
      image_url,
    } = body;

    if (!title || !description || !category || !target_amount || !location || !end_date) {
      return NextResponse.json({ error: 'Missing required campaign fields' }, { status: 400 });
    }

    const defaultImg =
      image_url ||
      'https://images.unsplash.com/photo-1532629345422-7515f3d16bb7?auto=format&fit=crop&w=800&q=80';

    const inserted = await sql`
      INSERT INTO campaigns (
        title, description, category, target_amount, raised_amount, 
        location, urgency, status, beneficiaries_count, end_date, image_url
      ) VALUES (
        ${title}, ${description}, ${category}, ${target_amount}, 0,
        ${location}, ${urgency}, 'active', ${beneficiaries_count}, ${end_date}, ${defaultImg}
      )
      RETURNING *;
    `;

    return NextResponse.json(inserted[0], { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating campaign:', error);
    const msg = error instanceof Error ? error.message : 'Database error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
