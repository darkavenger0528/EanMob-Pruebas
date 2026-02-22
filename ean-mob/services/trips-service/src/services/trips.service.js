const { httpError } = require("../utils/httpErrors");
const tripsRepo = require("../repositories/trips.repo");

async function create(trip) {
  const id = await tripsRepo.createTrip(trip);
  return { id };
}

async function getById(id) {
  const trip = await tripsRepo.findById(id);
  if (!trip) throw httpError(404, "Trip not found");
  return trip;
}

async function getByDriver(conductorId) {
  return tripsRepo.findAllByDriver(conductorId);
}

module.exports = { create, getById, getByDriver };
