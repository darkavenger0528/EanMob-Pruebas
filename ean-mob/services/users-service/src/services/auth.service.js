const bcrypt         = require("bcryptjs");
const jwt            = require("jsonwebtoken");
const env            = require("../config/env");
const usersRepo      = require("../repositories/users.repo");
const emailService   = require("./email.service");
const {
  BadRequestError,
  UnauthorizedError,
  ConflictError,
  NotFoundError,
} = require("../utils/httpErrors");

// ─── REGISTER ────────────────────────────────────────────────────────────────
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

  // 1. Verificar duplicados
  const existeCorreo = await usersRepo.findByEmail(correo);
  if (existeCorreo) throw new ConflictError("El correo ya está registrado");

  const existeDoc = await usersRepo.findByNumeroId(numero_identificacion);
  if (existeDoc) throw new ConflictError("El número de identificación ya está registrado");

  // 2. Hash de contraseña
  const password_hash = await bcrypt.hash(password, 10);

  // 3. Generar OTP
  const otp           = emailService.generateOtp();
  const otp_expires_at = emailService.getOtpExpiry();

  // 4. Crear usuario en DB (email_verified = FALSE)
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

  // 5. Enviar OTP por correo
  await emailService.sendOtpEmail(correo, otp, nombre_completo);

  return {
    message: "Usuario registrado. Revisa tu correo institucional para verificar tu cuenta.",
    userId,
  };
}

// ─── VERIFY OTP ──────────────────────────────────────────────────────────────
async function verifyOtp(correo, otp) {
  const user = await usersRepo.findByEmail(correo);

  if (!user)                    throw new NotFoundError("Usuario no encontrado");
  if (user.email_verified)      throw new BadRequestError("El correo ya está verificado");
  if (user.otp !== otp)         throw new BadRequestError("Código OTP incorrecto");

  const now = new Date();
  if (new Date(user.otp_expires_at) < now) {
    throw new BadRequestError("El código OTP ha expirado. Solicita uno nuevo.");
  }

  // Marcar como verificado y limpiar OTP
  await usersRepo.verifyEmail(correo);

  return { message: "Correo verificado correctamente. Ya puedes iniciar sesión." };
}

// ─── RESEND OTP ───────────────────────────────────────────────────────────────
async function resendOtp(correo) {
  const user = await usersRepo.findByEmail(correo);

  if (!user)               throw new NotFoundError("Usuario no encontrado");
  if (user.email_verified) throw new BadRequestError("El correo ya está verificado");

  const otp            = emailService.generateOtp();
  const otp_expires_at = emailService.getOtpExpiry();

  await usersRepo.saveOtp(correo, otp, otp_expires_at);
  await emailService.sendOtpEmail(correo, otp, user.nombre_completo);

  return { message: "Nuevo código OTP enviado a tu correo institucional." };
}

// ─── LOGIN ───────────────────────────────────────────────────────────────────
async function login(correo, password) {
  const user = await usersRepo.findByEmail(correo);

  if (!user) throw new UnauthorizedError("Credenciales incorrectas");

  const passwordOk = await bcrypt.compare(password, user.password_hash);
  if (!passwordOk) throw new UnauthorizedError("Credenciales incorrectas");

  if (!user.email_verified) {
    throw new UnauthorizedError("Debes verificar tu correo antes de iniciar sesión");
  }

  const token = jwt.sign(
    {
      sub:  user.id,
      rol:  user.rol,
      correo: user.correo,
    },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );

  return {
    message: "Login exitoso",
    token,
    user: {
      id:              user.id,
      nombre_completo: user.nombre_completo,
      correo:          user.correo,
      rol:             user.rol,
    },
  };
}

module.exports = { register, verifyOtp, resendOtp, login };
