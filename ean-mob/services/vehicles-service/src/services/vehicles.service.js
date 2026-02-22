const { httpError } = require("../utils/httpErrors");
const vehiclesRepo = require("../repositories/vehicles.repo");

async function create(vehicle) {
  // Aquí podrías hacer validaciones básicas
  const id = await vehiclesRepo.createVehicle(vehicle);
  return { id };
}

async function getById(id) {
  const vehicle = await vehiclesRepo.findById(id);
  if (!vehicle) throw httpError(404, "Vehicle not found");
  return vehicle;
}

async function getByUser(userId) {
  return vehiclesRepo.findAllByUser(userId);
}

async function remove(id) {
  const ok = await vehiclesRepo.remove(id);
  if (!ok) throw httpError(404, "Vehicle not found");
}

module.exports = { create, getById, getByUser, remove };
