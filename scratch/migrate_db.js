import db from '../server/db.js';

db.serialize(() => {
  console.log("Attempting to add userId to wallets...");
  db.run("ALTER TABLE wallets ADD COLUMN userId INTEGER", (err) => {
    if (err) console.log("Wallets error:", err.message);
    else console.log("Wallets success!");
  });

  console.log("Attempting to add userId to transactions...");
  db.run("ALTER TABLE transactions ADD COLUMN userId INTEGER", (err) => {
    if (err) console.log("Transactions error:", err.message);
    else console.log("Transactions success!");
  });
});
