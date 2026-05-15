const { z } = require("zod");

const coordinate = z.number().finite();
const nullableCoordinate = coordinate.min(-180).max(180).nullable().optional();

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

const searchRequestBaseSchema = {
  origin_address: z.string().trim().min(3).max(200).optional(),
  destination_address: z.string().trim().min(3).max(200).optional(),
  departure_datetime: z.string().trim().min(1).optional(),
  origen: z.string().trim().min(3).max(200).optional(),
  destino: z.string().trim().min(3).max(200).optional(),
  hora_salida_estimada: z.string().trim().min(1).optional(),
  origin_h3: z.string().trim().min(1).max(20).nullable().optional(),
  destination_h3: z.string().trim().min(1).max(20).nullable().optional(),
  origin_lat: nullableCoordinate,
  origin_lng: nullableCoordinate,
  destination_lat: nullableCoordinate,
  destination_lng: nullableCoordinate,
};

const createSearchRequestSchema = z.object(searchRequestBaseSchema).strict();
const updateSearchRequestSchema = z.object({
  ...searchRequestBaseSchema,
  activa: z.boolean().optional(),
}).strict().refine((data) => Object.keys(data).length > 0, {
  message: "Debe enviar al menos un campo para actualizar",
});

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

function normalizeSearchRequest(data, { partial = false } = {}) {
  const origen = data.origen ?? data.origin_address;
  const destino = data.destino ?? data.destination_address;
  const horaSalida = data.hora_salida_estimada ?? data.departure_datetime;
  const details = [];

  if (!partial || origen !== undefined) {
    if (!origen) details.push(toValidationError("origin_address", "Origen requerido"));
  }
  if (!partial || destino !== undefined) {
    if (!destino) details.push(toValidationError("destination_address", "Destino requerido"));
  }
  if (!partial || horaSalida !== undefined) {
    if (!horaSalida) details.push(toValidationError("departure_datetime", "Fecha y hora estimada de salida requerida"));
  }
  if (horaSalida && Number.isNaN(new Date(horaSalida).getTime())) {
    details.push(toValidationError("departure_datetime", "Fecha y hora estimada de salida inválida"));
  }

  if (details.length > 0) return { details };

  const normalized = { ...data };
  delete normalized.origin_address;
  delete normalized.destination_address;
  delete normalized.departure_datetime;
  if (origen !== undefined) normalized.origen = origen.trim();
  if (destino !== undefined) normalized.destino = destino.trim();
  if (horaSalida !== undefined) normalized.hora_salida_estimada = new Date(horaSalida).toISOString();

  return { normalized };
}

function validateCreateSearchRequest(req, res, next) {
  const result = createSearchRequestSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: "Validation Error",
      details: result.error.errors.map((e) => toValidationError(e.path.join("."), e.message)),
    });
  }

  const { normalized, details } = normalizeSearchRequest(result.data);
  if (details) return res.status(400).json({ error: "Validation Error", details });

  req.body = normalized;
  return next();
}

function validateUpdateSearchRequest(req, res, next) {
  const result = updateSearchRequestSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: "Validation Error",
      details: result.error.errors.map((e) => toValidationError(e.path.join("."), e.message)),
    });
  }

  const { normalized, details } = normalizeSearchRequest(result.data, { partial: true });
  if (details) return res.status(400).json({ error: "Validation Error", details });

  req.body = normalized;
  return next();
}

module.exports = {
  validateCreateTrip,
  validateCreateSearchRequest,
  validateUpdateSearchRequest,
};
