const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const repoPath = path.resolve(__dirname, "../src/repositories/vehicles.repo.js");
const runtPath = path.resolve(__dirname, "../src/services/runt.service.js");
const servicePath = path.resolve(__dirname, "../src/services/vehicles.service.js");

function loadService({ repo, runt }) {
  delete require.cache[servicePath];
  require.cache[repoPath] = {
    id: repoPath,
    filename: repoPath,
    loaded: true,
    exports: repo,
  };
  require.cache[runtPath] = {
    id: runtPath,
    filename: runtPath,
    loaded: true,
    exports: runt,
  };
  return require(servicePath);
}

test("create forwards brand, year, and available seats to repository", async () => {
  let createdVehicle;
  const service = loadService({
    repo: {
      findByPlaca: async () => null,
      createVehicle: async (vehicle) => {
        createdVehicle = vehicle;
        return 42;
      },
      findById: async () => ({
        id: 42,
        user_id: 7,
        tipo_vehiculo: "Carro",
        marca: "Chevrolet",
        modelo: "Onix",
        anio: 2023,
        placa: "ABC123",
        color: "Rojo",
        numero_puestos: 4,
        soat_vigente: 1,
        rtm_vigente: 1,
        rtm_verificado: 1,
      }),
    },
    runt: {
      verificarRTM: async () => ({
        rtm_vigente: true,
        rtm_verificado: true,
        rtm_mensaje: "RTM vigente",
      }),
    },
  });

  const result = await service.create(
    {
      tipo_vehiculo: "Carro",
      marca: "Chevrolet",
      modelo: "Onix",
      anio: 2023,
      placa: "ABC123",
      color: "Rojo",
      numero_puestos: 4,
      soat_vigente: true,
    },
    7
  );

  assert.equal(createdVehicle.marca, "Chevrolet");
  assert.equal(createdVehicle.anio, 2023);
  assert.equal(createdVehicle.numero_puestos, 4);
  assert.equal(result.marca, "Chevrolet");
  assert.equal(result.anio, 2023);
  assert.equal(result.numero_puestos, 4);
});
