const { z } = require("zod");

const EAN_DOMAIN = "@universidadean.edu.co";

const registerSchema = z.object({
  nombre_completo:       z.string().min(3).max(100),
  fecha_nacimiento:      z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato: YYYY-MM-DD"),
  tipo_documento:        z.enum(["CC", "TI"]),
  numero_identificacion: z.string().min(5).max(10),
  correo: z.string().email().refine((v) => v.toLowerCase().endsWith(EAN_DOMAIN), {
    message: `El correo debe terminar en ${EAN_DOMAIN}`,
  }),
  rol:      z.enum(["Director", "Estudiante", "Profesor"]),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  grupo_sanguineo: z.enum(["A+","A-","B+","B-","AB+","AB-","O+","O-"]).optional(),
  sexo:            z.enum(["H", "M", "Otro"]).optional(),
  altura_cm:       z.number().positive().optional(),
  peso_kg:         z.number().positive().optional(),
});

const verifyOtpSchema = z.object({
  correo: z.string().email(),
  otp:    z.string().length(6, "El OTP debe tener 6 dígitos"),
});

const resendOtpSchema = z.object({
  correo: z.string().email(),
});

const loginSchema = z.object({
  correo:   z.string().email(),
  password: z.string().min(1),
});

// Solo permite campos editables del perfil
const updateProfileSchema = z.object({
  nombre_completo:  z.string().min(3).max(100).optional(),
  fecha_nacimiento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  grupo_sanguineo:  z.enum(["A+","A-","B+","B-","AB+","AB-","O+","O-"]).optional(),
  sexo:             z.enum(["H", "M", "Otro"]).optional(),
  altura_cm:        z.number().positive().optional(),
  peso_kg:          z.number().positive().optional(),
}).strict();

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors.map((e) => ({
        field: e.path.join("."), message: e.message,
      }));
      return res.status(400).json({ error: "Validation Error", details: errors });
    }
    req.body = result.data;
    next();
  };
}

module.exports = {
  validateRegister:      validate(registerSchema),
  validateVerifyOtp:     validate(verifyOtpSchema),
  validateResendOtp:     validate(resendOtpSchema),
  validateLogin:         validate(loginSchema),
  validateUpdateProfile: validate(updateProfileSchema),
};
