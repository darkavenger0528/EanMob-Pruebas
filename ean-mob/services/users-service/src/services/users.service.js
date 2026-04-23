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

  await usersRepo.addUserCommunity(userId, communityId);
  return usersRepo.findUserCommunities(userId);
}

// ─── REMOVE COMMUNITY DEL USUARIO ────────────────────────────────────────────
async function removeUserCommunity(userId, communityId) {
  const user = await usersRepo.findById(userId);
  if (!user) throw new NotFoundError("Usuario no encontrado");

  const removed = await usersRepo.removeUserCommunity(userId, communityId);
  if (!removed) throw new NotFoundError("El usuario no pertenece a esa comunidad");

  return usersRepo.findUserCommunities(userId);
}

module.exports = { getProfile, updateProfile, getAllCommunities, getUserCommunities, addUserCommunity, removeUserCommunity };
