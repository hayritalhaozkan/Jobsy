// src/validators/schemas.js
const Joi = require("joi");

/**
 * Register:
 * - email format kontrol
 * - password min 8 max 72 (bcrypt için mantıklı)
 * - role sadece STUDENT veya EMPLOYER
 * - universityId zorunlu (kullanıcının üniversitesi)
 */
const registerSchema = Joi.object({
  email: Joi.string().email().required(),

  password: Joi.string()
    .min(8)
    .max(72)
    .required(),

  role: Joi.string()
    .valid("STUDENT", "EMPLOYER")
    .required(),

  universityId: Joi.number()
    .integer()
    .positive()
    .required(),
});

/**
 * Login:
 * - email ve password zorunlu
 */
const loginSchema = Joi.object({
  email: Joi.string().email().required(),

  password: Joi.string().required(),
});

/**
 * Refresh:
 * - refreshToken zorunlu
 */
const refreshSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  refreshSchema,
};