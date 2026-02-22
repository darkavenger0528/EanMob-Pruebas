const { pool } = require("../config/db");

async function createTrip(trip) {
  const {
    conductor_id,
    nombre_prestador,
    origen,
    destino,
    hora_inicio,
    hora_fin
  } = trip;

  const [result] = await pool.query(
    `INSERT INTO trayectos
     (conductor_id, nombre_prestador, origen, destino, hora_inicio, hora_fin)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [conductor_id, nombre_prestador, origen, destino, hora_inicio, hora_fin]
  );

  return result.insertId;
}

async function findById(id) {
  const [rows] = await pool.query(
    "SELECT * FROM trayectos WHERE id = ?",
    [id]
  );
  return rows[0] || null;
}

async function findAllByDriver(conductorId) {
  const [rows] = await pool.query(
    "SELECT * FROM trayectos WHERE conductor_id = ?",
    [conductorId]
  );
  return rows;
}

module.exports = {
  createTrip,
  findById,
  findAllByDriver
};
