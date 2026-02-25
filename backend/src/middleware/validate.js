// src/middleware/validate.js
function validate(schema) {
  return (req, res, next) => {
    /**
     * schema.validate:
     * - abortEarly:false => tüm hataları topla
     * - stripUnknown:true => body’de fazlalık alanları at (güvenlik/temizlik)
     */
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map((d) => d.message),
      });
    }

    // validate edilmiş temiz body’yi geri yaz
    req.body = value;
    next();
  };
}

module.exports = { validate };