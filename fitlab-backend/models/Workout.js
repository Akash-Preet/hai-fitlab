const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  goals: [
    {
      type: String,
      enum: [
        "weight loss",
        "muscle gain",
        "endurance",
        "strength",
        "flexibility",
        "general fitness",
      ],
      required: true,
    },
  ],
  difficulty: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    required: true,
  },
  duration: {
    type: Number,
    required: true,
    min: 1,
  },
  exercises: [
    {
      name: {
        type: String,
        required: true,
      },
      sets: {
        type: Number,
        required: true,
      },
      reps: {
        type: Number,
        required: true,
      },
      instructions: String,
    },
  ],
  keywords: [
    {
      type: String,
      lowercase: true,
      trim: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create text indexes for search functionality
workoutSchema.index({
  title: "text",
  description: "text",
  goals: "text",
  "exercises.name": "text",
  keywords: "text",
});

module.exports = mongoose.model("Workout", workoutSchema);
