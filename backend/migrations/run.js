// migrations/run.js
require("dotenv").config();
const { pool } = require("../src/config/db");

async function migrate() {

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

  -- Universities
  CREATE TABLE IF NOT EXISTS universities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  --Jobs
  CREATE TABLE IF NOT EXISTS jobs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  university_id INTEGER REFERENCES universities(id) ON DELETE SET NULL,
  employer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_jobs_university_id ON jobs(university_id);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at);

ALTER TABLE jobs ADD COLUMN IF NOT EXISTS contact_whatsapp VARCHAR(50);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(50);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS contact_url TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS contact_note VARCHAR(255);

  -- Import sirasinda duplicate engellemek için:
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_constraint
      WHERE conname = 'universities_name_unique'
    ) THEN
      ALTER TABLE universities
      ADD CONSTRAINT universities_name_unique UNIQUE (name);
    END IF;
  END $$;
  `;

  await pool.query(sql);
  console.log(" Migrations applied");

  
  await pool.end();
}

migrate().catch(async (err) => {
  console.error("Migration failed:", err);
  try { await pool.end(); } catch {}
  process.exit(1);
});