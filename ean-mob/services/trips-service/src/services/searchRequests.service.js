const { httpError } = require("../utils/httpErrors");
const searchRequestsRepo = require("../repositories/searchRequests.repo");
const matchingService = require("./matching.service");

function getPassengerId(user) {
  const passengerId = Number(user?.sub);
  if (!passengerId) throw httpError(401, "Pasajero no autenticado");
  return passengerId;
}

function formatSearchRequest(searchRequest) {
  if (!searchRequest) return searchRequest;
  return {
    ...searchRequest,
    activa: Boolean(searchRequest.activa),
  };
}

async function findOwnedSearchRequest(id, passengerId) {
  const searchRequest = await searchRequestsRepo.findById(id);
  if (!searchRequest) throw httpError(404, "Búsqueda de viaje no encontrada");
  if (Number(searchRequest.passenger_id) !== Number(passengerId)) {
    throw httpError(403, "No tienes permiso para acceder a esta búsqueda");
  }
  return searchRequest;
}

async function resolveMatching(searchRequest, authHeader) {
  try {
    const matches = await matchingService.findMatches(searchRequest, authHeader);
    return { matches };
  } catch (err) {
    return {
      matches: { candidates: [], total: 0 },
      matching_error: "No fue posible consultar coincidencias en este momento",
    };
  }
}

async function enrich(searchRequest) {
  try {
    return await matchingService.enrichSearchRequest(searchRequest);
  } catch (err) {
    return searchRequest;
  }
}

async function create(data, user, authHeader) {
  const passengerId = getPassengerId(user);
  const enriched = await enrich({
    ...data,
    passenger_id: passengerId,
    origin_lat: data.origin_lat ?? null,
    origin_lng: data.origin_lng ?? null,
    destination_lat: data.destination_lat ?? null,
    destination_lng: data.destination_lng ?? null,
    origin_h3: data.origin_h3 ?? null,
    destination_h3: data.destination_h3 ?? null,
  });

  const id = await searchRequestsRepo.createSearchRequest(enriched);
  const searchRequest = formatSearchRequest(await searchRequestsRepo.findById(id));
  const matchingResult = await resolveMatching(searchRequest, authHeader);

  return {
    searchRequest,
    ...matchingResult,
    message: "Búsqueda de viaje publicada correctamente",
  };
}

async function getMyActive(user) {
  const passengerId = getPassengerId(user);
  const rows = await searchRequestsRepo.findActiveByPassenger(passengerId);
  return rows.map(formatSearchRequest);
}

async function getById(id, user) {
  const passengerId = getPassengerId(user);
  const searchRequest = await findOwnedSearchRequest(id, passengerId);
  return formatSearchRequest(searchRequest);
}

async function update(id, data, user, authHeader) {
  const passengerId = getPassengerId(user);
  const current = await findOwnedSearchRequest(id, passengerId);

  const needsReenrichment = ["origen", "destino"].some((field) => Object.hasOwn(data, field));
  const changes = needsReenrichment
    ? await enrich({
      origen: current.origen,
      destino: current.destino,
      ...data,
      origin_lat: data.origin_lat ?? current.origin_lat ?? null,
      origin_lng: data.origin_lng ?? current.origin_lng ?? null,
      destination_lat: data.destination_lat ?? current.destination_lat ?? null,
      destination_lng: data.destination_lng ?? current.destination_lng ?? null,
      origin_h3: data.origin_h3 ?? null,
      destination_h3: data.destination_h3 ?? null,
    })
    : data;

  await searchRequestsRepo.updateSearchRequest(id, changes);
  const searchRequest = formatSearchRequest(await searchRequestsRepo.findById(id));
  const matchingResult = await resolveMatching(searchRequest, authHeader);

  return {
    searchRequest,
    ...matchingResult,
    message: "Búsqueda de viaje actualizada correctamente",
  };
}

async function deactivate(id, user) {
  const passengerId = getPassengerId(user);
  await findOwnedSearchRequest(id, passengerId);
  await searchRequestsRepo.deactivate(id);
  return { message: "Búsqueda de viaje desactivada correctamente" };
}

module.exports = {
  create,
  getMyActive,
  getById,
  update,
  deactivate,
};
