const { pool } = require("../config/db");

const SEARCH_REQUEST_COLUMNS = `
  id,
  passenger_id,
  origen,
  destino,
  origin_lat,
  origin_lng,
  destination_lat,
  destination_lng,
  origin_h3,
  destination_h3,
  hora_salida_estimada,
  activa,
  created_at
`;

async function createSearchRequest(searchRequest) {
  const {
    passenger_id,
    origen,
    destino,
    origin_lat,
    origin_lng,
    destination_lat,
    destination_lng,
    origin_h3,
    destination_h3,
    hora_salida_estimada,
  } = searchRequest;

  const [result] = await pool.query(
    `INSERT INTO busquedas_viaje
     (passenger_id, origen, destino, origin_lat, origin_lng,
      destination_lat, destination_lng, origin_h3, destination_h3,
      hora_salida_estimada)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      passenger_id,
      origen,
      destino,
      origin_lat,
      origin_lng,
      destination_lat,
      destination_lng,
      origin_h3,
      destination_h3,
      hora_salida_estimada,
    ]
  );

  return result.insertId;
}

async function findById(id) {
  const [rows] = await pool.query(
    `SELECT ${SEARCH_REQUEST_COLUMNS}
     FROM busquedas_viaje
     WHERE id = ?`,
    [id]
  );
  return rows[0] || null;
}

async function findActiveByPassenger(passengerId) {
  const [rows] = await pool.query(
    `SELECT ${SEARCH_REQUEST_COLUMNS}
     FROM busquedas_viaje
     WHERE passenger_id = ? AND activa = TRUE
     ORDER BY created_at DESC`,
    [passengerId]
  );
  return rows;
}

async function updateSearchRequest(id, changes) {
  const allowedFields = [
    "origen",
    "destino",
    "origin_lat",
    "origin_lng",
    "destination_lat",
    "destination_lng",
    "origin_h3",
    "destination_h3",
    "hora_salida_estimada",
    "activa",
  ];
  const entries = Object.entries(changes).filter(([field]) => allowedFields.includes(field));

  if (entries.length === 0) return;

  const assignments = entries.map(([field]) => `${field} = ?`).join(", ");
  const values = entries.map(([, value]) => value);
  await pool.query(
    `UPDATE busquedas_viaje SET ${assignments} WHERE id = ?`,
    [...values, id]
  );
}

async function deactivate(id) {
  await pool.query(
    "UPDATE busquedas_viaje SET activa = FALSE WHERE id = ?",
    [id]
  );
}

module.exports = {
  createSearchRequest,
  findById,
  findActiveByPassenger,
  updateSearchRequest,
  deactivate,
};
