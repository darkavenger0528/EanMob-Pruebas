const authService = require("../services/auth.service");

// ─── POST /api/auth/register ─────────────────────────────────────────────────
async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

// ─── POST /api/auth/verify-otp ───────────────────────────────────────────────
async function verifyOtp(req, res, next) {
  try {
    const { correo, otp } = req.body;
    const result = await authService.verifyOtp(correo, otp);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// ─── POST /api/auth/resend-otp ───────────────────────────────────────────────
async function resendOtp(req, res, next) {
  try {
    const { correo } = req.body;
    const result = await authService.resendOtp(correo);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// ─── POST /api/auth/login ────────────────────────────────────────────────────
async function login(req, res, next) {
  try {
    const { correo, password } = req.body;
    const result = await authService.login(correo, password);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { register, verifyOtp, resendOtp, login };