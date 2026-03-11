const usersRepo = require("../repositories/users.repo");
const { NotFoundError } = require("../utils/httpErrors");

// ─── GET PROFILE ─────────────────────────────────────────────────────────────
async function getProfile(userId) {
  const user = await usersRepo.findById(userId);
  if (!user) throw new NotFoundError("Usuario no encontrado");

  // Nunca devolver password_hash ni campos OTP al cliente
  const {
    password_hash,
    otp,
    otp_expires_at,
    ...profile
  } = user;

  return profile;
}

// ─── UPDATE PROFILE ───────────────────────────────────────────────────────────
async function updateProfile(userId, data) {
  const user = await usersRepo.findById(userId);
  if (!user) throw new NotFoundError("Usuario no encontrado");

  await usersRepo.updateUser(userId, data);

  // Retornar perfil actualizado
  return getProfile(userId);
}

module.exports = { getProfile, updateProfile };
