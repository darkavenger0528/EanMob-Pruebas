const { Router } = require("express");
const router = Router();

router.get("/health", (req, res) => {
  res.json({ status: "ok", service: "users-service", timestamp: new Date() });
});

module.exports = router;