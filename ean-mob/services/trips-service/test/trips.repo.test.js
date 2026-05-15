const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const dbPath = path.resolve(__dirname, "../src/config/db.js");
const repoPath = path.resolve(__dirname, "../src/repositories/trips.repo.js");

function loadRepoWithPool(pool) {
  delete require.cache[repoPath];
  require.cache[dbPath] = {
    id: dbPath,
    filename: dbPath,
    loaded: true,
    exports: { pool },
  };
  return require(repoPath);
}

test("createTrip inserts the full HU-07 publication fields", async () => {
  const queries = [];
  const repo = loadRepoWithPool({
    query: async (sql, values) => {
      queries.push({ sql, values });
      return [{ insertId: 42 }];
    },
  });

  await repo.createTrip({
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

  assert.match(queries[0].sql, /vehicle_id/);
  assert.match(queries[0].sql, /available_seats/);
  assert.match(queries[0].sql, /cost_per_passenger/);
  assert.match(queries[0].sql, /origin_h3/);
  assert.match(queries[0].sql, /destination_lng/);
  assert.match(queries[0].sql, /notes/);
  assert.deepEqual(queries[0].values, [
    7,
    "driver@universidadean.edu.co",
    "Universidad EAN",
    "Portal Norte",
    "2026-05-20T13:30:00.000Z",
    null,
    12,
    3,
    4500,
    "open",
    "8928308280fffff",
    "89283082b5bffff",
    4.676,
    -74.048,
    4.754,
    -74.044,
    "Salida puntual",
  ]);
});
