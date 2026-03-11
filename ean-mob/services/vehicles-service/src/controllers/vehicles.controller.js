const vehiclesService = require("../services/vehicles.service");

// ─── POST /api/vehicles ───────────────────────────────────────────────────────
async function create(req, res, next) {
  try {
    const vehicle = await vehiclesService.create(req.body, req.user.sub);
    res.status(201).json(vehicle);
  } catch (e) { next(e); }
}

// ─── GET /api/vehicles/my ─────────────────────────────────────────────────────
async function getMyVehicles(req, res, next) {
  try {
    const vehicles = await vehiclesService.getMyVehicles(req.user.sub);
    res.json(vehicles);
  } catch (e) { next(e); }
}

// ─── GET /api/vehicles/:id ────────────────────────────────────────────────────
async function getById(req, res, next) {
  try {
    const vehicle = await vehiclesService.getById(Number(req.params.id));
    res.json(vehicle);
  } catch (e) { next(e); }
}

// ─── PUT /api/vehicles/:id ────────────────────────────────────────────────────
async function update(req, res, next) {
  try {
    const vehicle = await vehiclesService.update(
      Number(req.params.id), req.body, req.user.sub
    );
    res.json(vehicle);
  } catch (e) { next(e); }
}

// ─── DELETE /api/vehicles/:id ─────────────────────────────────────────────────
async function remove(req, res, next) {
  try {
    const result = await vehiclesService.remove(
      Number(req.params.id), req.user.sub
    );
    res.json(result);
  } catch (e) { next(e); }
}

// ─── POST /api/vehicles/:id/verify-rtm ───────────────────────────────────────
async function recheckRTM(req, res, next) {
  try {
    const vehicle = await vehiclesService.recheckRTM(
      Number(req.params.id), req.user.sub
    );
    res.json(vehicle);
  } catch (e) { next(e); }
}

module.exports = { create, getMyVehicles, getById, update, remove, recheckRTM };
