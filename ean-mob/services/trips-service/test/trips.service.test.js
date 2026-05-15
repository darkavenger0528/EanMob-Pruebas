const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const repoPath = path.resolve(__dirname, "../src/repositories/trips.repo.js");
const servicePath = path.resolve(__dirname, "../src/services/trips.service.js");

function loadService(repo) {
  delete require.cache[servicePath];
  require.cache[repoPath] = {
    id: repoPath,
    filename: repoPath,
    loaded: true,
    exports: repo,
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
});
