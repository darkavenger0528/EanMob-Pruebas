require("dotenv").config();

function requireEnv(name, fallback) {
  const value = process.env[name];
  if (value !== undefined) return value;
  if (fallback !== undefined) return fallback;
  throw new Error(`Missing env var: ${name}`);
}

module.exports = {
  PORT:       requireEnv("PORT", "3002"),
  DB_HOST:    requireEnv("DB_HOST"),
  DB_PORT:    requireEnv("DB_PORT", "3306"),
  DB_USER:    requireEnv("DB_USER"),
  DB_PASSWORD:requireEnv("DB_PASSWORD"),
  DB_NAME:    requireEnv("DB_NAME", "vehicles_ean"),
  DB_SSL:     requireEnv("DB_SSL", "false"),
  DB_SSL_CA_PATH: requireEnv("DB_SSL_CA_PATH", ""),
  DB_SSL_REJECT_UNAUTHORIZED: requireEnv("DB_SSL_REJECT_UNAUTHORIZED", "true"),
  JWT_SECRET: requireEnv("JWT_SECRET"),
};
