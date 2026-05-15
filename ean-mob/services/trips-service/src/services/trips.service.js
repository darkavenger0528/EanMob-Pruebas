const { httpError } = require("../utils/httpErrors");
const tripsRepo = require("../repositories/trips.repo");
const vehiclesRepo = require("../repositories/vehicles.repo");
const picoPlacaService = require("./picoPlaca.service");

const PICO_UNAVAILABLE_MESSAGE =
  "No fue posible verificar pico y placa en este momento";
const VEHICLE_NOT_FOUND_MESSAGE =
  "No fue posible verificar pico y placa porque el vehiculo seleccionado no fue encontrado";

function buildPicoWarning(result) {
  if (!result?.available) {
    return {
      available: false,
      restricted: null,
      warnings: [],
      message: result?.warning || PICO_UNAVAILABLE_MESSAGE,
    };
  }

  const data = result.data || {};
  const warnings = Array.isArray(data.warnings)
    ? data.warnings
    : data.warning
      ? [data.warning]
      : [];
  const restricted =
    typeof data.restricted === "boolean" ? data.restricted : null;
  const message = data.message || result.warning || null;

  if (!restricted && warnings.length === 0 && !message) return null;

  return {
    available: true,
    restricted,
    warnings,
    message,
  };
}

async function getPicoPlacaWarning(payload) {
  try {
    const vehicle = await vehiclesRepo.findById(payload.vehicle_id);
    if (!vehicle) {
      return {
        available: false,
        restricted: null,
        warnings: [],
        message: VEHICLE_NOT_FOUND_MESSAGE,
      };
    }

    const result = await picoPlacaService.checkPicoPlaca({
      plate: vehicle.placa,
      datetime: payload.hora_inicio,
      vehicleType: vehicle.tipo_vehiculo,
    });
    return buildPicoWarning(result);
  } catch (_error) {
    return {
      available: false,
      restricted: null,
      warnings: [],
      message: PICO_UNAVAILABLE_MESSAGE,
    };
  }
}

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

  const picoPlacaWarning = await getPicoPlacaWarning(payload);
  const id = await tripsRepo.createTrip(payload);
  const created = await tripsRepo.findById(id);
  return {
    id,
    trip: created,
    message: "Viaje publicado correctamente",
    pico_placa_warning: picoPlacaWarning,
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
