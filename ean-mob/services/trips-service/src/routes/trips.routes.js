const express = require("express");
const tripsController = require("../controllers/trips.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { validateCreateTrip } = require("../middlewares/validate.middleware");

const router = express.Router();

// Versioned API
router.post("/api/v1/trips", authMiddleware, validateCreateTrip, tripsController.create);
router.get("/api/v1/trips/:id", tripsController.getById);
router.get("/api/v1/drivers/:conductorId/trips", tripsController.getByDriver);

// Legacy paths kept as aliases while consumers migrate to /api/v1.
router.post("/trips", validateCreateTrip, tripsController.create);

// GET /trips/:id
router.get("/trips/:id", tripsController.getById);

// GET /drivers/:conductorId/trips
router.get("/drivers/:conductorId/trips", tripsController.getByDriver);

module.exports = router;
