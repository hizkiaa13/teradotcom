import db from '../server/db.js';

db.all("SELECT id FROM users", [], (err, users) => {
  if (err) return console.error(err);
  
  users.forEach(user => {
    const userId = user.id;
    db.get("SELECT count(*) as count FROM wallets WHERE userId = ?", [userId], (err, row) => {
      if (!err && row.count <= 1) { // If they only have 0 or 1 wallet (like the 'feri' one)
        console.log(`Giving default wallets to user ${userId}`);
        const defaultWallets = [
          ['BCA', 'Bank', 0, 'CreditCard', '#0f172a', userId],
          ['Tunai', 'Cash', 0, 'Banknote', '#10b981', userId],
          ['GoPay', 'E-Wallet', 0, 'Smartphone', '#3b82f6', userId]
        ];
        const stmt = db.prepare(`INSERT INTO wallets (name, type, balance, iconName, color, userId) VALUES (?, ?, ?, ?, ?, ?)`);
        defaultWallets.forEach(w => stmt.run(w));
        stmt.finalize();
      }
    });
  });
});
