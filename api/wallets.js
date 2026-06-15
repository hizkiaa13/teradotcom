import pool from './_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const client = await pool.connect();
  try {
    if (req.method === 'GET') {
      const { userId } = req.query;
      const result = await client.query(
        `SELECT id, name, type, balance, iconname AS "iconName", color, userid AS "userId" 
         FROM wallets WHERE userid = $1`,
        [userId]
      );
      return res.status(200).json(result.rows);

    } else if (req.method === 'POST') {
      const { name, type, balance, iconName, color, userId } = req.body;
      const result = await client.query(
        `INSERT INTO wallets (name, type, balance, iconname, color, userid) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [name, type, balance || 0, iconName, color, userId]
      );
      return res.status(200).json({
        id: result.rows[0].id, name, type,
        balance: balance || 0, iconName, color, userId
      });

    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
}
