const { z } = require("zod");

// ─── Schemas ─────────────────────────────────────────────────────────────────

const currentYear = new Date().getFullYear();
const vehicleYear = z
  .number({ invalid_type_error: "El año debe ser numérico" })
  .int("El año debe ser entero")
  .min(1990, "El año debe ser 1990 o posterior")
  .max(currentYear + 1, `El año no puede ser mayor a ${currentYear + 1}`);

const createVehicleSchema = z.object({
  tipo_vehiculo: z.enum(["Carro", "Moto"]),
  marca:        z.string().min(2).max(50),
  modelo:        z.string().min(2).max(50),
  anio:          vehicleYear,
  placa:         z
    .string()
    .min(5).max(10)
    .toUpperCase()
    .regex(/^[A-Z]{3}\d{2,3}[A-Z0-9]?$/, "Formato de placa inválido (ej: ABC123)"),
  color:         z.string().min(2).max(30),
  numero_puestos: z.number().int().min(1).max(8),
  soat_vigente:  z.boolean().optional().default(false),
});

const updateVehicleSchema = z.object({
  marca:        z.string().min(2).max(50).optional(),
  modelo:       z.string().min(2).max(50).optional(),
  anio:         vehicleYear.optional(),
  color:        z.string().min(2).max(30).optional(),
  numero_puestos: z.number().int().min(1).max(8).optional(),
  soat_vigente: z.boolean().optional(),
}).strict();

// ─── Middleware factory ───────────────────────────────────────────────────────
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors.map((e) => ({
        field:   e.path.join("."),
        message: e.message,
      }));
      return res.status(400).json({ error: "Validation Error", details: errors });
    }
    req.body = result.data;
    next();
  };
}

module.exports = {
  validateCreateVehicle: validate(createVehicleSchema),
  validateUpdateVehicle: validate(updateVehicleSchema),
};
