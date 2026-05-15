const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const envPath = path.resolve(__dirname, "../src/config/env.js");
const servicePath = path.resolve(__dirname, "../src/services/picoPlaca.service.js");
const dbPath = path.resolve(__dirname, "../src/config/db.js");
const vehiclesRepoPath = path.resolve(__dirname, "../src/repositories/vehicles.repo.js");
const originalFetch = global.fetch;
const originalAbortController = global.AbortController;

function loadService({
  picoPlacaServiceUrl = "http://pico.test",
  picoPlacaTimeoutMs = 2000,
} = {}) {
  delete require.cache[servicePath];
  require.cache[envPath] = {
    id: envPath,
    filename: envPath,
    loaded: true,
    exports: {
      PICO_PLACA_SERVICE_URL: picoPlacaServiceUrl,
      PICO_PLACA_TIMEOUT_MS: String(picoPlacaTimeoutMs),
    },
  };
  return require(servicePath);
}

function loadVehiclesRepo(pool) {
  delete require.cache[vehiclesRepoPath];
  require.cache[dbPath] = {
    id: dbPath,
    filename: dbPath,
    loaded: true,
    exports: { pool },
  };
  return require(vehiclesRepoPath);
}

test.afterEach(() => {
  delete require.cache[servicePath];
  delete require.cache[vehiclesRepoPath];
  delete require.cache[envPath];
  delete require.cache[dbPath];
  global.fetch = originalFetch;
  global.AbortController = originalAbortController;
});

test("checkPicoPlaca posts snake_case payload and returns restricted data", async () => {
  const calls = [];
  global.fetch = async (url, options) => {
    calls.push({ url, options });
    return {
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        data: {
          restricted: true,
          warnings: [{ message: "Placa restringida" }],
          reason: "Placa restringida",
        },
        message: "Restricción vigente",
      }),
    };
  };

  const { checkPicoPlaca } = loadService();

  const result = await checkPicoPlaca({
    plate: "ABC123",
    datetime: "2026-05-15T12:00:00.000Z",
    vehicleType: "car",
    routeContext: { origin: "Universidad EAN" },
  });

  assert.equal(calls[0].url, "http://pico.test/api/v1/pico-placa/check");
  assert.equal(calls[0].options.method, "POST");
  assert.deepEqual(calls[0].options.headers, { "Content-Type": "application/json" });
  assert.deepEqual(JSON.parse(calls[0].options.body), {
    plate: "ABC123",
    datetime: "2026-05-15T12:00:00.000Z",
    vehicle_type: "car",
    city: "BOGOTA",
    route_context: { origin: "Universidad EAN" },
  });
  assert.equal(result.available, true);
  assert.equal(result.data.restricted, true);
  assert.equal(result.warning, "Placa restringida");
});

test("checkPicoPlaca returns unavailable when fetch rejects", async () => {
  global.fetch = async () => {
    throw new Error("connection refused");
  };
  const { checkPicoPlaca } = loadService();

  const result = await checkPicoPlaca({
    plate: "ABC123",
    datetime: "2026-05-15T12:00:00.000Z",
    vehicleType: "car",
  });

  assert.deepEqual(result, {
    available: false,
    data: null,
    warning: "No fue posible verificar pico y placa en este momento",
  });
});

test("checkPicoPlaca returns unavailable when service responds non-2xx", async () => {
  global.fetch = async () => ({
    ok: false,
    status: 503,
    json: async () => ({ success: false, error: "unavailable" }),
  });
  const { checkPicoPlaca } = loadService();

  const result = await checkPicoPlaca({
    plate: "ABC123",
    datetime: "2026-05-15T12:00:00.000Z",
    vehicleType: "car",
  });

  assert.deepEqual(result, {
    available: false,
    data: null,
    warning: "No fue posible verificar pico y placa en este momento",
  });
});

test("checkPicoPlaca aborts slow requests", async () => {
  let abortHandler;
  let signalWasProvided = false;
  global.AbortController = class FakeAbortController {
    constructor() {
      this.signal = {
        addEventListener: (_event, handler) => {
          abortHandler = handler;
        },
      };
    }

    abort() {
      abortHandler();
    }
  };
  global.fetch = (_url, options) => new Promise((_resolve, reject) => {
    signalWasProvided = Boolean(options.signal);
    if (!options.signal) return;
    options.signal.addEventListener("abort", () => reject(new Error("aborted")));
  });
  const { checkPicoPlaca } = loadService({ picoPlacaTimeoutMs: 1 });

  const result = await checkPicoPlaca({
    plate: "ABC123",
    datetime: "2026-05-15T12:00:00.000Z",
    vehicleType: "car",
  });

  assert.equal(signalWasProvided, true);
  assert.deepEqual(result, {
    available: false,
    data: null,
    warning: "No fue posible verificar pico y placa en este momento",
  });
});

test("vehicles repo finds a vehicle by id across vehicles schema", async () => {
  const queries = [];
  const expectedVehicle = {
    id: 12,
    user_id: 7,
    tipo_vehiculo: "carro",
    placa: "ABC123",
  };
  const repo = loadVehiclesRepo({
    query: async (sql, values) => {
      queries.push({ sql, values });
      return [[expectedVehicle]];
    },
  });

  const result = await repo.findById(12);

  assert.match(queries[0].sql, /FROM vehicles_ean\.vehiculos/);
  assert.match(queries[0].sql, /WHERE id = \?/);
  assert.match(queries[0].sql, /LIMIT 1/);
  assert.deepEqual(queries[0].values, [12]);
  assert.equal(result, expectedVehicle);
});
