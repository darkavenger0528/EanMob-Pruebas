const emailConfig = require("../config/email.config");

function generateOtp(length = emailConfig.otpLength) {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
}

function getOtpExpiry(minutes = emailConfig.otpExpiryMinutes) {
  const date = new Date();
  date.setMinutes(date.getMinutes() + minutes);
  return date;
}

async function sendOtpEmail(toEmail, otp, nombreCompleto) {
  const expiryMinutes = emailConfig.otpExpiryMinutes;
  const html = `<div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden"><div style="background:#003366;padding:24px;text-align:center"><h2 style="color:#fff;margin:0">Universidad EAN</h2><p style="color:#ccd9e8;margin:4px 0 0">Verificación de correo institucional</p></div><div style="padding:32px"><p style="font-size:16px;color:#333">Hola, <strong>${nombreCompleto}</strong>:</p><p style="color:#555">Tu código de verificación es:</p><div style="text-align:center;margin:24px 0"><span style="font-size:40px;font-weight:bold;letter-spacing:12px;color:#003366">${otp}</span></div><p style="color:#888;font-size:13px">Este código expira en <strong>${expiryMinutes} minutos</strong>. No lo compartas con nadie.</p></div><div style="background:#f5f5f5;padding:16px;text-align:center"><p style="font-size:12px;color:#aaa;margin:0">Si no solicitaste este código, ignora este mensaje.</p></div></div>`;

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": emailConfig.brevoApiKey,
    },
    body: JSON.stringify({
      sender: { name: "Universidad EAN", email: process.env.SMTP_FROM },
      to: [{ email: toEmail, name: nombreCompleto }],
      subject: "Tu código de verificación - Universidad EAN",
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Brevo API error: ${error}`);
  }
}

module.exports = { generateOtp, getOtpExpiry, sendOtpEmail };

