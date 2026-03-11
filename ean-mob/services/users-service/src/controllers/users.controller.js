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

module.exports = { getProfile, updateProfile };
