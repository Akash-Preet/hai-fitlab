const mongoose = require("mongoose");
const Workout = require("../models/Workout");
require("dotenv").config();

const workouts = [
  {
    title: "HIIT Fat Burner",
    description:
      "High-intensity interval training designed for maximum calorie burn and weight loss",
    goals: ["weight loss", "endurance"],
    difficulty: "intermediate",
    duration: 30,
    exercises: [
      {
        name: "Burpees",
        sets: 3,
        reps: 15,
        instructions: "Full body explosive movement",
      },
      {
        name: "Mountain Climbers",
        sets: 3,
        reps: 30,
        instructions: "Keep core tight throughout",
      },
      {
        name: "Jump Squats",
        sets: 3,
        reps: 20,
        instructions: "Land softly and immediately repeat",
      },
    ],
    keywords: ["hiit", "cardio", "fat burn", "intense"],
  },
  {
    title: "Strength Foundation",
    description: "Basic strength training routine perfect for beginners",
    goals: ["muscle gain", "strength"],
    difficulty: "beginner",
    duration: 45,
    exercises: [
      {
        name: "Push-ups",
        sets: 3,
        reps: 10,
        instructions: "Keep body straight throughout",
      },
      {
        name: "Bodyweight Squats",
        sets: 3,
        reps: 15,
        instructions: "Keep knees aligned with toes",
      },
      {
        name: "Dumbbell Rows",
        sets: 3,
        reps: 12,
        instructions: "Pull weight to hip level",
      },
    ],
    keywords: ["strength", "basics", "beginner friendly"],
  },
  {
    title: "Endurance Builder",
    description: "Cardiovascular workout to improve stamina and endurance",
    goals: ["endurance", "general fitness"],
    difficulty: "intermediate",
    duration: 40,
    exercises: [
      {
        name: "Running",
        sets: 1,
        reps: 1,
        instructions: "20 minutes at moderate pace",
      },
      {
        name: "Jump Rope",
        sets: 3,
        reps: 50,
        instructions: "Maintain consistent rhythm",
      },
      {
        name: "High Knees",
        sets: 3,
        reps: 30,
        instructions: "Drive knees up with power",
      },
    ],
    keywords: ["cardio", "stamina", "endurance training"],
  },
  {
    title: "Power Yoga Flow",
    description: "Dynamic yoga sequence focusing on flexibility and strength",
    goals: ["flexibility", "general fitness"],
    difficulty: "intermediate",
    duration: 50,
    exercises: [
      {
        name: "Sun Salutations",
        sets: 3,
        reps: 1,
        instructions: "Flow through poses mindfully",
      },
      {
        name: "Warrior Sequences",
        sets: 2,
        reps: 1,
        instructions: "Hold each pose for 5 breaths",
      },
      {
        name: "Balance Poses",
        sets: 2,
        reps: 1,
        instructions: "Focus on steady breathing",
      },
    ],
    keywords: ["yoga", "flexibility", "mindfulness"],
  },
  {
    title: "Advanced Strength",
    description: "Challenging compound exercises for experienced lifters",
    goals: ["strength", "muscle gain"],
    difficulty: "advanced",
    duration: 60,
    exercises: [
      {
        name: "Deadlifts",
        sets: 5,
        reps: 5,
        instructions: "Maintain neutral spine",
      },
      {
        name: "Bench Press",
        sets: 5,
        reps: 5,
        instructions: "Full range of motion",
      },
      { name: "Pull-ups", sets: 4, reps: 8, instructions: "Control descent" },
    ],
    keywords: ["strength training", "powerlifting", "advanced"],
  },
  {
    title: "Core Crusher",
    description: "Intensive core workout for building strong abs",
    goals: ["strength", "general fitness"],
    difficulty: "intermediate",
    duration: 25,
    exercises: [
      { name: "Planks", sets: 3, reps: 1, instructions: "Hold for 60 seconds" },
      {
        name: "Russian Twists",
        sets: 3,
        reps: 20,
        instructions: "Control the movement",
      },
      {
        name: "Leg Raises",
        sets: 3,
        reps: 15,
        instructions: "Keep lower back pressed down",
      },
    ],
    keywords: ["core", "abs", "stability"],
  },
  {
    title: "Weight Loss Circuit",
    description: "Full-body circuit training for fat loss",
    goals: ["weight loss", "endurance"],
    difficulty: "beginner",
    duration: 35,
    exercises: [
      {
        name: "Jumping Jacks",
        sets: 3,
        reps: 30,
        instructions: "Keep pace consistent",
      },
      {
        name: "Bodyweight Lunges",
        sets: 3,
        reps: 20,
        instructions: "Alternate legs",
      },
      {
        name: "Push-ups",
        sets: 3,
        reps: 10,
        instructions: "Modify on knees if needed",
      },
    ],
    keywords: ["circuit training", "fat loss", "beginner friendly"],
  },
  {
    title: "Muscle Builder Pro",
    description: "Hypertrophy-focused workout for muscle growth",
    goals: ["muscle gain"],
    difficulty: "advanced",
    duration: 55,
    exercises: [
      {
        name: "Barbell Squats",
        sets: 4,
        reps: 12,
        instructions: "Focus on form",
      },
      {
        name: "Dumbbell Press",
        sets: 4,
        reps: 12,
        instructions: "Control the weight",
      },
      {
        name: "Barbell Rows",
        sets: 4,
        reps: 12,
        instructions: "Squeeze at top",
      },
    ],
    keywords: ["hypertrophy", "muscle building", "strength"],
  },
  {
    title: "Flexibility Focus",
    description: "Dynamic stretching routine for improved flexibility",
    goals: ["flexibility"],
    difficulty: "beginner",
    duration: 40,
    exercises: [
      {
        name: "Dynamic Stretches",
        sets: 2,
        reps: 10,
        instructions: "Move through full range",
      },
      {
        name: "Yoga Poses",
        sets: 1,
        reps: 1,
        instructions: "Hold each pose for 30 seconds",
      },
      {
        name: "Mobility Work",
        sets: 2,
        reps: 10,
        instructions: "Focus on problem areas",
      },
    ],
    keywords: ["stretching", "mobility", "flexibility"],
  },
  {
    title: "Endurance Max",
    description: "Long-duration cardio workout for maximum endurance",
    goals: ["endurance"],
    difficulty: "advanced",
    duration: 75,
    exercises: [
      {
        name: "Interval Running",
        sets: 1,
        reps: 1,
        instructions: "Alternate sprint and jog",
      },
      {
        name: "Cycling",
        sets: 1,
        reps: 1,
        instructions: "Maintain steady pace",
      },
      {
        name: "Stair Climber",
        sets: 1,
        reps: 1,
        instructions: "Keep heart rate elevated",
      },
    ],
    keywords: ["cardio", "endurance", "stamina"],
  },
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing workouts
    await Workout.deleteMany({});
    console.log("Cleared existing workouts");

    // Insert new workouts
    await Workout.insertMany(workouts);
    console.log("Successfully seeded workouts");

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

// Run the seeding function
seedDatabase();
