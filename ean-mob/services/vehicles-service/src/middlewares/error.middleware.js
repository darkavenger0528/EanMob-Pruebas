const { HttpError } = require("../utils/httpErrors");

// eslint-disable-next-line no-unused-vars
function errorMiddleware(err, req, res, next) {
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  if (err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({ error: "Ya existe un vehículo con esa placa" });
  }

  console.error("[ERROR]", err);
  res.status(500).json({ error: "Error interno del servidor" });
}

module.exports = { errorMiddleware };
