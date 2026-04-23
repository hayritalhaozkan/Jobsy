const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { rateLimiter } = require('./middleware/rateLimiter');
const { errorHandler } = require('./middleware/errorHandler');

const jobsRoutes = require("./routes/jobs");

const universitiesRoutes = require("./routes/universities");
const adminRoutes = require("./routes/admin");

const authRoutes = require('./routes/auth');

const { authenticateToken, authorizeRoles } = require("./middleware/auth");

const app = express();

const enableSwagger = process.env.ENABLE_SWAGGER === "true";
if (enableSwagger) {
  const swaggerUi = require("swagger-ui-express");
  const swaggerSpec = require("./docs/swagger");
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

//Security headerları ekler
app.use(helmet());

app.use(cors());

//Ayni ip nin birden fazla istek atmasını engeller
app.use(rateLimiter);

app.use(express.json({ limit: '1mb' }));

//gelen her isteği loglar
app.use(morgan('dev'))

//health endpointi(uygulama ayakta mı test etmek için)
app.get("/health", (req, res) => res.json({ status: "ok" }));


//route ları bağlama
app.use("/api/v1/auth", authRoutes);


app.get("/api/v1/me", authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

app.get("/api/v1/admin/ping", authenticateToken, authorizeRoles("ADMIN"), (req, res) => {
  res.json({ ok: true });
});

app.use("/api/v1/universities", universitiesRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/jobs", jobsRoutes);
app.use("/api/v1/profile", require("./routes/profile"));

//404 handler
app.use((req, res) => res.status(404).json({ error: "Not Found" }));

//genel error handler
app.use(errorHandler);

module.exports = app;
