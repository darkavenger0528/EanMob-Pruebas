const express = require("express");
const searchRequestsController = require("../controllers/searchRequests.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const {
  validateCreateSearchRequest,
  validateUpdateSearchRequest,
} = require("../middlewares/validate.middleware");

const router = express.Router();

router.post(
  "/api/v1/search-requests",
  authMiddleware,
  validateCreateSearchRequest,
  searchRequestsController.create
);
router.get(
  "/api/v1/search-requests/my",
  authMiddleware,
  searchRequestsController.getMyActive
);
router.get(
  "/api/v1/search-requests/:id",
  authMiddleware,
  searchRequestsController.getById
);
router.put(
  "/api/v1/search-requests/:id",
  authMiddleware,
  validateUpdateSearchRequest,
  searchRequestsController.update
);
router.delete(
  "/api/v1/search-requests/:id",
  authMiddleware,
  searchRequestsController.deactivate
);

module.exports = router;
