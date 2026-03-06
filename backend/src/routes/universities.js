/**
 * @openapi
 * tags:
 *   - name: Universities
 *     description: University endpoints
 */

/**
 * @openapi
 * /api/v1/universities:
 *   get:
 *     summary: List universities
 *     tags: [Universities]
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Universities list
 */



const express = require("express");
const { pool } = require("../config/db");

const router = express.Router();


router.get("/", async (req, res, next) => {
  try {
    const q = (req.query.q || "").trim();
    const limit = Math.min(parseInt(req.query.limit || "50", 10), 200);

    const params = [];
    let sql = `
      SELECT id, name, display_name, lat, lng
      FROM universities
    `;

 
    if (q) {
      params.push(`%${q}%`);
      sql += ` WHERE display_name ILIKE $${params.length} OR name ILIKE $${params.length}`;
    }

    params.push(limit);
    sql += ` ORDER BY display_name ASC LIMIT $${params.length}`;

    const { rows } = await pool.query(sql, params);
    res.json({ data: rows });
  } catch (err) {
    next(err);
  }
});

module.exports = router;