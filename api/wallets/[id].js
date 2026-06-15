import pool from '../_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' });

  const { id } = req.query;
  const client = await pool.connect();
  try {
    await client.query('DELETE FROM transactions WHERE walletid = $1', [id]);
    const result = await client.query('DELETE FROM wallets WHERE id = $1', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Wallet not found' });
    res.status(200).json({ success: true, message: 'Wallet deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
}
