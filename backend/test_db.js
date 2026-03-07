const { Pool } = require('pg');

console.log('Step 1: Pool constructor...');

const pool = new Pool({ 
  host: 'localhost', 
  port: 5432, 
  user: 'postgres', 
  password: 'postgres', 
  database: 'jobsy',
  connectionTimeoutMillis: 5000 
});

console.log('Step 2: Pool created');

pool.on('error', (err) => {
  console.error('Pool error event:', err.message);
});

console.log('Step 3: Running query...');

pool.query('SELECT 1 as result')
  .then(res => {
    console.log('Step 4: SUCCESS:', JSON.stringify(res.rows));
    return pool.end();
  })
  .then(() => {
    console.log('Step 5: Pool ended');
    process.exit(0);
  })
  .catch(err => {
    console.error('Step 4: ERROR:', err.message);
    pool.end().then(() => process.exit(1));
  });

setTimeout(() => {
  console.error('GLOBAL TIMEOUT after 10s');
  pool.end().then(() => process.exit(1));
}, 10000);
