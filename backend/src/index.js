
require("dotenv").config();
const dbModule = require("./config/db");
const app = require("./app");

app.get("/ping-test", (req, res) => {
  res.json({ ok: true });
});

const pool = dbModule && dbModule.pool ? dbModule.pool : dbModule;

const PORT = process.env.PORT || 3000;

console.log("Starting backend...");
console.log("Loaded PORT:", PORT);
console.log("Connecting to database...");

async function startServer() {
  try {

    await pool.query("SELECT 1");
    try {
      await pool.query('ALTER TABLE jobs ADD COLUMN company_name VARCHAR(255)');
      console.log('company_name column added to jobs table');
    } catch (e) { /* column may already exist */ }
    console.log("DB connected");
  } catch (err) {
    console.error("Failed to start server: Could not connect to DB:", err);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
