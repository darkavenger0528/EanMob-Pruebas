const searchRequestsService = require("../services/searchRequests.service");

function authHeader(req) {
  return req.headers.authorization;
}

async function create(req, res, next) {
  try {
    const result = await searchRequestsService.create(req.body, req.user, authHeader(req));
    res.status(201).json({
      success: true,
      data: result,
      message: result.message,
    });
  } catch (e) {
    next(e);
  }
}

async function getMyActive(req, res, next) {
  try {
    const searches = await searchRequestsService.getMyActive(req.user);
    res.json({ success: true, data: searches });
  } catch (e) {
    next(e);
  }
}

async function getById(req, res, next) {
  try {
    const search = await searchRequestsService.getById(Number(req.params.id), req.user);
    res.json({ success: true, data: search });
  } catch (e) {
    next(e);
  }
}

async function update(req, res, next) {
  try {
    const result = await searchRequestsService.update(
      Number(req.params.id),
      req.body,
      req.user,
      authHeader(req)
    );
    res.json({
      success: true,
      data: result,
      message: result.message,
    });
  } catch (e) {
    next(e);
  }
}

async function deactivate(req, res, next) {
  try {
    const result = await searchRequestsService.deactivate(Number(req.params.id), req.user);
    res.json({
      success: true,
      data: result,
      message: result.message,
    });
  } catch (e) {
    next(e);
  }
}

module.exports = {
  create,
  getMyActive,
  getById,
  update,
  deactivate,
};
