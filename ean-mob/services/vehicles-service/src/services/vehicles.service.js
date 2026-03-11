const vehiclesRepo           = require("../repositories/vehicles.repo");
const { verificarRTM }       = require("./runt.service");
const { NotFoundError, ConflictError, ForbiddenError } = require("../utils/httpErrors");

// ─── CREAR VEHÍCULO ───────────────────────────────────────────────────────────
async function create(data, userId) {
  // Verificar que la placa no esté ya registrada
  const existe = await vehiclesRepo.findByPlaca(data.placa);
  if (existe) throw new ConflictError(`La placa ${data.placa} ya está registrada`);

  // Verificar RTM con mock RUNT
  const runt = await verificarRTM(data.placa);

  const id = await vehiclesRepo.createVehicle({
    user_id:        userId,
    tipo_vehiculo:  data.tipo_vehiculo,
    modelo:         data.modelo,
    placa:          data.placa,
    color:          data.color,
    soat_vigente:   data.soat_vigente ?? false,
    rtm_vigente:    runt.rtm_vigente,
    rtm_verificado: runt.rtm_verificado,
    rtm_mensaje:    runt.rtm_mensaje,
  });

  const vehicle = await vehiclesRepo.findById(id);
  return {
    ...vehicle,
    rtm_vigente:   Boolean(vehicle.rtm_vigente),
    soat_vigente:  Boolean(vehicle.soat_vigente),
    rtm_verificado: Boolean(vehicle.rtm_verificado),
  };
}

// ─── OBTENER POR ID ───────────────────────────────────────────────────────────
async function getById(id) {
  const vehicle = await vehiclesRepo.findById(id);
  if (!vehicle) throw new NotFoundError("Vehículo no encontrado");
  return formatVehicle(vehicle);
}

// ─── MIS VEHÍCULOS ────────────────────────────────────────────────────────────
async function getMyVehicles(userId) {
  const vehicles = await vehiclesRepo.findAllByUser(userId);
  return vehicles.map(formatVehicle);
}

// ─── ACTUALIZAR VEHÍCULO ──────────────────────────────────────────────────────
async function update(id, data, userId) {
  const vehicle = await vehiclesRepo.findById(id);
  if (!vehicle)              throw new NotFoundError("Vehículo no encontrado");
  if (vehicle.user_id !== userId) throw new ForbiddenError("No tienes permiso para editar este vehículo");

  await vehiclesRepo.updateVehicle(id, data);
  return getById(id);
}

// ─── ELIMINAR VEHÍCULO ────────────────────────────────────────────────────────
async function remove(id, userId) {
  const vehicle = await vehiclesRepo.findById(id);
  if (!vehicle)              throw new NotFoundError("Vehículo no encontrado");
  if (vehicle.user_id !== userId) throw new ForbiddenError("No tienes permiso para eliminar este vehículo");

  await vehiclesRepo.removeVehicle(id);
  return { message: "Vehículo eliminado correctamente" };
}

// ─── RE-VERIFICAR RTM ─────────────────────────────────────────────────────────
async function recheckRTM(id, userId) {
  const vehicle = await vehiclesRepo.findById(id);
  if (!vehicle)              throw new NotFoundError("Vehículo no encontrado");
  if (vehicle.user_id !== userId) throw new ForbiddenError("No tienes permiso para verificar este vehículo");

  const runt = await verificarRTM(vehicle.placa);
  await vehiclesRepo.updateVehicle(id, {
    rtm_vigente:    runt.rtm_vigente,
    rtm_verificado: runt.rtm_verificado,
    rtm_mensaje:    runt.rtm_mensaje,
  });

  return getById(id);
}

// ─── Helper formato ───────────────────────────────────────────────────────────
function formatVehicle(v) {
  return {
    ...v,
    soat_vigente:   Boolean(v.soat_vigente),
    rtm_vigente:    Boolean(v.rtm_vigente),
    rtm_verificado: Boolean(v.rtm_verificado),
  };
}

module.exports = { create, getById, getMyVehicles, update, remove, recheckRTM };
