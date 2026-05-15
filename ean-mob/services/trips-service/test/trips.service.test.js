const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const repoPath = path.resolve(__dirname, "../src/repositories/trips.repo.js");
const vehiclesRepoPath = path.resolve(__dirname, "../src/repositories/vehicles.repo.js");
const picoPlacaServicePath = path.resolve(__dirname, "../src/services/picoPlaca.service.js");
const servicePath = path.resolve(__dirname, "../src/services/trips.service.js");

function loadService(repo, { vehiclesRepo, picoPlacaService } = {}) {
  delete require.cache[servicePath];
  require.cache[repoPath] = {
    id: repoPath,
    filename: repoPath,
    loaded: true,
    exports: repo,
  };
  require.cache[vehiclesRepoPath] = {
    id: vehiclesRepoPath,
    filename: vehiclesRepoPath,
    loaded: true,
    exports: vehiclesRepo ?? {
      findById: async () => ({
        id: 12,
        tipo_vehiculo: "car",
        placa: "ABC123",
      }),
    },
  };
  require.cache[picoPlacaServicePath] = {
    id: picoPlacaServicePath,
    filename: picoPlacaServicePath,
    loaded: true,
    exports: picoPlacaService ?? {
      checkPicoPlaca: async () => ({
        available: true,
        data: { restricted: false, warnings: [] },
        warning: null,
      }),
    },
  };
  return require(servicePath);
}

test("create publishes a complete trip from the authenticated driver", async () => {
  let createdTrip;
  const service = loadService({
    createTrip: async (trip) => {
      createdTrip = trip;
      return 42;
    },
    findById: async () => ({
      id: 42,
      conductor_id: 7,
      nombre_prestador: "driver@universidadean.edu.co",
      origen: "Universidad EAN",
      destino: "Portal Norte",
      hora_inicio: "2026-05-20T13:30:00.000Z",
      vehicle_id: 12,
      available_seats: 3,
      cost_per_passenger: "4500.00",
      status: "open",
      origin_h3: "8928308280fffff",
      destination_h3: "89283082b5bffff",
      origin_lat: "4.6760000",
      origin_lng: "-74.0480000",
      destination_lat: "4.7540000",
      destination_lng: "-74.0440000",
      notes: "Salida puntual",
    }),
  });

  const result = await service.create(
    {
      origin_address: "Universidad EAN",
      destination_address: "Portal Norte",
      departure_datetime: "2026-05-20T13:30:00.000Z",
      vehicle_id: 12,
      available_seats: 3,
      cost_per_passenger: 4500,
      origin_h3: "8928308280fffff",
      destination_h3: "89283082b5bffff",
      origin_lat: 4.676,
      origin_lng: -74.048,
      destination_lat: 4.754,
      destination_lng: -74.044,
      notes: "Salida puntual",
    },
    { sub: 7, correo: "driver@universidadean.edu.co" }
  );

  assert.deepEqual(createdTrip, {
    conductor_id: 7,
    nombre_prestador: "driver@universidadean.edu.co",
    origen: "Universidad EAN",
    destino: "Portal Norte",
    hora_inicio: "2026-05-20T13:30:00.000Z",
    hora_fin: null,
    vehicle_id: 12,
    available_seats: 3,
    cost_per_passenger: 4500,
    status: "open",
    origin_h3: "8928308280fffff",
    destination_h3: "89283082b5bffff",
    origin_lat: 4.676,
    origin_lng: -74.048,
    destination_lat: 4.754,
    destination_lng: -74.044,
    notes: "Salida puntual",
  });
  assert.equal(result.id, 42);
  assert.equal(result.message, "Viaje publicado correctamente");
  assert.equal(result.trip.available_seats, 3);
  assert.equal(result.pico_placa_warning, null);
});

