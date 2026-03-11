require("dotenv").config();

function requireEnv(name, fallback) {
  const value = process.env[name];
  if (value !== undefined) return value;
  if (fallback !== undefined) return fallback;
  throw new Error(`Missing env var: ${name}`);
}

module.exports = {
  PORT:               requireEnv("PORT", "3001"),
  DB_HOST:            requireEnv("DB_HOST", "localhost"),
  DB_PORT:            requireEnv("DB_PORT", "3306"),
  DB_USER:            requireEnv("DB_USER", "root"),
  DB_PASSWORD:        requireEnv("DB_PASSWORD", ""),
  DB_NAME:            requireEnv("DB_NAME", "users_ean"),
  JWT_SECRET:         requireEnv("JWT_SECRET", "dev_secret_changeme"),
  JWT_EXPIRES_IN:     requireEnv("JWT_EXPIRES_IN", "8h"),
  BREVO_API_KEY:      requireEnv("BREVO_API_KEY"),
  SMTP_FROM:          requireEnv("SMTP_FROM", "no-reply@universidadean.edu.co"),
  OTP_LENGTH:         requireEnv("OTP_LENGTH", "6"),
  OTP_EXPIRY_MINUTES: requireEnv("OTP_EXPIRY_MINUTES", "5"),
};
