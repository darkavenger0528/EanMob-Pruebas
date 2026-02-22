require("dotenv").config();

module.exports = {
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS,
  from: process.env.SMTP_FROM || '"Universidad EAN" <no-reply@universidadean.edu.co>',
  otpLength: Number(process.env.OTP_LENGTH) || 6,
  otpExpiryMinutes: Number(process.env.OTP_EXPIRY_MINUTES) || 10,
};