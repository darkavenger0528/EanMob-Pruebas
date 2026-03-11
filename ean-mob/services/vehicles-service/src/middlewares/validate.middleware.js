const { z } = require("zod");

// ─── Schemas ─────────────────────────────────────────────────────────────────

const createVehicleSchema = z.object({
  tipo_vehiculo: z.enum(["Carro", "Moto"]),
  modelo:        z.string().min(2).max(50),
  placa:         z
    .string()
    .min(5).max(10)
    .toUpperCase()
    .regex(/^[A-Z]{3}\d{2,3}[A-Z0-9]?$/, "Formato de placa inválido (ej: ABC123)"),
  color:         z.string().min(2).max(30),
  soat_vigente:  z.boolean().optional().default(false),
});

const updateVehicleSchema = z.object({
  modelo:       z.string().min(2).max(50).optional(),
  color:        z.string().min(2).max(30).optional(),
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
