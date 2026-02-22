const tripsService = require("../services/trips.service");

async function create(req, res, next) {
  try {
    const id = await tripsService.create(req.body);
    res.status(201).json(id);
  } catch (e) {
    next(e);
  }
}

async function getById(req, res, next) {
  try {
    const trip = await tripsService.getById(Number(req.params.id));
    res.json(trip);
  } catch (e) {
    next(e);
  }
}

async function getByDriver(req, res, next) {
  try {
    const trips = await tripsService.getByDriver(Number(req.params.conductorId));
    res.json(trips);
  } catch (e) {
    next(e);
  }
}

module.exports = { create, getById, getByDriver };
