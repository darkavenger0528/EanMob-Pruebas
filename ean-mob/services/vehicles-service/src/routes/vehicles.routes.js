const { Router } = require("express");
const vehiclesController = require("../controllers/vehicles.controller");
const { authMiddleware }  = require("../middlewares/auth.middleware");
const { validateCreateVehicle, validateUpdateVehicle } = require("../middlewares/validate.middleware");

const router = Router();

/**
 * @route  POST /api/vehicles
 * @desc   Registrar nuevo vehículo (verifica RTM automáticamente)
 * @access Privado
 */
router.post("/",     authMiddleware, validateCreateVehicle, vehiclesController.create);

/**
 * @route  GET /api/vehicles/my
 * @desc   Obtener todos mis vehículos
 * @access Privado
 */
router.get("/my",    authMiddleware, vehiclesController.getMyVehicles);

/**
 * @route  GET /api/vehicles/:id
 * @desc   Obtener vehículo por ID
 * @access Privado
 */
router.get("/:id",   authMiddleware, vehiclesController.getById);

/**
 * @route  PUT /api/vehicles/:id
 * @desc   Actualizar vehículo (solo el dueño)
 * @access Privado
 */
router.put("/:id",   authMiddleware, validateUpdateVehicle, vehiclesController.update);

/**
 * @route  DELETE /api/vehicles/:id
 * @desc   Eliminar vehículo (solo el dueño)
 * @access Privado
 */
router.delete("/:id", authMiddleware, vehiclesController.remove);

/**
 * @route  POST /api/vehicles/:id/verify-rtm
 * @desc   Re-verificar RTM de un vehículo
 * @access Privado
 */
router.post("/:id/verify-rtm", authMiddleware, vehiclesController.recheckRTM);

module.exports = router;
