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
 *             required: [title, description, universityId, contactPerson]
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
 *               salary:
 *                 type: string
 *                 example: Saatlik 150 TL
 *               workSchedule:
 *                 type: string
 *                 example: Hafta içi 16:00-20:00
 *               address:
 *                 type: string
 *                 example: Selçuklu / Konya
 *               contactPerson:
 *                 type: string
 *                 example: Ahmet Yılmaz
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
 *                 example: 09:00-17:00 arası iletişime geçin
 *     responses:
 *       201:
 *         description: Job created
 *       400:
 *         description: Validation error
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
 *       400:
 *         description: Validation error
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

function normalizeString(value) {
  if (value === undefined) return undefined;
  if (value === null) return null;

  const trimmed = String(value).trim();
  return trimmed === "" ? null : trimmed;
}

function hasAtLeastOneContact({
  contactWhatsapp,
  contactPhone,
  contactEmail,
  contactUrl,
}) {
  return Boolean(contactWhatsapp || contactPhone || contactEmail || contactUrl);
}

function validateEmail(email) {
  if (!email) return true;
  return email.includes("@");
}

function validateUrl(url) {
  if (!url) return true;
  return url.startsWith("http://") || url.startsWith("https://");
}

/**
 * POST /api/v1/jobs
 * - Sadece EMPLOYER ilan oluşturabilir
 * - title, description, universityId, contactPerson zorunlu
 * - en az 1 iletişim yöntemi zorunlu
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
        salary,
        workSchedule,
        address,
        contactPerson,
        contactWhatsapp,
        contactPhone,
        contactEmail,
        contactUrl,
        contactNote,
      } = req.body;

      if (!title || !description || !universityId || !contactPerson) {
        return res.status(400).json({
          message:
            "Missing required fields: title, description, universityId, contactPerson",
        });
      }

      const normalized = {
        title: String(title).trim(),
        description: String(description).trim(),
        salary: normalizeString(salary),
        workSchedule: normalizeString(workSchedule),
        address: normalizeString(address),
        contactPerson: normalizeString(contactPerson),
        contactWhatsapp: normalizeString(contactWhatsapp),
        contactPhone: normalizeString(contactPhone),
        contactEmail: normalizeString(contactEmail),
        contactUrl: normalizeString(contactUrl),
        contactNote: normalizeString(contactNote),
      };

      if (
        !hasAtLeastOneContact({
          contactWhatsapp: normalized.contactWhatsapp,
          contactPhone: normalized.contactPhone,
          contactEmail: normalized.contactEmail,
          contactUrl: normalized.contactUrl,
        })
      ) {
        return res.status(400).json({
          message:
            "At least one contact method is required: contactWhatsapp/contactPhone/contactEmail/contactUrl",
        });
      }

      if (!validateEmail(normalized.contactEmail)) {
        return res.status(400).json({ message: "Invalid email" });
      }

      if (!validateUrl(normalized.contactUrl)) {
        return res
          .status(400)
          .json({ message: "Invalid url (must start with http/https)" });
      }

      const uniCheck = await pool.query(
        "SELECT id FROM universities WHERE id = $1",
        [universityId]
      );

      if (!uniCheck.rowCount) {
        return res.status(400).json({ message: "Invalid universityId" });
      }

      const result = await pool.query(
        `
        INSERT INTO jobs (
          title,
          description,
          university_id,
          employer_id,
          salary,
          work_schedule,
          address,
          contact_person,
          contact_whatsapp,
          contact_phone,
          contact_email,
          contact_url,
          contact_note
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
        RETURNING *
        `,
        [
          normalized.title,
          normalized.description,
          universityId,
          req.user.id,
          normalized.salary,
          normalized.workSchedule,
          normalized.address,
          normalized.contactPerson,
          normalized.contactWhatsapp,
          normalized.contactPhone,
          normalized.contactEmail,
          normalized.contactUrl,
          normalized.contactNote,
        ]
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
 * - sadece active ilanlar
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
        u.display_name AS university_name,
        usr.email AS employer_email
      FROM jobs j
      LEFT JOIN universities u ON u.id = j.university_id
      LEFT JOIN users usr ON usr.id = j.employer_id
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


router.get(
  "/employer/dashboard",
  authenticateToken,
  authorizeRoles("EMPLOYER"),
  async (req, res, next) => {
    try {
      const summaryResult = await pool.query(
        `
        SELECT
          COUNT(*) AS total_jobs,
          COUNT(*) FILTER (WHERE is_active = true) AS active_jobs,
          COUNT(*) FILTER (WHERE is_active = false) AS passive_jobs
        FROM jobs
        WHERE employer_id = $1
        `,
        [req.user.id]
      );

      const recentJobsResult = await pool.query(
        `
        SELECT
          j.id,
          j.title,
          j.is_active,
          j.created_at,
          u.display_name AS university_name
        FROM jobs j
        LEFT JOIN universities u ON u.id = j.university_id
        WHERE j.employer_id = $1
        ORDER BY j.created_at DESC
        LIMIT 5
        `,
        [req.user.id]
      );

      res.json({
        summary: summaryResult.rows[0],
        recentJobs: recentJobsResult.rows,
      });
    } catch (err) {
      next(err);
    }
  }
);





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

      if (!check.rows.length) {
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

      if (!check.rows.length) {
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
 */
