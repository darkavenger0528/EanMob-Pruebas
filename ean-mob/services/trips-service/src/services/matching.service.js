const env = require("../config/env");

function buildUrl(path) {
  return new URL(path, env.MATCHING_SERVICE_URL).toString();
}

async function postJson(path, payload, authHeader) {
  const headers = { "Content-Type": "application/json" };
  if (authHeader) headers.Authorization = authHeader;

  const response = await fetch(buildUrl(path), {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Matching service ${response.status}: ${body}`);
  }

  return response.json();
}

async function geocode(address) {
  return postJson("/maps/geocode", { address });
}

async function enrichSearchRequest(searchRequest) {
  if (searchRequest.origin_h3 && searchRequest.destination_h3) {
    return searchRequest;
  }

  const [origin, destination] = await Promise.all([
    geocode(searchRequest.origen),
    geocode(searchRequest.destino),
  ]);

  return {
    ...searchRequest,
    origin_lat: origin.lat,
    origin_lng: origin.lng,
    destination_lat: destination.lat,
    destination_lng: destination.lng,
    origin_h3: origin.h3_index,
    destination_h3: destination.h3_index,
  };
}

async function findMatches(searchRequest, authHeader) {
  if (!searchRequest.origin_h3 || !searchRequest.destination_h3) {
    return { candidates: [], total: 0 };
  }

  return postJson(
    "/match/find",
    {
      my_h3_origin: searchRequest.origin_h3,
      my_h3_destination: searchRequest.destination_h3,
      departure_time: searchRequest.hora_salida_estimada,
      time_tolerance_minutes: 30,
      max_h3_distance: 1,
      min_seats: 1,
    },
    authHeader
  );
}

module.exports = {
  enrichSearchRequest,
  findMatches,
};
