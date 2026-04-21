// Çalıştırmak için: node backend/migrate_category.js
// Docker DB'nin ayakta olması gerekiyor: docker compose up -d

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:postgres@localhost:5432/jobsy',
});

async function run() {
  try {
    // Category sütununu ekle (zaten varsa skip et)
    await pool.query(`
      ALTER TABLE jobs
      ADD COLUMN IF NOT EXISTS category VARCHAR(50)
    `);
    console.log('✅ category sütunu eklendi (veya zaten vardı)');

    // Mevcut sütunları listele
    const cols = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'jobs'
      ORDER BY ordinal_position
    `);
    console.log('\nMevcut jobs sütunları:');
    cols.rows.forEach(r => console.log(` - ${r.column_name} (${r.data_type})`));

  } catch (e) {
    console.error('❌ Migration hatası:', e.message);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

run();
