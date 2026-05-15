const { httpError } = require("../utils/httpErrors");
const tripsRepo = require("../repositories/trips.repo");

async function create(trip, user) {
  const conductorId = user?.sub ?? trip.conductor_id;
  if (!conductorId) throw httpError(401, "Conductor no autenticado");

  const payload = {
    conductor_id: Number(conductorId),
    nombre_prestador: user?.correo ?? trip.nombre_prestador ?? "",
    origen: trip.origen ?? trip.origin_address,
    destino: trip.destino ?? trip.destination_address,
    hora_inicio: trip.hora_inicio ?? trip.departure_datetime,
    hora_fin: trip.hora_fin ?? null,
    vehicle_id: trip.vehicle_id,
    available_seats: trip.available_seats,
    cost_per_passenger: trip.cost_per_passenger ?? null,
    status: "open",
    origin_h3: trip.origin_h3 ?? null,
    destination_h3: trip.destination_h3 ?? null,
    origin_lat: trip.origin_lat ?? null,
    origin_lng: trip.origin_lng ?? null,
    destination_lat: trip.destination_lat ?? null,
    destination_lng: trip.destination_lng ?? null,
    notes: trip.notes ?? null,
  };

  const id = await tripsRepo.createTrip(payload);
  const created = await tripsRepo.findById(id);
  return {
    id,
    trip: created,
    message: "Viaje publicado correctamente",
  };
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
