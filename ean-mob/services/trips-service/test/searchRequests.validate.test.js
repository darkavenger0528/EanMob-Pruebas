const test = require("node:test");
const assert = require("node:assert/strict");

const {
  validateCreateSearchRequest,
  validateUpdateSearchRequest,
} = require("../src/middlewares/validate.middleware");

function runMiddleware(middleware, body) {
  const req = { body };
  const response = {
    statusCode: 200,
    payload: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    },
  };
  let nextCalled = false;

  middleware(req, response, () => {
    nextCalled = true;
  });

  return { req, response, nextCalled };
}

test("create search request accepts text addresses and estimated departure time", () => {
  const { req, nextCalled } = runMiddleware(validateCreateSearchRequest, {
    origin_address: " Universidad EAN ",
    destination_address: "Portal Norte",
    departure_datetime: "2026-05-20T12:00:00-05:00",
  });

  assert.equal(nextCalled, true);
  assert.equal(req.body.origen, "Universidad EAN");
  assert.equal(req.body.destino, "Portal Norte");
  assert.equal(req.body.hora_salida_estimada, "2026-05-20T17:00:00.000Z");
});

test("create search request rejects missing origin, destination, and departure time", () => {
  const { response, nextCalled } = runMiddleware(validateCreateSearchRequest, {});

  assert.equal(nextCalled, false);
  assert.equal(response.statusCode, 400);
  assert.deepEqual(
    response.payload.details.map((error) => error.field).sort(),
    ["departure_datetime", "destination_address", "origin_address"]
  );
});

test("update search request allows partial editable fields", () => {
  const { req, nextCalled } = runMiddleware(validateUpdateSearchRequest, {
    destino: "Calle 100",
    hora_salida_estimada: "2026-05-20T13:00:00-05:00",
    activa: false,
  });

  assert.equal(nextCalled, true);
  assert.deepEqual(req.body, {
    destino: "Calle 100",
    hora_salida_estimada: "2026-05-20T18:00:00.000Z",
    activa: false,
  });
});
