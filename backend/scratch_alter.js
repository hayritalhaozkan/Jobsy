const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgres://postgres:postgres@localhost:5432/jobsy' });

async function run() {
  try {
    await pool.query('ALTER TABLE jobs ADD COLUMN company_name VARCHAR(255)');
    console.log('ALTER success');
  } catch(e) { console.error('ALTER fail:', e.message); }
  
  const res = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'jobs'");
  console.log(res.rows);
  process.exit(0);
}
run();
