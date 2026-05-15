const dotenv = require("dotenv");

dotenv.config();

function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

module.exports = {
  PORT: process.env.PORT || "3003",
  DB_HOST: requireEnv("DB_HOST"),
  DB_PORT: process.env.DB_PORT || "3306",
  DB_USER: requireEnv("DB_USER"),
  DB_PASSWORD: requireEnv("DB_PASSWORD"),
  DB_NAME: requireEnv("DB_NAME"), // trips_ean
  DB_SSL: process.env.DB_SSL || "false",
  DB_SSL_CA_PATH: process.env.DB_SSL_CA_PATH || "",
  DB_SSL_REJECT_UNAUTHORIZED: process.env.DB_SSL_REJECT_UNAUTHORIZED || "true",
  JWT_SECRET: process.env.JWT_SECRET || "dev_secret_changeme",
  MATCHING_SERVICE_URL: process.env.MATCHING_SERVICE_URL || "http://localhost:8000",
  PICO_PLACA_SERVICE_URL: process.env.PICO_PLACA_SERVICE_URL || "http://localhost:8002",
  PICO_PLACA_TIMEOUT_MS: process.env.PICO_PLACA_TIMEOUT_MS || "2000"
};
