import sqlite3 from 'sqlite3';
import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../database.sqlite');

let db;
const isPostgres = !!process.env.DATABASE_URL;

if (isPostgres) {
  console.log('Menggunakan database PostgreSQL...');
  
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
  });

  // Helper untuk mengubah query SQLite (?) menjadi query PostgreSQL ($1, $2, dst)
  const translateSql = (sql) => {
    let pgSql = sql;
    let index = 1;
    while (pgSql.includes('?')) {
      pgSql = pgSql.replace('?', `$${index++}`);
    }
    return pgSql;
  };

  db = {
    isPostgres: true,
    
    run(sql, params, callback) {
      let actualParams = params;
      let actualCallback = callback;
      if (typeof params === 'function') {
        actualCallback = params;
        actualParams = [];
      }
      
      let pgSql = translateSql(sql);
      const isInsert = pgSql.trim().toUpperCase().startsWith('INSERT');
      if (isInsert && !pgSql.toUpperCase().includes('RETURNING')) {
        pgSql += ' RETURNING id';
      }

      pool.query(pgSql, actualParams || [], (err, res) => {
        if (err) {
          if (actualCallback) actualCallback(err);
          return;
        }
        const mockThis = {
          lastID: isInsert && res.rows && res.rows[0] ? res.rows[0].id : null,
          changes: res.rowCount
        };
        if (actualCallback) actualCallback.call(mockThis, null);
      });
    },

    get(sql, params, callback) {
      let actualParams = params;
      let actualCallback = callback;
      if (typeof params === 'function') {
        actualCallback = params;
        actualParams = [];
      }

      const pgSql = translateSql(sql);
      pool.query(pgSql, actualParams || [], (err, res) => {
        if (err) {
          if (actualCallback) actualCallback(err);
          return;
        }
        if (actualCallback) actualCallback(null, res.rows[0] || null);
      });
    },

    all(sql, params, callback) {
      let actualParams = params;
      let actualCallback = callback;
      if (typeof params === 'function') {
        actualCallback = params;
        actualParams = [];
      }

      const pgSql = translateSql(sql);
      pool.query(pgSql, actualParams || [], (err, res) => {
        if (err) {
          if (actualCallback) actualCallback(err);
          return;
        }
        if (actualCallback) actualCallback(null, res.rows || []);
      });
    },

    serialize(callback) {
      // Di postgres kita langsung eksekusi callback karena pool mengatur antrian
      callback();
    },

    prepare(sql) {
      return {
        run: (params, callback) => {
          db.run(sql, params, callback);
        },
        finalize: () => {
          // no-op
        }
      };
    }
  };

  // Buat tabel jika belum ada
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      nickname TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS wallets (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      balance REAL NOT NULL,
      iconName TEXT NOT NULL,
      color TEXT NOT NULL,
      userId INTEGER REFERENCES users(id) ON DELETE CASCADE
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      type TEXT NOT NULL,
      amount REAL NOT NULL,
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      note TEXT,
      walletId INTEGER REFERENCES wallets(id) ON DELETE CASCADE,
      userId INTEGER REFERENCES users(id) ON DELETE CASCADE
    )`);
  });

} else {
  console.log('Menggunakan database SQLite lokal...');
  
  const sqliteDb = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening database', err.message);
    } else {
      console.log('Connected to the SQLite database.');
    }
  });

  db = {
    isPostgres: false,
    
    run(sql, params, callback) {
      sqliteDb.run(sql, params, callback);
    },

    get(sql, params, callback) {
      sqliteDb.get(sql, params, callback);
    },

    all(sql, params, callback) {
      sqliteDb.all(sql, params, callback);
    },

    serialize(callback) {
      sqliteDb.serialize(callback);
    },

    prepare(sql) {
      return sqliteDb.prepare(sql);
    }
  };

  // Jalankan inisialisasi tabel SQLite
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nickname TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS wallets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      balance REAL NOT NULL,
      iconName TEXT NOT NULL,
      color TEXT NOT NULL,
      userId INTEGER,
      FOREIGN KEY (userId) REFERENCES users (id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      amount REAL NOT NULL,
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      note TEXT,
      walletId INTEGER,
      userId INTEGER,
      FOREIGN KEY (walletId) REFERENCES wallets (id),
      FOREIGN KEY (userId) REFERENCES users (id)
    )`);

    db.run("ALTER TABLE wallets ADD COLUMN userId INTEGER", () => {});
    db.run("ALTER TABLE transactions ADD COLUMN userId INTEGER", () => {});

    // Seed wallets default jika kosong
    db.get('SELECT count(*) as count FROM wallets', (err, row) => {
      if (!err && row.count === 0) {
        console.log('Seeding initial wallets...');
        const stmt = db.prepare(`INSERT INTO wallets (name, type, balance, iconName, color, userId) VALUES (?, ?, ?, ?, ?, ?)`);
        stmt.run(['BCA', 'Bank', 0, 'CreditCard', '#0f172a', null]);
        stmt.run(['Tunai', 'Cash', 0, 'Banknote', '#10b981', null]);
        stmt.run(['GoPay', 'E-Wallet', 0, 'Smartphone', '#3b82f6', null]);
        stmt.finalize();
      }
    });
  });
}

export default db;
