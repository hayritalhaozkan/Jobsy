
require("dotenv").config();

const app = require("./app");


const dbModule = require("./config/db");

const pool = dbModule && dbModule.pool ? dbModule.pool : dbModule;

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    
    await pool.query("SELECT 1");
    console.log("DB connected");
  } catch (err) {
    console.error("Failed to start server: Could not connect to DB:", err);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
  });
}

startServer();