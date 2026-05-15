const usersService = require("../services/users.service");

// ─── GET /api/users/profile ──────────────────────────────────────────────────
async function getProfile(req, res, next) {
  try {
    const profile = await usersService.getProfile(req.user.sub);
    res.status(200).json(profile);
  } catch (err) {
    next(err);
  }
}

// ─── PUT /api/users/profile ──────────────────────────────────────────────────
async function updateProfile(req, res, next) {
  try {
    const updated = await usersService.updateProfile(req.user.sub, req.body);
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/users/communities ─────────────────────────────────────────────
async function getAllCommunities(req, res, next) {
  try {
    const communities = await usersService.getAllCommunities();
    res.status(200).json(communities);
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/users/profile/communities ─────────────────────────────────────
async function getUserCommunities(req, res, next) {
  try {
    const communities = await usersService.getUserCommunities(req.user.sub);
    res.status(200).json(communities);
  } catch (err) {
    next(err);
  }
}

// ─── POST /api/users/profile/communities ────────────────────────────────────
async function addUserCommunity(req, res, next) {
  try {
    const communities = await usersService.addUserCommunity(req.user.sub, req.body.community_id);
    res.status(200).json(communities);
  } catch (err) {
    next(err);
  }
}

// ─── DELETE /api/users/profile/communities/:communityId ─────────────────────
async function removeUserCommunity(req, res, next) {
  try {
    const communityId = parseInt(req.params.communityId, 10);
    if (isNaN(communityId)) return res.status(400).json({ error: "communityId inválido" });

    const communities = await usersService.removeUserCommunity(req.user.sub, communityId);
    res.status(200).json(communities);
  } catch (err) {
    next(err);
  }
}

// ─── POST /api/users/profile/communities/:communityId/resend-otp ───────────
async function resendCommunityOtp(req, res, next) {
  try {
    const communityId = parseInt(req.params.communityId, 10);
    if (isNaN(communityId)) return res.status(400).json({ error: "communityId inválido" });

    const result = await usersService.resendCommunityOtp(req.user.sub, communityId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// ─── POST /api/users/profile/communities/:communityId/verify-otp ───────────
async function verifyCommunityOtp(req, res, next) {
  try {
    const communityId = parseInt(req.params.communityId, 10);
    if (isNaN(communityId)) return res.status(400).json({ error: "communityId inválido" });

    const result = await usersService.verifyCommunityOtp(req.user.sub, communityId, req.body.otp);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
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
