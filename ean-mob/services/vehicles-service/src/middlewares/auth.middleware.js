const jwt = require("jsonwebtoken");
const env  = require("../config/env");
const { UnauthorizedError } = require("../utils/httpErrors");

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Token no proporcionado"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    req.user = payload; // { sub, rol, correo }
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(new UnauthorizedError("Token expirado"));
    }
    return next(new UnauthorizedError("Token inválido"));
  }
}

module.exports = { authMiddleware };
