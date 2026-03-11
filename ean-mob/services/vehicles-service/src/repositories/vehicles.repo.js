const { pool } = require("../config/db");

// ─── Crear vehículo ───────────────────────────────────────────────────────────
async function createVehicle({ user_id, tipo_vehiculo, modelo, placa, color,
                                soat_vigente, rtm_vigente, rtm_verificado, rtm_mensaje }) {
  const [result] = await pool.query(
    `INSERT INTO vehiculos
       (user_id, tipo_vehiculo, modelo, placa, color,
        soat_vigente, rtm_vigente, rtm_verificado, rtm_mensaje)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [user_id, tipo_vehiculo, modelo, placa, color,
     soat_vigente, rtm_vigente, rtm_verificado, rtm_mensaje]
  );
  return result.insertId;
}

// ─── Buscar por ID ────────────────────────────────────────────────────────────
async function findById(id) {
  const [rows] = await pool.query(
    "SELECT * FROM vehiculos WHERE id = ?", [id]
  );
  return rows[0] || null;
}

// ─── Buscar por placa ─────────────────────────────────────────────────────────
async function findByPlaca(placa) {
  const [rows] = await pool.query(
    "SELECT * FROM vehiculos WHERE placa = ? LIMIT 1", [placa]
  );
  return rows[0] || null;
}

// ─── Todos los vehículos del usuario ─────────────────────────────────────────
async function findAllByUser(userId) {
  const [rows] = await pool.query(
    "SELECT * FROM vehiculos WHERE user_id = ? ORDER BY created_at DESC", [userId]
  );
  return rows;
}

// ─── Actualizar vehículo ──────────────────────────────────────────────────────
async function updateVehicle(id, fields) {
  const allowed = ["modelo", "color", "soat_vigente",
                   "rtm_vigente", "rtm_verificado", "rtm_mensaje"];
  const updates = [];
  const values  = [];

  for (const key of allowed) {
    if (fields[key] !== undefined) {
      updates.push(`${key} = ?`);
      values.push(fields[key]);
    }
  }

  if (updates.length === 0) return;

  values.push(id);
  await pool.query(
    `UPDATE vehiculos SET ${updates.join(", ")} WHERE id = ?`, values
  );
}

// ─── Eliminar vehículo ────────────────────────────────────────────────────────
async function removeVehicle(id) {
  const [result] = await pool.query(
    "DELETE FROM vehiculos WHERE id = ?", [id]
  );
  return result.affectedRows > 0;
}

module.exports = {
  createVehicle,
  findById,
  findByPlaca,
  findAllByUser,
  updateVehicle,
  removeVehicle,
};
