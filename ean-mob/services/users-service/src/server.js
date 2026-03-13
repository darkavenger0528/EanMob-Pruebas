const app = require("./app");
const env = require("./config/env");

app.listen(Number(env.PORT), "0.0.0.0", () => {
  console.log(`Users service running on port ${env.PORT}`);
});
