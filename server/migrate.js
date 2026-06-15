import sqlite3 from 'sqlite3';
import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../database.sqlite');
const pgUrl = process.env.DATABASE_URL;

if (!pgUrl) {
  console.error('\nERROR: DATABASE_URL tidak ditemukan di file .env!');
  console.error('Silakan isi variabel DATABASE_URL di file .env terlebih dahulu.\n');
  process.exit(1);
}

const runMigration = async () => {
  console.log('Memulai proses migrasi data dari SQLite ke PostgreSQL...');
  
  // 1. Hubungkan ke SQLite
  const sqliteDb = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error('Gagal membuka database SQLite lokal:', err.message);
      process.exit(1);
    }
  });

  // Helper SQLite query to Promise
  const sqliteAll = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      sqliteDb.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  };

  // 2. Hubungkan ke PostgreSQL
  const pgClient = new pg.Client({
    connectionString: pgUrl,
    ssl: pgUrl.includes('localhost') ? false : { rejectUnauthorized: false }
  });

  try {
    await pgClient.connect();
    console.log('Terhubung ke database PostgreSQL Cloud.');

    // 3. Buat skema tabel di PostgreSQL
    console.log('Membuat skema tabel di PostgreSQL jika belum ada...');
    await pgClient.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        nickname TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `);

    await pgClient.query(`
      CREATE TABLE IF NOT EXISTS wallets (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        balance REAL NOT NULL,
        iconName TEXT NOT NULL,
        color TEXT NOT NULL,
        userId INTEGER REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    await pgClient.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        type TEXT NOT NULL,
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        date TEXT NOT NULL,
        note TEXT,
        walletId INTEGER REFERENCES wallets(id) ON DELETE CASCADE,
        userId INTEGER REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // 4. Migrasi Users
    console.log('Membaca data users dari SQLite...');
    const sqliteUsers = await sqliteAll('SELECT * FROM users');
    console.log(`Menemukan ${sqliteUsers.length} user. Memulai migrasi ke PostgreSQL...`);
    for (const user of sqliteUsers) {
      await pgClient.query(
        `INSERT INTO users (id, nickname, email, password) 
         VALUES ($1, $2, $3, $4) 
         ON CONFLICT (id) DO UPDATE SET nickname = EXCLUDED.nickname, email = EXCLUDED.email, password = EXCLUDED.password`,
        [user.id, user.nickname, user.email, user.password]
      );
    }
    console.log('Migrasi users selesai.');

    // 5. Migrasi Wallets
    console.log('Membaca data wallets dari SQLite...');
    const sqliteWallets = await sqliteAll('SELECT * FROM wallets');
    console.log(`Menemukan ${sqliteWallets.length} dompet. Memulai migrasi ke PostgreSQL...`);
    for (const wallet of sqliteWallets) {
      await pgClient.query(
        `INSERT INTO wallets (id, name, type, balance, iconName, color, userId) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, balance = EXCLUDED.balance, iconName = EXCLUDED.iconName, color = EXCLUDED.color, userId = EXCLUDED.userId`,
        [wallet.id, wallet.name, wallet.type, wallet.balance, wallet.iconName, wallet.color, wallet.userId]
      );
    }
    console.log('Migrasi wallets selesai.');

    // 6. Migrasi Transactions
    console.log('Membaca data transactions dari SQLite...');
    const sqliteTransactions = await sqliteAll('SELECT * FROM transactions');
    console.log(`Menemukan ${sqliteTransactions.length} transaksi. Memulai migrasi ke PostgreSQL...`);
    for (const tx of sqliteTransactions) {
      await pgClient.query(
        `INSERT INTO transactions (id, type, amount, category, date, note, walletId, userId) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
         ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, amount = EXCLUDED.amount, category = EXCLUDED.category, date = EXCLUDED.date, note = EXCLUDED.note, walletId = EXCLUDED.walletId, userId = EXCLUDED.userId`,
        [tx.id, tx.type, tx.amount, tx.category, tx.date, tx.note, tx.walletId, tx.userId]
      );
    }
    console.log('Migrasi transactions selesai.');

    // 7. Reset sequence di PostgreSQL agar ID baru ter-increment dengan benar
    console.log('Mereset autoincrement sequence di PostgreSQL...');
    await pgClient.query(`SELECT setval(pg_get_serial_sequence('users', 'id'), coalesce(max(id), 1)) FROM users`);
    await pgClient.query(`SELECT setval(pg_get_serial_sequence('wallets', 'id'), coalesce(max(id), 1)) FROM wallets`);
    await pgClient.query(`SELECT setval(pg_get_serial_sequence('transactions', 'id'), coalesce(max(id), 1)) FROM transactions`);
    console.log('Reset sequence selesai.');

    console.log('\n🎉 MIGRASI SUKSES! Seluruh data Anda telah dipindahkan ke PostgreSQL Cloud.');
  } catch (error) {
    console.error('\n❌ Terjadi kesalahan saat migrasi:', error.message);
  } finally {
    sqliteDb.close();
    await pgClient.end();
    console.log('Koneksi ditutup.');
  }
};

runMigration();
