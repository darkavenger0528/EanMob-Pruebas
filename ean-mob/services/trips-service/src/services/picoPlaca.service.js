const env = require("../config/env");

const UNAVAILABLE_WARNING = "No fue posible verificar pico y placa en este momento";

function buildUrl(path) {
  return new URL(path, env.PICO_PLACA_SERVICE_URL).toString();
}

function buildWarning(body) {
  const warning = body?.data?.warnings?.[0];
  if (typeof warning === "string") return warning;
  if (warning?.message) return warning.message;
  return null;
}

function requestTimeoutMs() {
  const value = Number(env.PICO_PLACA_TIMEOUT_MS);
  return Number.isFinite(value) && value > 0 ? value : 2000;
}

async function checkPicoPlaca({
  plate,
  datetime,
  vehicleType,
  city = "BOGOTA",
  routeContext = null,
}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs());
  try {
    const response = await fetch(buildUrl("/api/v1/pico-placa/check"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        plate,
        datetime,
        vehicle_type: vehicleType,
        city,
        route_context: routeContext,
      }),
    });

    if (!response.ok) {
      return {
        available: false,
        data: null,
        warning: UNAVAILABLE_WARNING,
      };
    }

    const body = await response.json();
    return {
      available: true,
      data: body.data,
      warning: buildWarning(body),
    };
  } catch (_error) {
    return {
      available: false,
      data: null,
      warning: UNAVAILABLE_WARNING,
    };
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = {
  checkPicoPlaca,
};
