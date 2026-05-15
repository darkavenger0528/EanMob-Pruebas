const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const repoPath = path.resolve(__dirname, "../src/repositories/searchRequests.repo.js");
const matchingPath = path.resolve(__dirname, "../src/services/matching.service.js");
const servicePath = path.resolve(__dirname, "../src/services/searchRequests.service.js");

function loadService({ repo, matching }) {
  delete require.cache[servicePath];
  require.cache[repoPath] = {
    id: repoPath,
    filename: repoPath,
    loaded: true,
    exports: repo,
  };
  require.cache[matchingPath] = {
    id: matchingPath,
    filename: matchingPath,
    loaded: true,
    exports: matching,
  };
  return require(servicePath);
}

test("create records a passenger search and returns suggested matches", async () => {
  const persistedPayloads = [];
  const service = loadService({
    repo: {
      createSearchRequest: async (payload) => {
        persistedPayloads.push(payload);
        return 42;
      },
      findById: async () => ({
        id: 42,
        passenger_id: 7,
        origen: "Universidad EAN",
        destino: "Portal Norte",
        origin_h3: "894ad2a",
        destination_h3: "894ad2b",
        hora_salida_estimada: "2026-05-20T12:00:00.000Z",
        activa: 1,
      }),
    },
    matching: {
      enrichSearchRequest: async (payload) => ({
        ...payload,
        origin_h3: "894ad2a",
        destination_h3: "894ad2b",
        origin_lat: 4.668,
        origin_lng: -74.055,
        destination_lat: 4.753,
        destination_lng: -74.047,
      }),
      findMatches: async () => ({
        candidates: [{ trip_id: 99, relevance_score: 0.92 }],
        total: 1,
      }),
    },
  });

  const result = await service.create(
    {
      origen: "Universidad EAN",
      destino: "Portal Norte",
      hora_salida_estimada: "2026-05-20T12:00:00.000Z",
    },
    { sub: 7 },
    "Bearer token"
  );

  assert.equal(persistedPayloads[0].passenger_id, 7);
  assert.equal(persistedPayloads[0].origin_h3, "894ad2a");
  assert.equal(result.searchRequest.id, 42);
  assert.deepEqual(result.matches.candidates, [{ trip_id: 99, relevance_score: 0.92 }]);
  assert.equal(result.message, "Búsqueda de viaje publicada correctamente");
});

test("getMyActive returns only active searches for the authenticated passenger", async () => {
  const service = loadService({
    repo: {
      findActiveByPassenger: async (passengerId) => {
        assert.equal(passengerId, 7);
        return [{ id: 1, activa: 1 }];
      },
    },
    matching: {},
  });

  const result = await service.getMyActive({ sub: 7 });

  assert.deepEqual(result, [{ id: 1, activa: true }]);
});

test("deactivate only disables searches owned by the authenticated passenger", async () => {
  let deactivated;
  const service = loadService({
    repo: {
      findById: async () => ({ id: 9, passenger_id: 7, activa: 1 }),
      deactivate: async (id) => {
        deactivated = id;
      },
    },
    matching: {},
  });

  const result = await service.deactivate(9, { sub: 7 });

  assert.equal(deactivated, 9);
  assert.deepEqual(result, { message: "Búsqueda de viaje desactivada correctamente" });
});
