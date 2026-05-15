const jwt = require("jsonwebtoken");
const env = require("../config/env");
const { httpError } = require("../utils/httpErrors");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(httpError(401, "Token no proporcionado"));
  }

  try {
    req.user = jwt.verify(authHeader.slice("Bearer ".length), env.JWT_SECRET);
    return next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(httpError(401, "Token expirado"));
    }
    return next(httpError(401, "Token inválido"));
  }
}

module.exports = { authMiddleware };
