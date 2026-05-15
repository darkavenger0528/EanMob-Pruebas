const { z } = require("zod");

const coordinate = z.number().finite();

const createTripSchema = z.object({
  origin_address: z.string().trim().min(3).max(200).optional(),
  destination_address: z.string().trim().min(3).max(200).optional(),
  departure_datetime: z.string().trim().min(1).optional(),
  origen: z.string().trim().min(3).max(200).optional(),
  destino: z.string().trim().min(3).max(200).optional(),
  hora_inicio: z.string().trim().min(1).optional(),
  hora_fin: z.string().trim().min(1).nullable().optional(),
  conductor_id: z.number().int().positive().optional(),
  nombre_prestador: z.string().trim().min(3).max(100).optional(),
  vehicle_id: z.number().int().positive(),
  available_seats: z.number().int().min(1).max(8),
  cost_per_passenger: z.number().min(0).nullable().optional(),
  origin_h3: z.string().trim().min(1).max(20).nullable().optional(),
  destination_h3: z.string().trim().min(1).max(20).nullable().optional(),
  origin_lat: coordinate.min(-90).max(90).nullable().optional(),
  origin_lng: coordinate.min(-180).max(180).nullable().optional(),
  destination_lat: coordinate.min(-90).max(90).nullable().optional(),
  destination_lng: coordinate.min(-180).max(180).nullable().optional(),
  notes: z.string().trim().max(500).nullable().optional(),
}).strict();

function toValidationError(field, message) {
  return { field, message };
}

function validateCreateTrip(req, res, next) {
  const result = createTripSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: "Validation Error",
      details: result.error.errors.map((e) => toValidationError(e.path.join("."), e.message)),
    });
  }

  const data = result.data;
  const origen = data.origen ?? data.origin_address;
  const destino = data.destino ?? data.destination_address;
  const horaInicio = data.hora_inicio ?? data.departure_datetime;
  const details = [];

  if (!origen) details.push(toValidationError("origin_address", "Origen requerido"));
  if (!destino) details.push(toValidationError("destination_address", "Destino requerido"));
  if (!horaInicio) details.push(toValidationError("departure_datetime", "Fecha y hora de salida requeridas"));
  if (horaInicio && Number.isNaN(new Date(horaInicio).getTime())) {
    details.push(toValidationError("departure_datetime", "Fecha y hora de salida inválidas"));
  }
  if (data.hora_fin && Number.isNaN(new Date(data.hora_fin).getTime())) {
    details.push(toValidationError("hora_fin", "Fecha y hora de finalización inválidas"));
  }

  if (details.length > 0) {
    return res.status(400).json({ error: "Validation Error", details });
  }

  req.body = {
    ...data,
    origen,
    destino,
    hora_inicio: new Date(horaInicio).toISOString(),
    hora_fin: data.hora_fin ? new Date(data.hora_fin).toISOString() : null,
  };
  return next();
}

module.exports = { validateCreateTrip };
