const mysql = require("mysql2/promise");
const fs = require("fs");
const env = require("./env");

function buildSslConfig() {
  if (env.DB_SSL !== "true") return undefined;

  const ssl = {
    rejectUnauthorized: env.DB_SSL_REJECT_UNAUTHORIZED !== "false",
  };

  if (env.DB_SSL_CA_PATH) {
    ssl.ca = fs.readFileSync(env.DB_SSL_CA_PATH, "utf8");
  }

  return ssl;
}

const poolConfig = {
  host: env.DB_HOST,
  port: Number(env.DB_PORT),
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
};

const ssl = buildSslConfig();
if (ssl) poolConfig.ssl = ssl;

const pool = mysql.createPool(poolConfig);

async function ping() {
  const conn = await pool.getConnection();
  try {
    await conn.ping();
  } finally {
    conn.release();
  }
}

module.exports = { pool, ping };
