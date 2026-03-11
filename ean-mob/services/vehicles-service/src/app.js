const express  = require("express");
const cors     = require("cors");
const { ping } = require("./config/db");
const vehiclesRoutes   = require("./routes/vehicles.routes");
const { errorMiddleware } = require("./middlewares/error.middleware");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", async (req, res) => {
  await ping();
  res.json({ status: "ok", service: "vehicles-service", timestamp: new Date() });
});

app.use("/api/vehicles", vehiclesRoutes);
app.use(errorMiddleware);

module.exports = app;
