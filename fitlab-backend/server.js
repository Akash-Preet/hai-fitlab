require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const workoutRoutes = require("./routes/workouts");

const app = express();
const PORT = process.env.PORT || 5005;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", authRoutes);
app.use("/api/workouts", workoutRoutes);

// MongoDB Connection (only if not in test environment)
if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "fitlab",
    })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

  // Start Server
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
