import express from 'express';
import cors from 'cors';
import db from './db.js';

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

const PORT = process.env.PORT || 3001;

// --- API AUTH ---

// Register user
app.post('/api/register', (req, res) => {
  const { nickname, email, password } = req.body;
  const sql = `INSERT INTO users (nickname, email, password) VALUES (?, ?, ?)`;
  
  db.run(sql, [nickname, email, password], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed') || err.code === '23505' || err.message.includes('duplicate key')) {
        return res.status(400).json({ error: 'Email sudah terdaftar' });
      }
      return res.status(500).json({ error: err.message });
    }
    
    const userId = this.lastID;
    
    // Create default wallets for the new user
    const defaultWallets = [
      ['BCA', 'Bank', 0, 'CreditCard', '#0f172a', userId],
      ['Tunai', 'Cash', 0, 'Banknote', '#10b981', userId],
      ['GoPay', 'E-Wallet', 0, 'Smartphone', '#3b82f6', userId]
    ];
    
    const stmt = db.prepare(`INSERT INTO wallets (name, type, balance, iconName, color, userId) VALUES (?, ?, ?, ?, ?, ?)`);
    defaultWallets.forEach(w => stmt.run(w));
    stmt.finalize();

    res.json({ id: userId, nickname, email });
  });
});

// Login user
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const sql = `SELECT * FROM users WHERE email = ? AND password = ?`;
  
  db.get(sql, [email, password], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(401).json({ error: 'Email atau kata sandi salah' });
    }
    res.json({ id: row.id, nickname: row.nickname, email: row.email });
  });
});

// --- API WALLETS ---

// Get all wallets for a user
app.get('/api/wallets', (req, res) => {
  const userId = req.query.userId;
  db.all('SELECT * FROM wallets WHERE userId = ?', [userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Create wallet
app.post('/api/wallets', (req, res) => {
  const { name, type, balance, iconName, color, userId } = req.body;
  const sql = `INSERT INTO wallets (name, type, balance, iconName, color, userId) VALUES (?, ?, ?, ?, ?, ?)`;
  
  db.run(sql, [name, type, balance || 0, iconName, color, userId], function(err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ id: this.lastID, name, type, balance, iconName, color, userId });
  });
});

// Delete wallet
app.delete('/api/wallets/:id', (req, res) => {
  const { id } = req.params;
  db.serialize(() => {
    db.run('DELETE FROM transactions WHERE walletId = ?', [id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      
      db.run('DELETE FROM wallets WHERE id = ?', [id], function(err2) {
        if (err2) return res.status(500).json({ error: err2.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Wallet not found' });
        res.json({ success: true, message: 'Wallet deleted successfully' });
      });
    });
  });
});


// --- API TRANSACTIONS ---

// Get all transactions for a user
app.get('/api/transactions', (req, res) => {
  const userId = req.query.userId;
  db.all('SELECT * FROM transactions WHERE userId = ? ORDER BY id DESC', [userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Create transaction and update wallet balance
app.post('/api/transactions', (req, res) => {
  const { type, amount, category, date, note, walletId, userId } = req.body;
  
  // Basic validation
  if (!type || !amount || !category || !date || !walletId || !userId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.serialize(() => {
    // 1. Insert transaction
    const sqlInsert = `INSERT INTO transactions (type, amount, category, date, note, walletId, userId) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.run(sqlInsert, [type, amount, category, date, note, walletId, userId], function(err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      
      const newTransaction = { id: this.lastID, type, amount, category, date, note, walletId, userId };
      
      // 2. Update wallet balance
      db.get('SELECT balance FROM wallets WHERE id = ?', [walletId], (err, row) => {
        if (err || !row) return res.json({ message: 'Transaction saved, but failed to update wallet', transaction: newTransaction });
        
        const newBalance = type === 'income' ? row.balance + amount : row.balance - amount;
        
        db.run('UPDATE wallets SET balance = ? WHERE id = ?', [newBalance, walletId], (updateErr) => {
          if (updateErr) {
            return res.status(500).json({ error: updateErr.message });
          }
          res.json({ success: true, transaction: newTransaction, newWalletBalance: newBalance });
        });
      });
    });
  });
});

// Reset all transactions for a user
app.delete('/api/transactions', (req, res) => {
  const userId = req.query.userId;
  db.serialize(() => {
    db.run('DELETE FROM transactions WHERE userId = ?', [userId], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      
      db.run('UPDATE wallets SET balance = 0 WHERE userId = ?', [userId], (err2) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({ success: true, message: 'Semua data transaksi telah dihapus dan saldo direset ke 0.' });
      });
    });
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
