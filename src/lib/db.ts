import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not defined');
}

const globalForDb = globalThis as unknown as {
  sql: postgres.Sql | undefined;
};

export const sql =
  globalForDb.sql ??
  postgres(connectionString, {
    ssl: 'require',
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForDb.sql = sql;
}

export default sql;
