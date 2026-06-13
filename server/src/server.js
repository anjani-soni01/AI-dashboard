const app = require("./app");
const connectDB = require("./config/db");
const { env } = require("./config/env");

connectDB()
  .then(() => {
    app.listen(env.port, () => {
      console.log(`AI Notice Board API running on port ${env.port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  });
