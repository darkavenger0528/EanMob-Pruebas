const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const dbPath = path.resolve(__dirname, "../src/config/db.js");
const repoPath = path.resolve(__dirname, "../src/repositories/vehicles.repo.js");

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

test("createVehicle inserts brand, year, and available seats", async () => {
  const queries = [];
  const repo = loadRepoWithPool({
    query: async (sql, values) => {
      queries.push({ sql, values });
      return [{ insertId: 42 }];
    },
  });

  await repo.createVehicle({
    user_id: 7,
    tipo_vehiculo: "Carro",
    marca: "Renault",
    modelo: "Logan",
    anio: 2021,
    placa: "ABC123",
    color: "Gris",
    numero_puestos: 4,
    soat_vigente: true,
    rtm_vigente: true,
    rtm_verificado: true,
    rtm_mensaje: "RTM vigente",
  });

  assert.match(queries[0].sql, /marca/);
  assert.match(queries[0].sql, /anio/);
  assert.match(queries[0].sql, /numero_puestos/);
  assert.deepEqual(queries[0].values.slice(0, 8), [
    7,
    "Carro",
    "Renault",
    "Logan",
    2021,
    "ABC123",
    "Gris",
    4,
  ]);
});

test("updateVehicle persists brand, year, and available seats", async () => {
  const queries = [];
  const repo = loadRepoWithPool({
    query: async (sql, values) => {
      queries.push({ sql, values });
      return [{}];
    },
  });

  await repo.updateVehicle(42, {
    marca: "Kia",
    anio: 2019,
    numero_puestos: 5,
  });

  assert.match(queries[0].sql, /marca = \?/);
  assert.match(queries[0].sql, /anio = \?/);
  assert.match(queries[0].sql, /numero_puestos = \?/);
  assert.deepEqual(queries[0].values, ["Kia", 2019, 5, 42]);
});
