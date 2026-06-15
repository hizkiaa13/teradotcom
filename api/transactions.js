import pool from './_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const client = await pool.connect();
  try {
    if (req.method === 'GET') {
      const { userId } = req.query;
      const result = await client.query(
        `SELECT id, type, amount, category, date, note, 
                walletid AS "walletId", userid AS "userId"
         FROM transactions WHERE userid = $1 ORDER BY id DESC`,
        [userId]
      );
      return res.status(200).json(result.rows);

    } else if (req.method === 'POST') {
      const { type, amount, category, date, note, walletId, userId } = req.body;

      if (!type || !amount || !category || !date || !walletId || !userId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Insert transaksi
      const txResult = await client.query(
        `INSERT INTO transactions (type, amount, category, date, note, walletid, userid)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        [type, amount, category, date, note, walletId, userId]
      );
      const newTxId = txResult.rows[0].id;

      // Update saldo dompet
      const walletResult = await client.query(
        'SELECT balance FROM wallets WHERE id = $1', [walletId]
      );

      if (!walletResult.rows[0]) {
        return res.status(200).json({
          success: true,
          transaction: { id: newTxId, type, amount, category, date, note, walletId, userId }
        });
      }

      const currentBalance = walletResult.rows[0].balance;
      const newBalance = type === 'income' ? currentBalance + amount : currentBalance - amount;

      await client.query('UPDATE wallets SET balance = $1 WHERE id = $2', [newBalance, walletId]);

      return res.status(200).json({
        success: true,
        transaction: { id: newTxId, type, amount, category, date, note, walletId, userId },
        newWalletBalance: newBalance
      });

    } else if (req.method === 'DELETE') {
      const { userId } = req.query;
      await client.query('DELETE FROM transactions WHERE userid = $1', [userId]);
      await client.query('UPDATE wallets SET balance = 0 WHERE userid = $1', [userId]);
      return res.status(200).json({ success: true, message: 'Semua data transaksi telah dihapus dan saldo direset ke 0.' });

    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
}
