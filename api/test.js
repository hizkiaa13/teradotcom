const pool = require('./_db.js');

module.exports = async function handler(req, res) {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    res.status(200).json({ 
      ok: true, 
      msg: 'Database connected successfully!',
      time: result.rows[0],
      dbUrl: process.env.DATABASE_URL ? 'SET' : 'NOT SET'
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: err.message,
      stack: err.stack,
      dbUrl: process.env.DATABASE_URL ? 'SET' : 'NOT SET'
    });
  }
};
