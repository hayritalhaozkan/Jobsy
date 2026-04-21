require("dotenv").config();
const { pool } = require("../src/config/db");

async function migrate() {
  /* ── 1. universities (bağımlılık yok, önce oluştur) ── */
  await pool.query(`
    CREATE TABLE IF NOT EXISTS universities (
      id           SERIAL PRIMARY KEY,
      name         VARCHAR(255) NOT NULL,
      display_name VARCHAR(255) NOT NULL,
      lat          DOUBLE PRECISION,
      lng          DOUBLE PRECISION,
      created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'universities_name_unique'
      ) THEN
        ALTER TABLE universities ADD CONSTRAINT universities_name_unique UNIQUE (name);
      END IF;
    END $$;
  `);
  console.log("✅ universities");

  /* ── 2. users (universities'e FK var) ── */
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id            SERIAL PRIMARY KEY,
      email         VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role          VARCHAR(20) NOT NULL CHECK (role IN ('STUDENT','EMPLOYER','ADMIN')),
      created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    ALTER TABLE users
      ADD COLUMN IF NOT EXISTS university_id INTEGER REFERENCES universities(id) ON DELETE SET NULL;
  `);
  console.log("✅ users");

  /* ── 3. refresh_tokens ── */
  await pool.query(`
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id         SERIAL PRIMARY KEY,
      user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token      VARCHAR(500) UNIQUE NOT NULL,
      revoked    BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
  console.log("✅ refresh_tokens");

  /* ── 4. jobs ── */
  await pool.query(`
    CREATE TABLE IF NOT EXISTS jobs (
      id            SERIAL PRIMARY KEY,
      title         VARCHAR(255) NOT NULL,
      description   TEXT NOT NULL,
      university_id INTEGER REFERENCES universities(id) ON DELETE SET NULL,
      employer_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      is_active     BOOLEAN NOT NULL DEFAULT true,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    ALTER TABLE jobs ADD COLUMN IF NOT EXISTS salary           VARCHAR(100);
    ALTER TABLE jobs ADD COLUMN IF NOT EXISTS work_schedule    VARCHAR(255);
    ALTER TABLE jobs ADD COLUMN IF NOT EXISTS address          TEXT;
    ALTER TABLE jobs ADD COLUMN IF NOT EXISTS contact_person   VARCHAR(255);
    ALTER TABLE jobs ADD COLUMN IF NOT EXISTS contact_whatsapp VARCHAR(50);
    ALTER TABLE jobs ADD COLUMN IF NOT EXISTS contact_phone    VARCHAR(50);
    ALTER TABLE jobs ADD COLUMN IF NOT EXISTS contact_email    VARCHAR(255);
    ALTER TABLE jobs ADD COLUMN IF NOT EXISTS contact_url      TEXT;
    ALTER TABLE jobs ADD COLUMN IF NOT EXISTS contact_note     TEXT;
    ALTER TABLE jobs ADD COLUMN IF NOT EXISTS company_name     VARCHAR(255);
    ALTER TABLE jobs ADD COLUMN IF NOT EXISTS category         VARCHAR(50);

    CREATE INDEX IF NOT EXISTS idx_jobs_university_id ON jobs(university_id);
    CREATE INDEX IF NOT EXISTS idx_jobs_created_at    ON jobs(created_at);
    CREATE INDEX IF NOT EXISTS idx_jobs_category      ON jobs(category);
  `);
  console.log("✅ jobs");

  /* ── 5. saved_jobs ── */
  await pool.query(`
    CREATE TABLE IF NOT EXISTS saved_jobs (
      id         SERIAL PRIMARY KEY,
      user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      job_id     INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      UNIQUE(user_id, job_id)
    );
  `);
  console.log("✅ saved_jobs");

  console.log("\n🎉 Tüm migration'lar başarıyla uygulandı.");
  await pool.end();
}

migrate().catch(async (err) => {
  console.error("❌ Migration failed:", err.message);
  try { await pool.end(); } catch {}
  process.exit(1);
});