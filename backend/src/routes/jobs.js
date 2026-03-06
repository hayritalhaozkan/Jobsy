/**
 * @openapi
 * tags:
 *   - name: Jobs
 *     description: Job endpoints
 */

/**
 * @openapi
 * /api/v1/jobs:
 *   get:
 *     summary: List active jobs for a university
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: universityId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Job list returned
 *       400:
 *         description: Missing universityId
 *
 *   post:
 *     summary: Create a new job (EMPLOYER only)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, universityId]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Kampüs Kafe Part-Time
 *               description:
 *                 type: string
 *                 example: Hafta içi çalışacak öğrenci aranıyor
 *               universityId:
 *                 type: integer
 *                 example: 3
 *               contactWhatsapp:
 *                 type: string
 *                 example: "+905551112233"
 *               contactPhone:
 *                 type: string
 *                 example: "+905551112233"
 *               contactEmail:
 *                 type: string
 *                 example: kafe@test.com
 *               contactUrl:
 *                 type: string
 *                 example: https://example.com
 *               contactNote:
 *                 type: string
 *                 example: 09:00-17:00 arası
 *     responses:
 *       201:
 *         description: Job created
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @openapi
 * /api/v1/jobs/{id}:
 *   get:
 *     summary: Get job detail
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Job detail returned
 *       404:
 *         description: Job not found
 *
 *   patch:
 *     summary: Update job (EMPLOYER only)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Job updated
 *       403:
 *         description: Forbidden
 */

/**
 * @openapi
 * /api/v1/jobs/{id}/deactivate:
 *   patch:
 *     summary: Deactivate job (EMPLOYER only)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Job deactivated
 *       403:
 *         description: Forbidden
 */

/**
 * @openapi
 * /api/v1/jobs/{id}/activate:
 *   patch:
 *     summary: Activate job (EMPLOYER only)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Job activated
 *       403:
 *         description: Forbidden
 */

/**
 * @openapi
 * /api/v1/jobs/employer/mine:
 *   get:
 *     summary: Get employer's own jobs
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Employer job list
 *       401:
 *         description: Unauthorized
 */

const express = require("express");
const { pool } = require("../config/db");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

/**
 * POST /api/v1/jobs
 * - Sadece EMPLOYER ilan oluşturabilir
 * - title, description, universityId zorunlu
 * - en az 1 iletişim yöntemi zorunlu (whatsapp/phone/email/url)
 */
