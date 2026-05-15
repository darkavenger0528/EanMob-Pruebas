const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const dbPath = path.resolve(__dirname, "../src/config/db.js");
const repoPath = path.resolve(__dirname, "../src/repositories/searchRequests.repo.js");

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

test("createSearchRequest inserts passenger search fields", async () => {
  const queries = [];
  const repo = loadRepoWithPool({
    query: async (sql, values) => {
      queries.push({ sql, values });
      return [{ insertId: 42 }];
    },
  });

  const id = await repo.createSearchRequest({
    passenger_id: 7,
    origen: "Universidad EAN",
    destino: "Portal Norte",
    origin_lat: 4.668,
    origin_lng: -74.055,
    destination_lat: 4.753,
    destination_lng: -74.047,
    origin_h3: "894ad2a",
    destination_h3: "894ad2b",
    hora_salida_estimada: "2026-05-20T12:00:00.000Z",
  });

  assert.equal(id, 42);
  assert.match(queries[0].sql, /INSERT INTO busquedas_viaje/);
  assert.match(queries[0].sql, /hora_salida_estimada/);
  assert.deepEqual(queries[0].values, [
    7,
    "Universidad EAN",
    "Portal Norte",
    4.668,
    -74.055,
    4.753,
    -74.047,
    "894ad2a",
    "894ad2b",
    "2026-05-20T12:00:00.000Z",
  ]);
});

test("findActiveByPassenger filters active searches by owner", async () => {
  const queries = [];
  const repo = loadRepoWithPool({
    query: async (sql, values) => {
      queries.push({ sql, values });
      return [[{ id: 1, passenger_id: 7, activa: 1 }]];
    },
  });

  const rows = await repo.findActiveByPassenger(7);

  assert.deepEqual(rows, [{ id: 1, passenger_id: 7, activa: 1 }]);
  assert.match(queries[0].sql, /WHERE passenger_id = \? AND activa = TRUE/);
  assert.deepEqual(queries[0].values, [7]);
});
