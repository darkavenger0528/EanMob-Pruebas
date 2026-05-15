const tripsService = require("../services/trips.service");

async function create(req, res, next) {
  try {
    const result = await tripsService.create(req.body, req.user);
    res.status(201).json({
      success: true,
      data: result,
      message: result.message,
    });
  } catch (e) {
    next(e);
  }
}

async function getById(req, res, next) {
  try {
    const trip = await tripsService.getById(Number(req.params.id));
    res.json({ success: true, data: trip });
  } catch (e) {
    next(e);
  }
}

async function getByDriver(req, res, next) {
  try {
    const trips = await tripsService.getByDriver(Number(req.params.conductorId));
    res.json({ success: true, data: trips });
  } catch (e) {
    next(e);
  }
}

module.exports = { create, getById, getByDriver };
