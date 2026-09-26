import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { name, email, password, role = 'donor', phone = '', organization = '' } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    // Check if email already registered
    const existing = await sql`
      SELECT id FROM users WHERE LOWER(email) = LOWER(${email.trim()}) LIMIT 1;
    `;

    if (existing.length > 0) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 400 });
    }

    const inserted = await sql`
      INSERT INTO users (name, email, password_hash, role, phone, organization)
      VALUES (${name}, ${email.trim()}, ${password}, ${role}, ${phone}, ${organization})
      RETURNING id, name, email, role, phone, organization, created_at;
    `;

    return NextResponse.json({
      user: inserted[0],
      message: 'Account created successfully',
    }, { status: 201 });
  } catch (error: unknown) {
    console.error('Registration error:', error);
    const msg = error instanceof Error ? error.message : 'Database error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
