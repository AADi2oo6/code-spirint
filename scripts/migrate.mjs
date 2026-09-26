import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL is not set!');
  process.exit(1);
}

const sql = postgres(connectionString, { ssl: 'require' });

async function migrate() {
  console.log('Ensuring all tables including users exist in Supabase...');

  // 1. Create users table
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'donor',
      phone VARCHAR(50),
      organization VARCHAR(255),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // 2. Create campaigns table
  await sql`
    CREATE TABLE IF NOT EXISTS campaigns (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      category VARCHAR(100) NOT NULL,
      target_amount NUMERIC(12, 2) NOT NULL,
      raised_amount NUMERIC(12, 2) DEFAULT 0,
      location VARCHAR(255) NOT NULL,
      urgency VARCHAR(50) DEFAULT 'Medium',
      status VARCHAR(50) DEFAULT 'active',
      beneficiaries_count INT DEFAULT 0,
      end_date DATE NOT NULL,
      image_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // 3. Create donations table
  await sql`
    CREATE TABLE IF NOT EXISTS donations (
      id SERIAL PRIMARY KEY,
      campaign_id INT REFERENCES campaigns(id) ON DELETE CASCADE,
      donor_name VARCHAR(255) NOT NULL,
      donor_email VARCHAR(255) NOT NULL,
      amount NUMERIC(12, 2) NOT NULL,
      payment_method VARCHAR(50) NOT NULL,
      message TEXT,
      is_anonymous BOOLEAN DEFAULT FALSE,
      transaction_id VARCHAR(100) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // 4. Create volunteers table
  await sql`
    CREATE TABLE IF NOT EXISTS volunteers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      skills TEXT NOT NULL,
      availability VARCHAR(100) NOT NULL,
      campaign_id INT REFERENCES campaigns(id) ON DELETE SET NULL,
      status VARCHAR(50) DEFAULT 'active',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // 5. Create tasks table
  await sql`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      campaign_id INT REFERENCES campaigns(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      priority VARCHAR(50) DEFAULT 'Medium',
      status VARCHAR(50) DEFAULT 'todo',
      assigned_to INT REFERENCES volunteers(id) ON DELETE SET NULL,
      due_date DATE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Seed default demo users if they don't exist
  const existingUsers = await sql`SELECT COUNT(*)::int as count FROM users`;
  if (existingUsers[0].count === 0) {
    console.log('Seeding demo authentication accounts...');
    await sql`
      INSERT INTO users (name, email, password_hash, role, phone, organization)
      VALUES 
        ('Director Sarah Vance', 'admin@reliefgrid.org', 'admin123', 'admin', '+1 555-0100', 'Global Relief Initiative (NGO)'),
        ('Marcus Vance', 'volunteer@relief.org', 'volunteer123', 'volunteer', '+1 555-0192', 'Emergency Volunteer Corps'),
        ('Elena Jenkins', 'donor@gmail.com', 'donor123', 'donor', '+1 555-0188', 'Community Supporter');
    `;
    console.log('Demo accounts seeded.');
  }

  console.log('Migration finished successfully!');
  await sql.end();
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
