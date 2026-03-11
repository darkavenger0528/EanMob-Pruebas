const env = require("./env");

module.exports = {
  from:             env.SMTP_FROM,
  otpLength:        Number(env.OTP_LENGTH),
  otpExpiryMinutes: Number(env.OTP_EXPIRY_MINUTES),
  brevoApiKey:      env.BREVO_API_KEY,
};