test("create includes pico_placa_warning when checker returns restriction warnings", async () => {
  let picoRequest;
  const service = loadService(
    {
      createTrip: async () => 43,
      findById: async () => ({ id: 43, available_seats: 2 }),
    },
    {
      vehiclesRepo: {
        findById: async (id) => ({
          id,
          tipo_vehiculo: "car",
          placa: "ABC124",
        }),
      },
      picoPlacaService: {
        checkPicoPlaca: async (request) => {
          picoRequest = request;
          return {
            available: true,
            data: {
              restricted: true,
              warnings: ["Vehiculo con restriccion de pico y placa"],
              message: "El vehiculo tiene restriccion para esa hora",
            },
            warning: "El vehiculo tiene restriccion para esa hora",
          };
        },
      },
    }
  );

  const result = await service.create(
    {
      origen: "Universidad EAN",
      destino: "Portal Norte",
      hora_inicio: "2026-05-20T13:30:00.000Z",
      vehicle_id: 12,
      available_seats: 2,
    },
    { sub: 7, correo: "driver@universidadean.edu.co" }
  );

  assert.deepEqual(picoRequest, {
    plate: "ABC124",
    datetime: "2026-05-20T13:30:00.000Z",
    vehicleType: "car",
  });
  assert.deepEqual(result.pico_placa_warning, {
    available: true,
    restricted: true,
    warnings: ["Vehiculo con restriccion de pico y placa"],
    message: "El vehiculo tiene restriccion para esa hora",
  });
});

test("create still publishes when pico checker unavailable", async () => {
  const service = loadService(
    {
      createTrip: async () => 44,
      findById: async () => ({ id: 44, available_seats: 1 }),
    },
    {
      picoPlacaService: {
        checkPicoPlaca: async () => ({
          available: false,
          data: null,
          warning: "No fue posible verificar pico y placa en este momento",
        }),
      },
    }
  );

  const result = await service.create(
    {
      origen: "Universidad EAN",
      destino: "Portal Norte",
      hora_inicio: "2026-05-20T13:30:00.000Z",
      vehicle_id: 12,
      available_seats: 1,
    },
    { sub: 7, correo: "driver@universidadean.edu.co" }
  );

  assert.equal(result.id, 44);
  assert.deepEqual(result.pico_placa_warning, {
    available: false,
    restricted: null,
    warnings: [],
    message: "No fue posible verificar pico y placa en este momento",
  });
});

test("create still publishes when vehicle lookup returns null", async () => {
  const service = loadService(
    {
      createTrip: async () => 45,
      findById: async () => ({ id: 45, available_seats: 4 }),
    },
    {
      vehiclesRepo: {
        findById: async () => null,
      },
      picoPlacaService: {
        checkPicoPlaca: async () => {
          throw new Error("should not check pico y placa without a vehicle");
        },
      },
    }
  );

  const result = await service.create(
    {
      origen: "Universidad EAN",
      destino: "Portal Norte",
      hora_inicio: "2026-05-20T13:30:00.000Z",
      vehicle_id: 999,
      available_seats: 4,
    },
    { sub: 7, correo: "driver@universidadean.edu.co" }
  );

  assert.equal(result.id, 45);
  assert.deepEqual(result.pico_placa_warning, {
    available: false,
    restricted: null,
    warnings: [],
    message: "No fue posible verificar pico y placa porque el vehiculo seleccionado no fue encontrado",
  });
});

test("create still publishes when vehicle lookup fails", async () => {
  const service = loadService(
    {
      createTrip: async () => 46,
      findById: async () => ({ id: 46, available_seats: 2 }),
    },
    {
      vehiclesRepo: {
        findById: async () => {
          throw new Error("vehicles schema unavailable");
        },
      },
    }
  );

  const result = await service.create(
    {
      origen: "Universidad EAN",
      destino: "Portal Norte",
      hora_inicio: "2026-05-20T13:30:00.000Z",
      vehicle_id: 12,
      available_seats: 2,
    },
    { sub: 7, correo: "driver@universidadean.edu.co" }
  );

  assert.equal(result.id, 46);
  assert.deepEqual(result.pico_placa_warning, {
    available: false,
    restricted: null,
    warnings: [],
    message: "No fue posible verificar pico y placa en este momento",
  });
});
