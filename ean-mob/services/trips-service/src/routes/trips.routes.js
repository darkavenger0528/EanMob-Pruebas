const express = require("express");
const tripsController = require("../controllers/trips.controller");

const router = express.Router();

// POST /trips
router.post("/trips", tripsController.create);

// GET /trips/:id
router.get("/trips/:id", tripsController.getById);

// GET /drivers/:conductorId/trips
router.get("/drivers/:conductorId/trips", tripsController.getByDriver);

module.exports = router;
