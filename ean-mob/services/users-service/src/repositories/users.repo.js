const pool = require("../config/db");

// ─── Buscar usuario por correo ───────────────────────────────────────────────
async function findByEmail(correo) {
  const [rows] = await pool.query(
    "SELECT * FROM usuarios WHERE correo = ? LIMIT 1",
    [correo]
  );
  return rows[0] || null;
}

// ─── Buscar usuario por número de identificación ─────────────────────────────
async function findByNumeroId(numero_identificacion) {
  const [rows] = await pool.query(
    "SELECT * FROM usuarios WHERE numero_identificacion = ? LIMIT 1",
    [numero_identificacion]
  );
  return rows[0] || null;
}

// ─── Buscar usuario por ID ───────────────────────────────────────────────────
async function findById(id) {
  const [rows] = await pool.query(
    "SELECT * FROM usuarios WHERE id = ? LIMIT 1",
    [id]
  );
  return rows[0] || null;
}

// ─── Crear usuario ───────────────────────────────────────────────────────────
async function createUser({
  nombre_completo,
  fecha_nacimiento,
  tipo_documento,
  numero_identificacion,
  correo,
  rol,
  password_hash,
  grupo_sanguineo = null,
  sexo = null,
  altura_cm = null,
  peso_kg = null,
  otp,
  otp_expires_at,
}) {
  const [result] = await pool.query(
    `INSERT INTO usuarios
      (nombre_completo, fecha_nacimiento, tipo_documento, numero_identificacion,
       correo, rol, password_hash, grupo_sanguineo, sexo, altura_cm, peso_kg,
       otp, otp_expires_at, email_verified)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, FALSE)`,
    [
      nombre_completo,
      fecha_nacimiento,
      tipo_documento,
      numero_identificacion,
      correo,
      rol,
      password_hash,
      grupo_sanguineo,
      sexo,
      altura_cm,
      peso_kg,
      otp,
      otp_expires_at,
    ]
  );
  return result.insertId;
}

// ─── Guardar OTP (reenvío) ───────────────────────────────────────────────────
async function saveOtp(correo, otp, otp_expires_at) {
  await pool.query(
    "UPDATE usuarios SET otp = ?, otp_expires_at = ? WHERE correo = ?",
    [otp, otp_expires_at, correo]
  );
}

// ─── Verificar email (limpiar OTP) ──────────────────────────────────────────
async function verifyEmail(correo) {
  await pool.query(
    "UPDATE usuarios SET email_verified = TRUE, otp = NULL, otp_expires_at = NULL WHERE correo = ?",
    [correo]
  );
}

// ─── Actualizar perfil ───────────────────────────────────────────────────────
async function updateUser(id, fields) {
  // Construir SET dinámico solo con campos permitidos
  const allowed = ["nombre_completo", "fecha_nacimiento", "grupo_sanguineo", "sexo", "altura_cm", "peso_kg", "celular"];
  const updates = [];
  const values  = [];

  for (const key of allowed) {
    if (fields[key] !== undefined) {
      updates.push(`${key} = ?`);
      values.push(fields[key]);
    }
  }

  if (updates.length === 0) return; // nada que actualizar

  values.push(id);
  await pool.query(
    `UPDATE usuarios SET ${updates.join(", ")} WHERE id = ?`,
    values
  );
}

// ─── Comunidades: listar todas ───────────────────────────────────────────────
async function findAllCommunities() {
  const [rows] = await pool.query(
    "SELECT id, nombre, dominio_email, descripcion FROM comunidades WHERE activa = TRUE ORDER BY nombre"
  );
  return rows;
}

// ─── Comunidades: listar las del usuario ────────────────────────────────────
async function findUserCommunities(userId) {
  const [rows] = await pool.query(
    `SELECT c.id, c.nombre, c.dominio_email, c.descripcion, uc.verified, uc.created_at AS joined_at
     FROM comunidades c
     INNER JOIN usuario_comunidad uc ON uc.community_id = c.id
     WHERE uc.user_id = ?
     ORDER BY c.nombre`,
    [userId]
  );
  return rows;
}

// ─── Comunidades: agregar una al usuario (ignora si ya existe) ───────────────
async function addUserCommunity(userId, communityId) {
  await pool.query(
    `INSERT IGNORE INTO usuario_comunidad (user_id, community_id, verified)
     VALUES (?, ?, FALSE)`,
    [userId, communityId]
  );
}

// ─── Comunidades: quitar una del usuario ────────────────────────────────────
async function removeUserCommunity(userId, communityId) {
  const [result] = await pool.query(
    "DELETE FROM usuario_comunidad WHERE user_id = ? AND community_id = ?",
    [userId, communityId]
  );
  return result.affectedRows > 0;
}

// ─── Comunidades: verificar que existe una comunidad por ID ─────────────────
async function findCommunityById(communityId) {
  const [rows] = await pool.query(
    "SELECT id, nombre FROM comunidades WHERE id = ? AND activa = TRUE LIMIT 1",
    [communityId]
  );
  return rows[0] || null;
}

module.exports = {
  findByEmail,
  findByNumeroId,
  findById,
  createUser,
  saveOtp,
  verifyEmail,
  updateUser,
  findAllCommunities,
  findUserCommunities,
  addUserCommunity,
  removeUserCommunity,
  findCommunityById,
};
