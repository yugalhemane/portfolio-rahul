require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const seedDatabase = require("./config/seed");

const PORT = process.env.PORT || 5000;

// Initialize Database Connection
connectDB().then(async () => {
  // Seed Database default items if empty
  await seedDatabase();

  // Start server listening
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
  });
}).catch((err) => {
  console.error("Failed to connect to Database. Server not started.", err);
  process.exit(1);
});
