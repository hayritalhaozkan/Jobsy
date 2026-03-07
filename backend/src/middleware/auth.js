// src/middleware/auth.js
const jwt = require("jsonwebtoken");

/**
 * authenticateToken:
 * - Authorization: Bearer <token> header’ından token alır
 * - verify eder
 * - req.user içine { id, role, universityId } yazar
 */
function authenticateToken(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    req.user = {
      id: payload.sub,
      role: payload.role,
      universityId: payload.universityId,
    };

    next();
  } catch {
    return res.status(401).json({ message: "Invalid/expired token" });
  }
}

/**
 * authorizeRoles:
 * - route’a gelen kullanıcının rolü izinli mi?
 * - örn: authorizeRoles("ADMIN")
 */
function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthenticated" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
}

module.exports = { authenticateToken, authorizeRoles };