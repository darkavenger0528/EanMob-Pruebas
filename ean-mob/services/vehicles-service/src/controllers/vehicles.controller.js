const vehiclesService = require("../services/vehicles.service");

async function create(req, res, next) {
  try {
    const id = await vehiclesService.create(req.body);
    res.status(201).json(id);
  } catch (e) {
    next(e);
  }
}

async function getById(req, res, next) {
  try {
    const vehicle = await vehiclesService.getById(Number(req.params.id));
    res.json(vehicle);
  } catch (e) {
    next(e);
  }
}

async function getByUser(req, res, next) {
  try {
    const vehicles = await vehiclesService.getByUser(Number(req.params.userId));
    res.json(vehicles);
  } catch (e) {
    next(e);
  }
}

async function remove(req, res, next) {
  try {
    await vehiclesService.remove(Number(req.params.id));
    res.status(204).send();
  } catch (e) {
    next(e);
  }
}

module.exports = {
  create,
  getById,
  getByUser,
  remove
};
