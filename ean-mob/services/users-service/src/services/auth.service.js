const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const usersRepo = require("../repositories/users.repo");
const { generateOtp, getOtpExpiry, sendOtpEmail } = require("../utils/email.service");
const env = require("../config/env");
const {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
  NotFoundError,
} = require("../utils/httpErrors");

const EAN_DOMAIN = "@universidadean.edu.co";

// ─── REGISTRO ────────────────────────────────────────────────────────────────
async function register(data) {
  const {
    nombre_completo,
    fecha_nacimiento,
    tipo_documento,
    numero_identificacion,
    correo,
    rol,
    password,
    grupo_sanguineo,
    sexo,
    altura_cm,
    peso_kg,
  } = data;

  // 1. Validar dominio universitario
  if (!correo.toLowerCase().endsWith(EAN_DOMAIN)) {
    throw new BadRequestError(
      `Solo se permiten correos institucionales que terminen en ${EAN_DOMAIN}`
    );
  }

  // 2. Verificar duplicados
  const existingEmail = await usersRepo.findByEmail(correo);
  if (existingEmail) throw new ConflictError("El correo ya está registrado");

  const existingDoc = await usersRepo.findByNumeroId(numero_identificacion);
  if (existingDoc) throw new ConflictError("El número de identificación ya está registrado");

  // 3. Hashear contraseña
  const password_hash = await bcrypt.hash(password, 12);

  // 4. Generar OTP
  const otp = generateOtp();
  const otp_expires_at = getOtpExpiry();

  // 5. Crear usuario (email_verified = false)
  const userId = await usersRepo.createUser({
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
  });

  // 6. Enviar OTP por correo
  await sendOtpEmail(correo, otp, nombre_completo);

  return { userId, message: `Registro exitoso. Revisa tu correo ${correo} para verificar tu cuenta.` };
}

// ─── VERIFICAR OTP ───────────────────────────────────────────────────────────
async function verifyOtp(correo, otp) {
  const user = await usersRepo.findByEmail(correo);
  if (!user) throw new NotFoundError("Usuario no encontrado");

  if (user.email_verified) {
    throw new BadRequestError("El correo ya fue verificado anteriormente");
  }

  if (!user.otp || !user.otp_expires_at) {
    throw new BadRequestError("No hay un OTP activo para este correo");
  }

  // Verificar expiración
  const now = new Date();
  const expiry = new Date(user.otp_expires_at);
  if (now > expiry) {
    throw new BadRequestError("El OTP ha expirado. Solicita uno nuevo.");
  }

  // Verificar código
  if (user.otp !== String(otp)) {
    throw new UnauthorizedError("Código OTP incorrecto");
  }

  // Marcar email como verificado
  await usersRepo.verifyEmail(correo);

  return { message: "Correo verificado exitosamente. Ya puedes iniciar sesión." };
}

// ─── REENVIAR OTP ────────────────────────────────────────────────────────────
async function resendOtp(correo) {
  const user = await usersRepo.findByEmail(correo);
  if (!user) throw new NotFoundError("Usuario no encontrado");

  if (user.email_verified) {
    throw new BadRequestError("El correo ya fue verificado");
  }

  const otp = generateOtp();
  const otp_expires_at = getOtpExpiry();

  await usersRepo.saveOtp(correo, otp, otp_expires_at);
  await sendOtpEmail(correo, otp, user.nombre_completo);

  return { message: "Se envió un nuevo código OTP a tu correo." };
}

// ─── LOGIN ───────────────────────────────────────────────────────────────────
async function login(correo, password) {
  const user = await usersRepo.findByEmail(correo);
  if (!user) throw new UnauthorizedError("Credenciales incorrectas");

  // Verificar que el email esté validado
  if (!user.email_verified) {
    throw new UnauthorizedError("Debes verificar tu correo antes de iniciar sesión");
  }

  // Verificar contraseña
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new UnauthorizedError("Credenciales incorrectas");

  // Generar JWT
  const payload = {
    sub: user.id,
    correo: user.correo,
    rol: user.rol,
    nombre: user.nombre_completo,
  };

  const token = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });

  return {
    token,
    user: {
      id: user.id,
      nombre_completo: user.nombre_completo,
      correo: user.correo,
      rol: user.rol,
    },
  };
}

module.exports = { register, verifyOtp, resendOtp, login };