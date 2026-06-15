import pg from 'pg';

const { Pool } = pg;

// Gunakan satu pool instance yang di-reuse antar invocations
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 3,
});

export default pool;
