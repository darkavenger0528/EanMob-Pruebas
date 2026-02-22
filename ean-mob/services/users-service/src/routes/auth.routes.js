const { Router } = require("express");
const authController = require("../controllers/auth.controller");
const {
  validateRegister,
  validateVerifyOtp,
  validateResendOtp,
  validateLogin,
} = require("../middlewares/validate.middleware");

const router = Router();

/**
 * @route  POST /api/auth/register
 * @desc   Registrar nuevo usuario con correo @universidadean.edu.co
 * @access Public
 */
router.post("/register", validateRegister, authController.register);

/**
 * @route  POST /api/auth/verify-otp
 * @desc   Verificar el OTP enviado al correo
 * @access Public
 */
router.post("/verify-otp", validateVerifyOtp, authController.verifyOtp);

/**
 * @route  POST /api/auth/resend-otp
 * @desc   Reenviar OTP al correo
 * @access Public
 */
router.post("/resend-otp", validateResendOtp, authController.resendOtp);

/**
 * @route  POST /api/auth/login
 * @desc   Login con correo y contraseña, retorna JWT
 * @access Public
 */
router.post("/login", validateLogin, authController.login);

module.exports = router;