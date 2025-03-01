/**
 * Main server file for the Fitness Application
 * Sets up Express server, database connection, and routes
 * Handles authentication and workout-related endpoints
 */

// Load environment variables from .env file
require("dotenv").config();

// Import required dependencies
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const workoutRoutes = require("./routes/workouts");

// Initialize Express application
const app = express();

// Set port from environment variables or use default 5005
const PORT = process.env.PORT || 5005;

// Middleware Configuration
// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());
// Parse incoming JSON requests
app.use(express.json());

// Route Configuration
// Authentication routes (login, register, etc.)
app.use("/api", authRoutes);
// Workout-related routes (CRUD operations for workouts)
app.use("/api/workouts", workoutRoutes);

// Database Connection
// Only connect to MongoDB if not in test environment
if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "fitlab", // Specify database name
    })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

  // Start the server and listen on specified port
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

// Export app for testing purposes
module.exports = app;