const usersRepo = require("../repositories/users.repo");
const emailService = require("./email.service");
const { BadRequestError, NotFoundError } = require("../utils/httpErrors");

function normalizeEmailDomain(domain) {
  return domain.trim().replace(/^@/, "").toLowerCase();
}

function userEmailBelongsToCommunity(correo, dominioEmail) {
  return correo.toLowerCase().endsWith(`@${normalizeEmailDomain(dominioEmail)}`);
}

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

// ─── GET COMMUNITIES (todas disponibles) ─────────────────────────────────────
async function getAllCommunities() {
  return usersRepo.findAllCommunities();
}

// ─── GET USER COMMUNITIES ─────────────────────────────────────────────────────
async function getUserCommunities(userId) {
  const user = await usersRepo.findById(userId);
  if (!user) throw new NotFoundError("Usuario no encontrado");
  return usersRepo.findUserCommunities(userId);
}

// ─── ADD COMMUNITY AL USUARIO ────────────────────────────────────────────────
async function addUserCommunity(userId, communityId) {
  const user = await usersRepo.findById(userId);
  if (!user) throw new NotFoundError("Usuario no encontrado");

  const community = await usersRepo.findCommunityById(communityId);
  if (!community) throw new NotFoundError("Comunidad no encontrada o inactiva");

  if (!userEmailBelongsToCommunity(user.correo, community.dominio_email)) {
    throw new BadRequestError("El correo del usuario no pertenece al dominio de la comunidad");
  }

  const currentMembership = await usersRepo.findUserCommunity(userId, communityId);
  if (currentMembership?.verified) {
    return {
      message: "La comunidad ya está verificada en tu perfil.",
      communities: await usersRepo.findUserCommunities(userId),
    };
  }

  const otp = emailService.generateOtp();
  const otp_expires_at = emailService.getOtpExpiry();

  await usersRepo.addUserCommunity(userId, communityId, otp, otp_expires_at);
  await emailService.sendOtpEmail(user.correo, otp, user.nombre_completo);

  return {
    message: "Comunidad agregada. Revisa tu correo para verificar tu pertenencia.",
    communities: await usersRepo.findUserCommunities(userId),
  };
}

// ─── REMOVE COMMUNITY DEL USUARIO ────────────────────────────────────────────
async function removeUserCommunity(userId, communityId) {
  const user = await usersRepo.findById(userId);
  if (!user) throw new NotFoundError("Usuario no encontrado");

  const removed = await usersRepo.removeUserCommunity(userId, communityId);
  if (!removed) throw new NotFoundError("El usuario no pertenece a esa comunidad");

  return usersRepo.findUserCommunities(userId);
}

// ─── RESEND COMMUNITY OTP ───────────────────────────────────────────────────
async function resendCommunityOtp(userId, communityId) {
  const user = await usersRepo.findById(userId);
  if (!user) throw new NotFoundError("Usuario no encontrado");

  const membership = await usersRepo.findUserCommunity(userId, communityId);
  if (!membership) throw new NotFoundError("El usuario no pertenece a esa comunidad");
  if (membership.verified) throw new BadRequestError("La comunidad ya está verificada");

  const otp = emailService.generateOtp();
  const otp_expires_at = emailService.getOtpExpiry();

  await usersRepo.saveCommunityOtp(userId, communityId, otp, otp_expires_at);
  await emailService.sendOtpEmail(user.correo, otp, user.nombre_completo);

  return { message: "Nuevo código OTP enviado al correo asociado a la comunidad." };
}

// ─── VERIFY COMMUNITY OTP ───────────────────────────────────────────────────
async function verifyCommunityOtp(userId, communityId, otp) {
  const user = await usersRepo.findById(userId);
  if (!user) throw new NotFoundError("Usuario no encontrado");

  const membership = await usersRepo.findUserCommunity(userId, communityId);
  if (!membership) throw new NotFoundError("El usuario no pertenece a esa comunidad");
  if (membership.verified) throw new BadRequestError("La comunidad ya está verificada");
  if (membership.otp !== otp) throw new BadRequestError("Código OTP incorrecto");

  const now = new Date();
  if (!membership.otp_expires_at || new Date(membership.otp_expires_at) < now) {
    throw new BadRequestError("El código OTP ha expirado. Solicita uno nuevo.");
  }

  await usersRepo.verifyUserCommunity(userId, communityId);

  return {
    message: "Comunidad verificada correctamente.",
    communities: await usersRepo.findUserCommunities(userId),
  };
}

module.exports = {
  getProfile,
  updateProfile,
  getAllCommunities,
  getUserCommunities,
  addUserCommunity,
  removeUserCommunity,
  resendCommunityOtp,
  verifyCommunityOtp,
};
