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

module.exports = {
  findByEmail,
  findByNumeroId,
  findById,
  createUser,
  saveOtp,
  verifyEmail,
};