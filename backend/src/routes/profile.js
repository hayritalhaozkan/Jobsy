// src/routes/profile.js

const express = require("express");
const bcrypt  = require("bcryptjs");
const { pool } = require("../config/db");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

/**
 * GET /api/v1/profile
 * - Giriş yapmış kullanıcının profil bilgilerini döner
 */
router.get("/", authenticateToken, async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT
         u.id, u.email, u.role, u.full_name, u.phone, u.bio, u.created_at,
         u.university_id,
         uni.display_name AS university_name
       FROM users u
       LEFT JOIN universities uni ON uni.id = u.university_id
       WHERE u.id = $1`,
      [req.user.id]
    );

    if (!result.rowCount) {
      return res.status(404).json({ message: "User not found" });
    }

    const u = result.rows[0];
    res.json({
      id:             u.id,
      email:          u.email,
      role:           u.role,
      fullName:       u.full_name,
      phone:          u.phone,
      bio:            u.bio,
      universityId:   u.university_id,
      universityName: u.university_name,
      createdAt:      u.created_at,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/v1/profile
 * - Profil güncelle: fullName, phone, bio, universityId, password
 */
router.patch("/", authenticateToken, async (req, res, next) => {
  try {
    const { fullName, phone, bio, universityId, currentPassword, newPassword } = req.body;

    // ── Şifre değişimi (opsiyonel) ──
    let newHash = null;
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Şifre değiştirmek için mevcut şifrenizi girin" });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ message: "Yeni şifre en az 6 karakter olmalı" });
      }

      const userRow = await pool.query(
        "SELECT password_hash FROM users WHERE id = $1", [req.user.id]
      );
      const ok = await bcrypt.compare(currentPassword, userRow.rows[0].password_hash);
      if (!ok) {
        return res.status(400).json({ message: "Mevcut şifre hatalı" });
      }
      newHash = await bcrypt.hash(newPassword, 12);
    }

    // ── universityId geçerli mi? ──
    if (universityId) {
      const uniCheck = await pool.query(
        "SELECT id FROM universities WHERE id = $1", [universityId]
      );
      if (!uniCheck.rowCount) {
        return res.status(400).json({ message: "Geçersiz üniversite" });
      }
    }

    // ── Güncelle ──
    const result = await pool.query(
      `UPDATE users SET
        full_name     = COALESCE($1, full_name),
        phone         = COALESCE($2, phone),
        bio           = COALESCE($3, bio),
        university_id = COALESCE($4, university_id),
        password_hash = COALESCE($5, password_hash)
       WHERE id = $6
       RETURNING id, email, role, full_name, phone, bio, university_id`,
      [
        fullName    !== undefined ? (fullName    || null) : null,
        phone       !== undefined ? (phone       || null) : null,
        bio         !== undefined ? (bio         || null) : null,
        universityId !== undefined ? universityId : null,
        newHash,
        req.user.id,
      ]
    );

    const u = result.rows[0];
    res.json({
      id:           u.id,
      email:        u.email,
      role:         u.role,
      fullName:     u.full_name,
      phone:        u.phone,
      bio:          u.bio,
      universityId: u.university_id,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
