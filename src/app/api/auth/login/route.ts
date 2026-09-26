import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const users = await sql`
      SELECT id, name, email, role, phone, organization, password_hash
      FROM users
      WHERE LOWER(email) = LOWER(${email.trim()})
      LIMIT 1;
    `;

    if (users.length === 0) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const user = users[0];

    // In production we would use bcrypt, here we verify the match
    if (user.password_hash !== password) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const { password_hash, ...safeUser } = user;

    return NextResponse.json({
      user: safeUser,
      message: 'Login successful',
    });
  } catch (error: unknown) {
    console.error('Login error:', error);
    const msg = error instanceof Error ? error.message : 'Database error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
