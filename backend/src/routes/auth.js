/**
 * @openapi
 * tags:
 *   - name: Auth
 *     description: Authentication endpoints
 */

/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     summary: Register user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, role]
 *             properties:
 *               email: { type: string, example: "user@test.com" }
 *               password: { type: string, example: "Password123!" }
 *               role: { type: string, example: "STUDENT" }
 *     responses:
 *       201:
 *         description: Registered
 *       400:
 *         description: Bad request
 */

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: "user@test.com" }
 *               password: { type: string, example: "Password123!" }
 *     responses:
 *       200:
 *         description: Tokens returned
 *       401:
 *         description: Invalid credentials
 */



// src/routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");
const { validate } = require("../middleware/validate");
const { registerSchema, loginSchema, refreshSchema } = require("../validators/schemas");

const router = express.Router();

/**
 * Access token: kısa ömürlü (15m)
 * Refresh token: uzun ömürlü (7d)
 */
function signAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  });
}

function signRefreshToken(payload) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  });
}

/**
 * POST /api/v1/auth/register
 */
router.post("/register", validate(registerSchema), async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    // 1) kullanıcı var mı?
    const existing = await pool.query("SELECT id FROM users WHERE email=$1", [email]);
    if (existing.rowCount) return res.status(409).json({ message: "Email already exists" });

    // 2) şifreyi hashle
    const password_hash = await bcrypt.hash(password, 12);

    // 3) kullanıcı oluştur
    const created = await pool.query(
      "INSERT INTO users(email, password_hash, role) VALUES($1,$2,$3) RETURNING id, email, role, created_at",
      [email, password_hash, role]
    );

    const user = created.rows[0];

    // 4) token üret
    const accessToken = signAccessToken({ sub: user.id, role: user.role });
    const refreshToken = signRefreshToken({ sub: user.id, role: user.role });

    // 5) refresh token’ı DB’ye kaydet
    await pool.query("INSERT INTO refresh_tokens(user_id, token) VALUES($1,$2)", [user.id, refreshToken]);

    res.status(201).json({ user, accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/v1/auth/login
 */
router.post("/login", validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) kullanıcıyı bul
    const found = await pool.query("SELECT id, email, role, password_hash FROM users WHERE email=$1", [email]);
    if (!found.rowCount) return res.status(401).json({ message: "Invalid credentials" });

    const user = found.rows[0];

    // 2) şifre kontrol
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    // 3) token üret
    const accessToken = signAccessToken({ sub: user.id, role: user.role });
    const refreshToken = signRefreshToken({ sub: user.id, role: user.role });

    // 4) refresh token’ı DB’ye kaydet
    await pool.query("INSERT INTO refresh_tokens(user_id, token) VALUES($1,$2)", [user.id, refreshToken]);

    res.json({
      user: { id: user.id, email: user.email, role: user.role },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/v1/auth/refresh
 * - refresh token doğrular
 * - token rotation uygular (eskisini revoke eder, yenisini üretir)
 */
router.post("/refresh", validate(refreshSchema), async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    // 1) refresh token DB’de var mı? revoked mu?
    const stored = await pool.query("SELECT id, user_id, revoked FROM refresh_tokens WHERE token=$1", [refreshToken]);
    if (!stored.rowCount || stored.rows[0].revoked) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // 2) JWT verify (süresi dolmuş / bozuk olabilir)
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch {
      return res.status(401).json({ message: "Expired/invalid refresh token" });
    }

    // 3) rotation: eski token'ı revoke et
    await pool.query("UPDATE refresh_tokens SET revoked=true WHERE id=$1", [stored.rows[0].id]);

    // 4) yeni tokenlar üret
    const accessToken = signAccessToken({ sub: decoded.sub, role: decoded.role });
    const newRefreshToken = signRefreshToken({ sub: decoded.sub, role: decoded.role });

    // 5) yeni refresh token’ı DB’ye yaz
    await pool.query("INSERT INTO refresh_tokens(user_id, token) VALUES($1,$2)", [decoded.sub, newRefreshToken]);

    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    next(err);
  }
});

module.exports = router;