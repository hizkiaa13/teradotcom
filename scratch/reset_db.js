import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
    process.exit(1);
  }
  
  console.log('Connected to database for reset...');
  
  db.serialize(() => {
    // Delete all transactions
    db.run('DELETE FROM transactions', (err) => {
      if (err) console.error('Error deleting transactions:', err.message);
      else console.log('All transactions deleted.');
    });
    
    // Reset all wallet balances to 0
    db.run('UPDATE wallets SET balance = 0', (err) => {
      if (err) console.error('Error resetting wallet balances:', err.message);
      else console.log('All wallet balances reset to 0.');
    });
  });
  
  db.close((err) => {
    if (err) console.error(err.message);
    console.log('Database connection closed.');
  });
});
