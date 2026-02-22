const express = require("express");
const vehiclesController = require("../controllers/vehicles.controller");

const router = express.Router();

// POST /vehicles
router.post("/vehicles", vehiclesController.create);

// GET /vehicles/:id
router.get("/vehicles/:id", vehiclesController.getById);

// GET /users/:userId/vehicles
router.get("/users/:userId/vehicles", vehiclesController.getByUser);

// DELETE /vehicles/:id
router.delete("/vehicles/:id", vehiclesController.remove);

module.exports = router;