router.post(
  "/",
  authenticateToken,
  authorizeRoles("EMPLOYER"),
  async (req, res, next) => {
    try {
      const {
        title,
        description,
        universityId,
        contactWhatsapp,
        contactPhone,
        contactEmail,
        contactUrl,
        contactNote,
      } = req.body;

      if (!title || !description || !universityId) {
        return res.status(400).json({
          message: "Missing required fields: title, description, universityId",
        });
      }

      if (!contactWhatsapp && !contactPhone && !contactEmail && !contactUrl) {
        return res.status(400).json({
          message:
            "At least one contact method is required: contactWhatsapp/contactPhone/contactEmail/contactUrl",
        });
      }

      const w = contactWhatsapp ? String(contactWhatsapp).trim() : null;
      const p = contactPhone ? String(contactPhone).trim() : null;
      const e = contactEmail ? String(contactEmail).trim() : null;
      const u = contactUrl ? String(contactUrl).trim() : null;
      const note = contactNote ? String(contactNote).trim() : null;

      // Basit validasyon (MVP)
      if (e && !e.includes("@")) {
        return res.status(400).json({ message: "Invalid email" });
      }
      if (u && !(u.startsWith("http://") || u.startsWith("https://"))) {
        return res
          .status(400)
          .json({ message: "Invalid url (must start with http/https)" });
      }

      const result = await pool.query(
        `
        INSERT INTO jobs (
          title, description, university_id, employer_id,
          contact_whatsapp, contact_phone, contact_email, contact_url, contact_note
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        RETURNING *
        `,
        [title, description, universityId, req.user.id, w, p, e, u, note]
      );

      res.status(201).json(result.rows[0]);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/v1/jobs?universityId=3
 * - Public liste
 * - MVP: universityId zorunlu (ürün mantığına uygun)
 * - sadece active ilanlar döner
 */
router.get("/", async (req, res, next) => {
  try {
    const { universityId } = req.query;

    if (!universityId) {
      return res
        .status(400)
        .json({ message: "universityId query param is required" });
    }

    const result = await pool.query(
      `
      SELECT
        j.*,
        u.display_name AS university_name
      FROM jobs j
      LEFT JOIN universities u ON u.id = j.university_id
      WHERE j.university_id = $1
        AND j.is_active = true
      ORDER BY j.created_at DESC
      `,
      [universityId]
    );

    res.json({ data: result.rows });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/jobs/employer/mine
 * - EMPLOYER kendi ilanlarını listeler (aktif + pasif)
 */
router.get(
  "/employer/mine",
  authenticateToken,
  authorizeRoles("EMPLOYER"),
  async (req, res, next) => {
    try {
      const result = await pool.query(
        `
        SELECT
          j.*,
          u.display_name AS university_name
        FROM jobs j
        LEFT JOIN universities u ON u.id = j.university_id
        WHERE j.employer_id = $1
        ORDER BY j.created_at DESC
        `,
        [req.user.id]
      );

      res.json({ data: result.rows });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PATCH /api/v1/jobs/:id/deactivate
 * - EMPLOYER sadece kendi ilanını pasife çeker
 */
router.patch(
  "/:id/deactivate",
  authenticateToken,
  authorizeRoles("EMPLOYER"),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const check = await pool.query(
        `SELECT id, employer_id, is_active FROM jobs WHERE id = $1`,
        [id]
      );

      if (check.rows.length === 0) {
        return res.status(404).json({ message: "Job not found" });
      }

      const job = check.rows[0];
      if (job.employer_id !== req.user.id) {
        return res.status(403).json({ message: "You do not own this job" });
      }

      if (job.is_active === false) {
        return res.json({ ok: true, message: "Job already inactive" });
      }

      const updated = await pool.query(
        `
        UPDATE jobs
        SET is_active = false
        WHERE id = $1
        RETURNING *
        `,
        [id]
      );

      res.json({ ok: true, job: updated.rows[0] });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PATCH /api/v1/jobs/:id/activate
 * - EMPLOYER sadece kendi ilanını tekrar aktive eder
 */
router.patch(
  "/:id/activate",
  authenticateToken,
  authorizeRoles("EMPLOYER"),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const check = await pool.query(
        `SELECT id, employer_id, is_active FROM jobs WHERE id = $1`,
        [id]
      );

      if (check.rows.length === 0) {
        return res.status(404).json({ message: "Job not found" });
      }

      const job = check.rows[0];
      if (job.employer_id !== req.user.id) {
        return res.status(403).json({ message: "You do not own this job" });
      }

      if (job.is_active === true) {
        return res.json({ ok: true, message: "Job already active" });
      }

      const updated = await pool.query(
        `
        UPDATE jobs
        SET is_active = true
        WHERE id = $1
        RETURNING *
        `,
        [id]
      );

      res.json({ ok: true, job: updated.rows[0] });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PATCH /api/v1/jobs/:id
 * - EMPLOYER sadece kendi ilanını günceller
 * - (MVP) alanlar opsiyonel, gelenleri update eder
 */
router.patch(
  "/:id",
  authenticateToken,
  authorizeRoles("EMPLOYER"),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      // ownership kontrolü
      const check = await pool.query(
        `SELECT id, employer_id FROM jobs WHERE id = $1`,
        [id]
      );
      if (check.rows.length === 0) {
        return res.status(404).json({ message: "Job not found" });
      }
      if (check.rows[0].employer_id !== req.user.id) {
        return res.status(403).json({ message: "You do not own this job" });
      }

      const {
        title,
        description,
        universityId,
        contactWhatsapp,
        contactPhone,
        contactEmail,
        contactUrl,
        contactNote,
      } = req.body;

      const hasAny =
        title !== undefined ||
        description !== undefined ||
        universityId !== undefined ||
        contactWhatsapp !== undefined ||
        contactPhone !== undefined ||
        contactEmail !== undefined ||
        contactUrl !== undefined ||
        contactNote !== undefined;

      if (!hasAny) {
        return res.status(400).json({ message: "No fields provided to update" });
      }

      // undefined => alan gelmedi, null => sıfırla, string => set et
      const w =
        contactWhatsapp !== undefined
          ? contactWhatsapp
            ? String(contactWhatsapp).trim()
            : null
          : undefined;

      const p =
        contactPhone !== undefined
          ? contactPhone
            ? String(contactPhone).trim()
            : null
          : undefined;

      const e =
        contactEmail !== undefined
          ? contactEmail
            ? String(contactEmail).trim()
            : null
          : undefined;

      const u =
        contactUrl !== undefined
          ? contactUrl
            ? String(contactUrl).trim()
            : null
          : undefined;

      const note =
        contactNote !== undefined
          ? contactNote
            ? String(contactNote).trim()
            : null
          : undefined;

      if (e !== undefined && e !== null && !e.includes("@")) {
        return res.status(400).json({ message: "Invalid email" });
      }
      if (
        u !== undefined &&
        u !== null &&
        !(u.startsWith("http://") || u.startsWith("https://"))
      ) {
        return res
          .status(400)
          .json({ message: "Invalid url (must start with http/https)" });
      }

      const result = await pool.query(
        `
        UPDATE jobs
        SET
          title = COALESCE($1, title),
          description = COALESCE($2, description),
          university_id = COALESCE($3, university_id),
          contact_whatsapp = COALESCE($4, contact_whatsapp),
          contact_phone = COALESCE($5, contact_phone),
          contact_email = COALESCE($6, contact_email),
          contact_url = COALESCE($7, contact_url),
          contact_note = COALESCE($8, contact_note)
        WHERE id = $9
        RETURNING *
        `,
        [
          title === undefined ? null : title,
          description === undefined ? null : description,
          universityId === undefined ? null : universityId,
          w === undefined ? null : w,
          p === undefined ? null : p,
          e === undefined ? null : e,
          u === undefined ? null : u,
          note === undefined ? null : note,
          id,
        ]
      );

      res.json({ ok: true, job: result.rows[0] });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/v1/jobs/:id
 * - Public tek ilan detayı
 * - (istersen burada is_active true kontrolü ekleyebiliriz)
 */
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        j.*,
        u.display_name AS university_name
      FROM jobs j
      LEFT JOIN universities u ON u.id = j.university_id
      WHERE j.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;