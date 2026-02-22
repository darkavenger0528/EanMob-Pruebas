const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const healthRoutes = require("./routes/health.routes");
const { errorMiddleware } = require("./middlewares/error.middleware");

const app = express();
app.use(cors());
app.use(express.json());

const publicPath = path.resolve(process.cwd(), "src", "public");
app.use(express.static(publicPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.use(healthRoutes);
app.use("/api/auth", authRoutes);

app.use(errorMiddleware);

module.exports = app;