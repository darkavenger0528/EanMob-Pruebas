const app = require("./app");
const env = require("./config/env");

app.listen(Number(env.PORT), () => {
  console.log(`Vehicles service running on http://localhost:${env.PORT}`);
});
