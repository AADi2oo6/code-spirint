import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL is not set!');
  process.exit(1);
}

const sql = postgres(connectionString, { ssl: 'require' });

async function migrate() {
  console.log('Connecting and ensuring database tables exist...');

  // 1. Create campaigns table
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

  // 2. Create donations table
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

  // 3. Create volunteers table
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

  // 4. Create tasks table
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

  console.log('Tables verified.');

  const existing = await sql`SELECT COUNT(*)::int as count FROM campaigns`;
  if (existing[0].count === 0) {
    console.log('Database is empty. Seeding initial campaign and volunteer data...');

    const c1 = await sql`
      INSERT INTO campaigns (title, description, category, target_amount, raised_amount, location, urgency, status, beneficiaries_count, end_date, image_url)
      VALUES (
        'Emergency Flood Relief & Clean Water Mission',
        'Deploying emergency ration kits, high-capacity water purifiers, and temporary shelters for 1,200 affected families across eastern lowlands.',
        'Disaster Relief',
        50000.00,
        36500.00,
        'Sylhet & Assam Basin',
        'Critical',
        'active',
        1200,
        CURRENT_DATE + INTERVAL '14 days',
        'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80'
      ) RETURNING id;
    `;

    const c2 = await sql`
      INSERT INTO campaigns (title, description, category, target_amount, raised_amount, location, urgency, status, beneficiaries_count, end_date, image_url)
      VALUES (
        'Winter Thermal Gear & Blanket Drive 2026',
        'Distributing insulated sleeping bags, heavy woolen blankets, and thermal clothing to homeless community members facing sub-zero nights.',
        'Winter Relief',
        18000.00,
        13200.00,
        'Downtown Metropolitan District',
        'High',
        'active',
        850,
        CURRENT_DATE + INTERVAL '21 days',
        'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80'
      ) RETURNING id;
    `;

    const c3 = await sql`
      INSERT INTO campaigns (title, description, category, target_amount, raised_amount, location, urgency, status, beneficiaries_count, end_date, image_url)
      VALUES (
        'Community Kitchen & Food Bank Replenishment',
        'Sponsoring weekly hot meals, non-perishable grain supplies, and protein supplements for underfunded urban community pantries.',
        'Food & Hunger',
        25000.00,
        19800.00,
        'Westside Community Center',
        'Normal',
        'active',
        2400,
        CURRENT_DATE + INTERVAL '30 days',
        'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80'
      ) RETURNING id;
    `;

    const c4 = await sql`
      INSERT INTO campaigns (title, description, category, target_amount, raised_amount, location, urgency, status, beneficiaries_count, end_date, image_url)
      VALUES (
        'Rural Primary School Tech & Book Kits',
        'Furnishing 6 rural government schools with digital learning tablets, textbooks, notebooks, and solar-powered classroom lamps.',
        'Education',
        15000.00,
        6400.00,
        'Pine Ridge District',
        'Normal',
        'active',
        420,
        CURRENT_DATE + INTERVAL '45 days',
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80'
      ) RETURNING id;
    `;

    const campId1 = c1[0].id;
    const campId2 = c2[0].id;
    const campId3 = c3[0].id;

    // Seed Volunteers
    const v1 = await sql`
      INSERT INTO volunteers (name, email, phone, skills, availability, campaign_id, status)
      VALUES ('Marcus Vance', 'marcus.v@relief.org', '+1 555-0192', 'First Aid, Logistics, Heavy Driving', 'Weekends & Evenings', ${campId1}, 'active')
      RETURNING id;
    `;
    const v2 = await sql`
      INSERT INTO volunteers (name, email, phone, skills, availability, campaign_id, status)
      VALUES ('Dr. Aisha Patel', 'aisha.p@medcare.org', '+1 555-0144', 'Triage, Paramedic, Pediatric Care', 'Full Time (Emergency)', ${campId1}, 'active')
      RETURNING id;
    `;
    const v3 = await sql`
      INSERT INTO volunteers (name, email, phone, skills, availability, campaign_id, status)
      VALUES ('Elena Rostova', 'elena.r@actionaid.org', '+1 555-0183', 'Warehouse Sorting, Inventory, Community Outreach', 'Weekdays', ${campId2}, 'active')
      RETURNING id;
    `;
    const v4 = await sql`
      INSERT INTO volunteers (name, email, phone, skills, availability, campaign_id, status)
      VALUES ('David Chen', 'david.c@volunteers.net', '+1 555-0177', 'Food Safety, Cooking, Driving Van', 'Flexible', ${campId3}, 'active')
      RETURNING id;
    `;

    // Seed Donations
    await sql`
      INSERT INTO donations (campaign_id, donor_name, donor_email, amount, payment_method, message, is_anonymous, transaction_id)
      VALUES 
        (${campId1}, 'Sarah Jenkins', 'sarah.j@gmail.com', 2500.00, 'Card', 'Sending prayers for the flood recovery team!', false, 'TXN-984210'),
        (${campId1}, 'Anonymous Supporter', 'anon@secure.org', 5000.00, 'UPI', 'Keep up the crucial work on the ground.', true, 'TXN-984211'),
        (${campId2}, 'Apex Technologies Corp', 'csr@apextech.io', 7500.00, 'Wire', 'Corporate match for winter gear distribution.', false, 'TXN-984212'),
        (${campId3}, 'Community Bakery Co.', 'info@bakeryco.org', 1200.00, 'Card', 'Happy to support our local soup kitchen.', false, 'TXN-984213');
    `;

    // Seed Tasks
    await sql`
      INSERT INTO tasks (campaign_id, title, description, priority, status, assigned_to, due_date)
      VALUES
        (${campId1}, 'Dispatch 400 Water Filtration Kits', 'Coordinate with local fleet to transport water purifiers to Zone B depot.', 'High', 'in_progress', ${v1[0].id}, CURRENT_DATE + INTERVAL '2 days'),
        (${campId1}, 'Establish Medical Triage Tent', 'Set up temporary first-aid post next to shelter sector 4.', 'Critical', 'todo', ${v2[0].id}, CURRENT_DATE + INTERVAL '1 day'),
        (${campId2}, 'Inspect & Package 500 Sleeping Bags', 'Sort donations by temperature rating and pack waterproof bundles.', 'Medium', 'completed', ${v3[0].id}, CURRENT_DATE - INTERVAL '1 day'),
        (${campId3}, 'Weekly Produce Pickup from Farmers Market', 'Collect surplus vegetables and grains with refrigerated van.', 'High', 'todo', ${v4[0].id}, CURRENT_DATE + INTERVAL '3 days');
    `;

    console.log('Seeding completed successfully!');
  } else {
    console.log(`Database already has ${existing[0].count} campaigns. No seed needed.`);
  }

  await sql.end();
  console.log('Migration script finished cleanly.');
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
