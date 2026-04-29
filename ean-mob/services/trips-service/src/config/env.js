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
};
