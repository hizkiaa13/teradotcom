const { Pool } = require('pg');

// Gunakan satu pool instance yang di-reuse antar invocations
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 3,
});

module.exports = pool;
