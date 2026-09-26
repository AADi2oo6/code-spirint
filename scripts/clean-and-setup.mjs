import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL is not set!');
  process.exit(1);
}

const sql = postgres(connectionString, { ssl: 'require' });

async function cleanAndSetup() {
  console.log('Cleaning dummy campaign/donation/volunteer/task data...');

  // Clear tasks, donations, volunteers, campaigns
  await sql`TRUNCATE tasks, donations, volunteers, campaigns RESTART IDENTITY CASCADE;`;

  console.log('Cleared operational tables.');

  // Ensure users table exists with demo account
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'admin',
      phone VARCHAR(50),
      organization VARCHAR(255),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Upsert demo account with full privileges to add/spend data
  await sql`DELETE FROM users;`;

  await sql`
    INSERT INTO users (name, email, password_hash, role, phone, organization)
    VALUES 
      ('Demo User (Director & Donor)', 'demo@reliefgrid.org', 'demo123', 'admin', '+1 555-0100', 'Community Emergency Network'),
      ('NGO Admin', 'admin@reliefgrid.org', 'admin123', 'admin', '+1 555-0101', 'ReliefGrid Headquarters');
  `;

  console.log('Database cleaned and ready! Fresh state with demo dummy account.');
  await sql.end();
}

cleanAndSetup().catch(err => {
  console.error('Error during cleanup:', err);
  process.exit(1);
});
