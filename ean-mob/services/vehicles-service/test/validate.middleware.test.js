const test = require("node:test");
const assert = require("node:assert/strict");

const {
  validateCreateVehicle,
  validateUpdateVehicle,
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

test("create vehicle requires and preserves brand, year, and available seats", () => {
  const { req, nextCalled } = runMiddleware(validateCreateVehicle, {
    tipo_vehiculo: "Carro",
    marca: "Toyota",
    modelo: "Corolla",
    anio: 2020,
    placa: "abc123",
    color: "Azul",
    numero_puestos: 4,
    soat_vigente: true,
  });

  assert.equal(nextCalled, true);
  assert.equal(req.body.placa, "ABC123");
  assert.equal(req.body.marca, "Toyota");
  assert.equal(req.body.anio, 2020);
  assert.equal(req.body.numero_puestos, 4);
});

test("create vehicle rejects missing brand, year, or available seats", () => {
  const { response, nextCalled } = runMiddleware(validateCreateVehicle, {
    tipo_vehiculo: "Carro",
    modelo: "Corolla",
    placa: "ABC123",
    color: "Azul",
  });

  assert.equal(nextCalled, false);
  assert.equal(response.statusCode, 400);
  assert.deepEqual(
    response.payload.details.map((error) => error.field).sort(),
    ["anio", "marca", "numero_puestos"]
  );
});

test("update vehicle allows brand, year, and available seats", () => {
  const { req, nextCalled } = runMiddleware(validateUpdateVehicle, {
    marca: "Mazda",
    anio: 2022,
    numero_puestos: 3,
  });

  assert.equal(nextCalled, true);
  assert.deepEqual(req.body, {
    marca: "Mazda",
    anio: 2022,
    numero_puestos: 3,
  });
});
