import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const inserted = await sql`
      INSERT INTO campaigns (
        title, description, category, target_amount, raised_amount, 
        location, urgency, status, beneficiaries_count, end_date, image_url
      ) VALUES (
        'Emergency Flood Relief & Clean Water Mission',
        'Deploying emergency ration kits, water filtration units, and temporary dry shelters for displaced families.',
        'Disaster Relief',
        35000.00,
        0,
        'Eastern River Basin, Sector 4',
        'Critical',
        'active',
        850,
        CURRENT_DATE + INTERVAL '21 days',
        'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80'
      )
      RETURNING *;
    `;

    return NextResponse.json(inserted[0], { status: 201 });
  } catch (error: unknown) {
    console.error('Error inserting sample campaign:', error);
    const msg = error instanceof Error ? error.message : 'Database error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
