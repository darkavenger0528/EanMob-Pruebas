require("dotenv").config();

module.exports = {
  from: process.env.SMTP_FROM || "no-reply@universidadean.edu.co",
  otpLength: Number(process.env.OTP_LENGTH) || 6,
  otpExpiryMinutes: Number(process.env.OTP_EXPIRY_MINUTES) || 10,
  brevoApiKey: process.env.BREVO_API_KEY,
};
