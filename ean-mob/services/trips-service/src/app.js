const express = require("express");
const cors = require("cors");
const { errorMiddleware } = require("./middlewares/error.middleware");
const tripsRoutes = require("./routes/trips.routes");
const searchRequestsRoutes = require("./routes/searchRequests.routes");
const { ping } = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", async (req, res) => {
  await ping();
  res.json({ status: "ok" });
});

app.use(tripsRoutes);
app.use(searchRequestsRoutes);
app.use(errorMiddleware);

module.exports = app;
