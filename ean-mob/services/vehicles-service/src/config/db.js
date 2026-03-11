const mysql = require("mysql2/promise");
const env   = require("./env");

const pool = mysql.createPool({
  host:             env.DB_HOST,
  port:             Number(env.DB_PORT),
  user:             env.DB_USER,
  password:         env.DB_PASSWORD,
  database:         env.DB_NAME,
  waitForConnections: true,
  connectionLimit:  10,
});

// ─── Crear tabla si no existe al arrancar ────────────────────────────────────
async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS vehiculos (
      id              INT AUTO_INCREMENT PRIMARY KEY,
      user_id         INT NOT NULL,
      tipo_vehiculo   ENUM('Carro','Moto') NOT NULL,
      modelo          VARCHAR(50)  NOT NULL,
      placa           VARCHAR(10)  NOT NULL UNIQUE,
      color           VARCHAR(30)  NOT NULL,
      soat_vigente    BOOLEAN      DEFAULT FALSE,
      rtm_vigente     BOOLEAN      DEFAULT FALSE,
      rtm_verificado  BOOLEAN      DEFAULT FALSE,
      rtm_mensaje     VARCHAR(255) NULL,
      created_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
      updated_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  console.log("[DB] Tabla vehiculos lista");
}

async function ping() {
  const conn = await pool.getConnection();
  try { await conn.ping(); } finally { conn.release(); }
}

module.exports = { pool, ping, initDb };
