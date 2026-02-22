const nodemailer = require('nodemailer');
const config = require('../config/email.config');

const transporter = nodemailer.createTransport({
  host: config.host,
  port: config.port,
  secure: false,
  auth: {
    user: config.user,
    pass: config.pass,
  },
});

function generarOtp(length) {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
}

async function enviarOtp(email) {
  if (!email.endsWith('@universidadean.edu.co')) {
    throw new Error('El correo debe ser institucional EAN');
  }

  const otp = generarOtp(config.otpLength);
  const expiracion = new Date(Date.now() + config.otpExpiryMinutes * 60000);

  // TODO: guarda otp + expiracion en la BD (tabla user_verification)

  await transporter.sendMail({
    from: config.from,
    to: email,
    subject: 'Código de verificación EAN',
    text: `Tu código de verificación es: ${otp}. Expira en ${config.otpExpiryMinutes} minutos.`,
  });

  return { otp, expiracion };
}

module.exports = { enviarOtp };
