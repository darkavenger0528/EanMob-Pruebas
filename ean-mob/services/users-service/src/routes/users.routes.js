const { Router } = require("express");
const usersController = require("../controllers/users.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const {
  validateUpdateProfile,
  validateAddCommunity,
  validateVerifyCommunityOtp,
} = require("../middlewares/validate.middleware");

const router = Router();

/**
 * @route  GET /api/users/profile
 * @desc   Obtener perfil del usuario autenticado
 * @access Privado — requiere Bearer token
 */
router.get("/profile", authMiddleware, usersController.getProfile);

/**
 * @route  PUT /api/users/profile
 * @desc   Actualizar perfil del usuario autenticado
 * @access Privado — requiere Bearer token
 */
router.put("/profile", authMiddleware, validateUpdateProfile, usersController.updateProfile);

/**
 * @route  GET /api/users/communities
 * @desc   Listar todas las comunidades disponibles
 * @access Privado — requiere Bearer token
 */
router.get("/communities", authMiddleware, usersController.getAllCommunities);

/**
 * @route  GET /api/users/profile/communities
 * @desc   Listar las comunidades a las que pertenece el usuario autenticado
 * @access Privado — requiere Bearer token
 */
router.get("/profile/communities", authMiddleware, usersController.getUserCommunities);

/**
 * @route  POST /api/users/profile/communities
 * @desc   Agregar el usuario autenticado a una comunidad { community_id }
 * @access Privado — requiere Bearer token
 */
router.post("/profile/communities", authMiddleware, validateAddCommunity, usersController.addUserCommunity);

/**
 * @route  POST /api/users/profile/communities/:communityId/resend-otp
 * @desc   Reenviar OTP para verificar pertenencia a una comunidad
 * @access Privado — requiere Bearer token
 */
router.post("/profile/communities/:communityId/resend-otp", authMiddleware, usersController.resendCommunityOtp);

/**
 * @route  POST /api/users/profile/communities/:communityId/verify-otp
 * @desc   Verificar OTP para confirmar pertenencia a una comunidad
 * @access Privado — requiere Bearer token
 */
router.post(
  "/profile/communities/:communityId/verify-otp",
  authMiddleware,
  validateVerifyCommunityOtp,
  usersController.verifyCommunityOtp
);

/**
 * @route  DELETE /api/users/profile/communities/:communityId
 * @desc   Quitar el usuario autenticado de una comunidad
 * @access Privado — requiere Bearer token
 */
router.delete("/profile/communities/:communityId", authMiddleware, usersController.removeUserCommunity);

module.exports = router;
