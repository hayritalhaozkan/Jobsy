/**
 * @openapi
 * tags:
 *   - name: Admin
 *     description: Admin-only endpoints
 */

/**
 * @openapi
 * /api/v1/admin/universities/seed-names:
 *   post:
 *     summary: Seed universities from local JSON file (ADMIN only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Import result
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not ADMIN)
 */

/**
 * @openapi
 * /api/v1/admin/universities/import:
 *   post:
 *     summary: Import universities from external source (ADMIN only) (if exists in your code)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Import result
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */





const express = require("express");
const { pool } = require("../config/db");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");
const fs = require("fs");
const path = require("path");

const router = express.Router();


// POST /api/v1/admin/universities/seed-names
router.post(
  "/universities/seed-names",
  authenticateToken,
  authorizeRoles("ADMIN"),
  async (req, res, next) => {
    try {
      const seedPath = path.join(__dirname, "../../seeds/universiteler_names.json");
      const raw = fs.readFileSync(seedPath, "utf-8");
      const items = JSON.parse(raw);

      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: "Seed file is empty or invalid" });
      }

      let upserted = 0;

      for (const item of items) {
        const name = String(item?.ad || "").trim();
        if (!name) continue;

        // display_name = name (istersen sonradan TR normalize ederiz)
        await pool.query(
          `
          INSERT INTO universities (name, display_name, lat, lng)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (name) DO UPDATE
            SET display_name = EXCLUDED.display_name
          `,
          [name, name, null, null]
        );

        upserted++;
      }

      res.json({ ok: true, imported: upserted });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;