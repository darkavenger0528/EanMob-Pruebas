const { pool } = require("../config/db");

async function createTrip(trip) {
  const {
    conductor_id,
    nombre_prestador,
    origen,
    destino,
    hora_inicio,
    hora_fin,
    vehicle_id,
    available_seats,
    cost_per_passenger,
    status,
    origin_h3,
    destination_h3,
    origin_lat,
    origin_lng,
    destination_lat,
    destination_lng,
    notes
  } = trip;

  const [result] = await pool.query(
    `INSERT INTO trayectos
     (conductor_id, nombre_prestador, origen, destino, hora_inicio, hora_fin,
      vehicle_id, available_seats, cost_per_passenger, status,
      origin_h3, destination_h3, origin_lat, origin_lng,
      destination_lat, destination_lng, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      conductor_id,
      nombre_prestador,
      origen,
      destino,
      hora_inicio,
      hora_fin,
      vehicle_id,
      available_seats,
      cost_per_passenger,
      status,
      origin_h3,
      destination_h3,
      origin_lat,
      origin_lng,
      destination_lat,
      destination_lng,
      notes
    ]
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
    "SELECT * FROM trayectos WHERE conductor_id = ? ORDER BY created_at DESC",
    [conductorId]
  );
  return rows;
}

module.exports = {
  createTrip,
  findById,
  findAllByDriver
};
