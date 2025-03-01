/**
 * Main server file for the Todo application
 * Sets up Express server, MongoDB connection, and middleware
 */

// Load environment variables from .env file
require("dotenv").config();

// Import required dependencies
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const todoRoutes = require("./routes/todoRoutes");

// Initialize Express application
const app = express();

// Set port from environment variables or use default 5002
const PORT = process.env.PORT || 5002;

// Middleware Configuration
// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());
// Parse incoming JSON requests
app.use(express.json());

// Route Configuration
// Mount todo routes under /todos path
app.use("/todos", todoRoutes);

// MongoDB Connection Configuration
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "todo-app", // Specify database name
    useNewUrlParser: true, // Use new URL parser
    useUnifiedTopology: true, // Use new Server Discover and Monitoring engine
  })
  .then(() => console.log("✅ MongoDB Connected")) // Log successful connection
  .catch((err) => console.error("❌ MongoDB Connection Error:", err)); // Log connection errors

// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});