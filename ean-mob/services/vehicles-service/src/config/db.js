const mysql = require("mysql2/promise");
const fs = require("fs");
const env   = require("./env");

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
  host:             env.DB_HOST,
  port:             Number(env.DB_PORT),
  user:             env.DB_USER,
  password:         env.DB_PASSWORD,
  database:         env.DB_NAME,
  waitForConnections: true,
  connectionLimit:  10,
};

const ssl = buildSslConfig();
if (ssl) poolConfig.ssl = ssl;

const pool = mysql.createPool(poolConfig);

// ─── Crear tabla si no existe al arrancar ────────────────────────────────────
async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS vehiculos (
      id              INT AUTO_INCREMENT PRIMARY KEY,
      user_id         INT NOT NULL,
      tipo_vehiculo   ENUM('Carro','Moto') NOT NULL,
      marca           VARCHAR(50)  NOT NULL,
      modelo          VARCHAR(50)  NOT NULL,
      anio            YEAR         NOT NULL,
      placa           VARCHAR(10)  NOT NULL UNIQUE,
      color           VARCHAR(30)  NOT NULL,
      numero_puestos  INT          NOT NULL DEFAULT 4,
      soat_vigente    BOOLEAN      DEFAULT FALSE,
      rtm_vigente     BOOLEAN      DEFAULT FALSE,
      rtm_verificado  BOOLEAN      DEFAULT FALSE,
      rtm_mensaje     VARCHAR(255) NULL,
      created_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
      updated_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  await ensureVehicleColumns();
  console.log("[DB] Tabla vehiculos lista");
}

async function ensureVehicleColumns() {
  const requiredColumns = [
    { name: "marca", definition: "VARCHAR(50) NULL" },
    { name: "anio", definition: "YEAR NULL" },
    { name: "numero_puestos", definition: "INT NOT NULL DEFAULT 4" },
  ];

  const [rows] = await pool.query(
    `SELECT COLUMN_NAME
       FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'vehiculos'
        AND COLUMN_NAME IN (?, ?, ?)`,
    requiredColumns.map((column) => column.name)
  );
  const existingColumns = new Set(rows.map((row) => row.COLUMN_NAME));

  for (const column of requiredColumns) {
    if (!existingColumns.has(column.name)) {
      await pool.query(`ALTER TABLE vehiculos ADD COLUMN ${column.name} ${column.definition}`);
    }
  }
}

async function ping() {
  const conn = await pool.getConnection();
  try { await conn.ping(); } finally { conn.release(); }
}

module.exports = { pool, ping, initDb };
