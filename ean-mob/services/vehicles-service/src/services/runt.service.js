/**
 * RUNT Mock Service
 * Simula la verificación de Revisión Técnico-Mecánica (RTM) colombiana.
 * 
 * En producción, aquí se conectaría con el portal RUNT (runt.com.co)
 * o con un proveedor de datos vehiculares certificado.
 * 
 * Lógica del mock:
 * - Placas que terminan en número PAR → RTM vigente ✅
 * - Placas que terminan en número IMPAR → RTM vencida ❌
 * - Placas con letra al final → RTM vigente ✅ (motos nuevas)
 */

async function verificarRTM(placa) {
  // Simular latencia de API externa
  await new Promise((resolve) => setTimeout(resolve, 300));

  const ultimoCaracter = placa.slice(-1);
  const esNumero = /\d/.test(ultimoCaracter);

  let rtm_vigente;
  let mensaje;

  if (!esNumero) {
    // Moto o placa nueva con letra al final
    rtm_vigente = true;
    mensaje = `RTM vigente para placa ${placa} ✅`;
  } else {
    const ultimoDigito = parseInt(ultimoCaracter, 10);
    rtm_vigente = ultimoDigito % 2 === 0;
    mensaje = rtm_vigente
      ? `RTM vigente para placa ${placa} ✅`
      : `RTM vencida o no encontrada para placa ${placa} ❌ — El vehículo no puede prestar servicio`;
  }

  return {
    placa,
    rtm_vigente,
    rtm_verificado: true,
    rtm_mensaje: mensaje,
  };
}

module.exports = { verificarRTM };
