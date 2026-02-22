const app = require("./app");
const env = require("./config/env");

app.listen(Number(env.PORT), () => {
  console.log(`Trips service running on http://localhost:${env.PORT}`);
});
