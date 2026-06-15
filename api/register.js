import pool from './_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { nickname, email, password } = req.body;
  const client = await pool.connect();
  try {
    const result = await client.query(
      'INSERT INTO users (nickname, email, password) VALUES ($1, $2, $3) RETURNING id',
      [nickname, email, password]
    );
    const userId = result.rows[0].id;

    const defaultWallets = [
      ['BCA', 'Bank', 0, 'CreditCard', '#0f172a', userId],
      ['Tunai', 'Cash', 0, 'Banknote', '#10b981', userId],
      ['GoPay', 'E-Wallet', 0, 'Smartphone', '#3b82f6', userId]
    ];
    for (const w of defaultWallets) {
      await client.query(
        'INSERT INTO wallets (name, type, balance, iconname, color, userid) VALUES ($1, $2, $3, $4, $5, $6)',
        w
      );
    }

    res.status(200).json({ id: userId, nickname, email });
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ error: 'Email sudah terdaftar' });
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
}
