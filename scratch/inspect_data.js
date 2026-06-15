import db from '../server/db.js';

db.all("SELECT id, type, amount, category, userId, walletId FROM transactions", [], (err, rows) => {
  if (err) console.error(err);
  console.log("Transactions data:");
  console.table(rows);
});

db.all("SELECT id, name, balance, userId FROM wallets", [], (err, rows) => {
  if (err) console.error(err);
  console.log("\nWallets data:");
  console.table(rows);
});
