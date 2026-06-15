import pool from './_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, password } = req.body;
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM users WHERE email = $1 AND password = $2',
      [email, password]
    );
    if (!result.rows[0]) return res.status(401).json({ error: 'Email atau kata sandi salah' });
    const user = result.rows[0];
    res.status(200).json({ id: user.id, nickname: user.nickname, email: user.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
}
