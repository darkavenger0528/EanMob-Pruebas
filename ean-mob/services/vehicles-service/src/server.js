const app        = require("./app");
const env        = require("./config/env");
const { initDb } = require("./config/db");

async function start() {
  await initDb();
  app.listen(Number(env.PORT), "0.0.0.0", () => {
    console.log(`Vehicles service running on port ${env.PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start vehicles service:", err);
  process.exit(1);
});
