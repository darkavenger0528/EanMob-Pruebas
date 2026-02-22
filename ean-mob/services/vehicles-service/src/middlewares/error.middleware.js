function errorMiddleware(err, req, res, next) {
  const status = err.status || 500;
  const body = {
    error: err.message || "Internal Server Error"
  };
  if (err.details) body.details = err.details;
  res.status(status).json(body);
}

module.exports = { errorMiddleware };
