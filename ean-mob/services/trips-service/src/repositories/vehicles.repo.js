const { pool } = require("../config/db");

async function findById(id) {
  const [rows] = await pool.query(
    `
    SELECT id, user_id, tipo_vehiculo, placa
    FROM vehicles_ean.vehiculos
    WHERE id = ?
    LIMIT 1
    `,
    [id]
  );

  return rows[0] || null;
}

module.exports = {
  findById,
};
