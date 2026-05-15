const test = require("node:test");
const assert = require("node:assert/strict");

const { validateCreateTrip } = require("../src/middlewares/validate.middleware");

function runValidation(body) {
  const req = { body };
  let responseStatus;
  let responseBody;
  const res = {
    status(code) {
      responseStatus = code;
      return this;
    },
    json(payload) {
      responseBody = payload;
    },
  };
  let nextCalled = false;

  validateCreateTrip(req, res, () => {
    nextCalled = true;
  });

  return { req, responseStatus, responseBody, nextCalled };
}

test("validateCreateTrip accepts complete HU-07 payload and coerces dates", () => {
  const result = runValidation({
    origin_address: "Universidad EAN",
    destination_address: "Portal Norte",
    departure_datetime: "2026-05-20T13:30:00.000Z",
    vehicle_id: 12,
    available_seats: 3,
    cost_per_passenger: 4500,
    notes: "Salida puntual",
  });

  assert.equal(result.nextCalled, true);
  assert.equal(result.req.body.hora_inicio, "2026-05-20T13:30:00.000Z");
  assert.equal(result.req.body.origen, "Universidad EAN");
  assert.equal(result.req.body.destino, "Portal Norte");
});

test("validateCreateTrip rejects missing vehicle and seats", () => {
  const result = runValidation({
    origin_address: "Universidad EAN",
    destination_address: "Portal Norte",
    departure_datetime: "2026-05-20T13:30:00.000Z",
  });

  assert.equal(result.nextCalled, false);
  assert.equal(result.responseStatus, 400);
  assert.equal(result.responseBody.error, "Validation Error");
  assert.deepEqual(
    result.responseBody.details.map((item) => item.field).sort(),
    ["available_seats", "vehicle_id"]
  );
});

test("validateCreateTrip accepts browser datetime-local values", () => {
  const result = runValidation({
    origin_address: "Universidad EAN",
    destination_address: "Portal Norte",
    departure_datetime: "2026-05-20T13:30",
    vehicle_id: 12,
    available_seats: 3,
  });

  assert.equal(result.nextCalled, true);
  assert.equal(result.req.body.hora_inicio, new Date("2026-05-20T13:30").toISOString());
});
