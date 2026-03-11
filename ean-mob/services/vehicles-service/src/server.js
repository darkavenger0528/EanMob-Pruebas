const app           = require("./app");
const env           = require("./config/env");
const { initDb }    = require("./config/db");

async function start() {
  await initDb(); // Crea la tabla si no existe
  app.listen(Number(env.PORT), () => {
    console.log(`Vehicles service running on http://localhost:${env.PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start vehicles service:", err);
  process.exit(1);
});
