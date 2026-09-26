import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaignId');

    const tasks = await sql`
      SELECT 
        t.*,
        c.title as campaign_title,
        v.name as volunteer_name,
        v.email as volunteer_email,
        v.phone as volunteer_phone
      FROM tasks t
      LEFT JOIN campaigns c ON c.id = t.campaign_id
      LEFT JOIN volunteers v ON v.id = t.assigned_to
      ${campaignId ? sql`WHERE t.campaign_id = ${campaignId}` : sql``}
      ORDER BY 
        CASE 
          WHEN t.priority = 'Critical' THEN 1 
          WHEN t.priority = 'High' THEN 2 
          WHEN t.priority = 'Medium' THEN 3 
          ELSE 4 
        END,
        t.created_at DESC;
    `;

    return NextResponse.json(tasks);
  } catch (error: unknown) {
    console.error('Error fetching tasks:', error);
    const msg = error instanceof Error ? error.message : 'Database error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { campaign_id, title, description, priority = 'Medium', assigned_to, due_date } = body;

    if (!campaign_id || !title) {
      return NextResponse.json({ error: 'Campaign and task title are required' }, { status: 400 });
    }

    const inserted = await sql`
      INSERT INTO tasks (campaign_id, title, description, priority, status, assigned_to, due_date)
      VALUES (
        ${campaign_id}, 
        ${title}, 
        ${description || ''}, 
        ${priority}, 
        'todo', 
        ${assigned_to || null}, 
        ${due_date || null}
      )
      RETURNING *;
    `;

    return NextResponse.json(inserted[0], { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating task:', error);
    const msg = error instanceof Error ? error.message : 'Database error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, assigned_to } = body;

    if (!id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    if (status && !['todo', 'in_progress', 'completed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    const updated = await sql`
      UPDATE tasks
      SET 
        status = COALESCE(${status || null}, status),
        assigned_to = CASE WHEN ${assigned_to !== undefined} THEN ${assigned_to || null} ELSE assigned_to END
      WHERE id = ${id}
      RETURNING *;
    `;

    return NextResponse.json(updated[0]);
  } catch (error: unknown) {
    console.error('Error updating task:', error);
    const msg = error instanceof Error ? error.message : 'Database error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Task ID required' }, { status: 400 });
    }

    await sql`DELETE FROM tasks WHERE id = ${id};`;

    return NextResponse.json({ success: true, message: 'Task removed successfully' });
  } catch (error: unknown) {
    console.error('Error deleting task:', error);
    const msg = error instanceof Error ? error.message : 'Database error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

