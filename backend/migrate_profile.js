require("dotenv").config();
const { pool } = require("../src/config/db");

async function run() {
  try {
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name VARCHAR(100);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS phone     VARCHAR(20);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS bio       TEXT;
    `);
    console.log("✅ users: full_name, phone, bio sütunları eklendi");
  } catch (e) {
    console.error("❌ Hata:", e.message);
  } finally {
    await pool.end();
    process.exit(0);
  }
}
run();
