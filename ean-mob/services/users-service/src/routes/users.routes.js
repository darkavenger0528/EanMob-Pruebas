const { Router } = require("express");
const usersController = require("../controllers/users.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { validateUpdateProfile } = require("../middlewares/validate.middleware");

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

module.exports = router;
