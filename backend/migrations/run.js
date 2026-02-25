// migrations/run.js
require("dotenv").config();
const { pool } = require("../src/config/db");

async function migrate() {
  /**
   * Bu SQL bloğu:
   * - users tablosunu
   * - refresh_tokens tablosunu oluşturur
   *
   * IF NOT EXISTS => tekrar çalıştırınca patlamasın.
   */
  const sql = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('STUDENT','EMPLOYER','ADMIN')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) UNIQUE NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  `;

  await pool.query(sql);
  console.log("Migrations applied");

  // bağlantıyı kapat
  await pool.end();
}

migrate().catch(async (err) => {
  console.error("Migration failed:", err);
  try {
    await pool.end();
  } catch {}
  process.exit(1);
});