router.patch(
  "/:id",
  authenticateToken,
  authorizeRoles("EMPLOYER"),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const check = await pool.query(
        `SELECT id, employer_id FROM jobs WHERE id = $1`,
        [id]
      );

      if (!check.rows.length) {
        return res.status(404).json({ message: "Job not found" });
      }

      if (check.rows[0].employer_id !== req.user.id) {
        return res.status(403).json({ message: "You do not own this job" });
      }

      const {
        title,
        description,
        universityId,
        salary,
        workSchedule,
        address,
        contactPerson,
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
        salary !== undefined ||
        workSchedule !== undefined ||
        address !== undefined ||
        contactPerson !== undefined ||
        contactWhatsapp !== undefined ||
        contactPhone !== undefined ||
        contactEmail !== undefined ||
        contactUrl !== undefined ||
        contactNote !== undefined;

      if (!hasAny) {
        return res.status(400).json({ message: "No fields provided to update" });
      }

      const normalized = {
        title: title !== undefined ? normalizeString(title) : undefined,
        description:
          description !== undefined ? normalizeString(description) : undefined,
        salary: salary !== undefined ? normalizeString(salary) : undefined,
        workSchedule:
          workSchedule !== undefined ? normalizeString(workSchedule) : undefined,
        address: address !== undefined ? normalizeString(address) : undefined,
        contactPerson:
          contactPerson !== undefined ? normalizeString(contactPerson) : undefined,
        contactWhatsapp:
          contactWhatsapp !== undefined
            ? normalizeString(contactWhatsapp)
            : undefined,
        contactPhone:
          contactPhone !== undefined ? normalizeString(contactPhone) : undefined,
        contactEmail:
          contactEmail !== undefined ? normalizeString(contactEmail) : undefined,
        contactUrl:
          contactUrl !== undefined ? normalizeString(contactUrl) : undefined,
        contactNote:
          contactNote !== undefined ? normalizeString(contactNote) : undefined,
      };

      if (
        normalized.contactEmail !== undefined &&
        !validateEmail(normalized.contactEmail)
      ) {
        return res.status(400).json({ message: "Invalid email" });
      }

      if (
        normalized.contactUrl !== undefined &&
        !validateUrl(normalized.contactUrl)
      ) {
        return res
          .status(400)
          .json({ message: "Invalid url (must start with http/https)" });
      }

      if (universityId !== undefined) {
        const uniCheck = await pool.query(
          "SELECT id FROM universities WHERE id = $1",
          [universityId]
        );

        if (!uniCheck.rowCount) {
          return res.status(400).json({ message: "Invalid universityId" });
        }
      }

      const result = await pool.query(
        `
        UPDATE jobs
        SET
          title = COALESCE($1, title),
          description = COALESCE($2, description),
          university_id = COALESCE($3, university_id),
          salary = COALESCE($4, salary),
          work_schedule = COALESCE($5, work_schedule),
          address = COALESCE($6, address),
          contact_person = COALESCE($7, contact_person),
          contact_whatsapp = COALESCE($8, contact_whatsapp),
          contact_phone = COALESCE($9, contact_phone),
          contact_email = COALESCE($10, contact_email),
          contact_url = COALESCE($11, contact_url),
          contact_note = COALESCE($12, contact_note)
        WHERE id = $13
        RETURNING *
        `,
        [
          normalized.title === undefined ? null : normalized.title,
          normalized.description === undefined ? null : normalized.description,
          universityId === undefined ? null : universityId,
          normalized.salary === undefined ? null : normalized.salary,
          normalized.workSchedule === undefined ? null : normalized.workSchedule,
          normalized.address === undefined ? null : normalized.address,
          normalized.contactPerson === undefined
            ? null
            : normalized.contactPerson,
          normalized.contactWhatsapp === undefined
            ? null
            : normalized.contactWhatsapp,
          normalized.contactPhone === undefined ? null : normalized.contactPhone,
          normalized.contactEmail === undefined ? null : normalized.contactEmail,
          normalized.contactUrl === undefined ? null : normalized.contactUrl,
          normalized.contactNote === undefined ? null : normalized.contactNote,
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
 */
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        j.*,
        u.display_name AS university_name,
        usr.email AS employer_email
      FROM jobs j
      LEFT JOIN universities u ON u.id = j.university_id
      LEFT JOIN users usr ON usr.id = j.employer_id
      WHERE j.id = $1
      `,
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;