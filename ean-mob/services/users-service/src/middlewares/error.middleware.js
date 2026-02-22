const { HttpError } = require("../utils/httpErrors");

// eslint-disable-next-line no-unused-vars
function errorMiddleware(err, req, res, next) {
  // Errores HTTP controlados
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  // Errores de duplicado MySQL (ER_DUP_ENTRY)
  if (err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({ error: "Ya existe un registro con ese dato" });
  }

  // Error genérico
  console.error("[ERROR]", err);
  res.status(500).json({ error: "Error interno del servidor" });
}

module.exports = { errorMiddleware };