const { pool } = require("../config/db");

async function createVehicle(vehicle) {
  const { user_id, tipo_vehiculo, modelo, placa, color } = vehicle;

  const [result] = await pool.query(
    `INSERT INTO vehiculos
     (user_id, tipo_vehiculo, modelo, placa, color)
     VALUES (?, ?, ?, ?, ?)`,
    [user_id, tipo_vehiculo, modelo, placa, color]
  );

  return result.insertId;
}

async function findById(id) {
  const [rows] = await pool.query(
    "SELECT * FROM vehiculos WHERE id = ?",
    [id]
  );
  return rows[0] || null;
}

async function findAllByUser(userId) {
  const [rows] = await pool.query(
    "SELECT * FROM vehiculos WHERE user_id = ?",
    [userId]
  );
  return rows;
}

async function remove(id) {
  const [result] = await pool.query(
    "DELETE FROM vehiculos WHERE id = ?",
    [id]
  );
  return result.affectedRows > 0;
}

module.exports = {
  createVehicle,
  findById,
  findAllByUser,
  remove
};
