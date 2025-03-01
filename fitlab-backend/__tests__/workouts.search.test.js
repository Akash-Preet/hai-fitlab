const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const app = require("../server");
const Workout = require("../models/Workout");

describe("Workout Search API", () => {
  let mongoServer;

  beforeAll(async () => {
    // Setup MongoDB Memory Server
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Workout.deleteMany({});
  });

  // Test data
  const sampleWorkouts = [
    {
      title: "Weight Loss HIIT",
      description: "High intensity interval training for weight loss",
      goals: ["weight loss", "endurance"],
      difficulty: "intermediate",
      duration: 30,
      exercises: [
        { name: "Burpees", sets: 3, reps: 10 },
        { name: "Mountain Climbers", sets: 3, reps: 20 },
      ],
      keywords: ["hiit", "cardio", "fat burn", "weight-loss"],
    },
    {
      title: "Muscle Building Basics",
      description: "Fundamental exercises for muscle gain",
      goals: ["muscle gain", "strength"],
      difficulty: "beginner",
      duration: 45,
      exercises: [
        { name: "Squats", sets: 4, reps: 12 },
        { name: "Bench Press", sets: 4, reps: 10 },
      ],
      keywords: ["strength training", "muscle", "beginner friendly"],
    },
  ];

  describe("GET /api/workouts/search", () => {
    beforeEach(async () => {
      await Workout.insertMany(sampleWorkouts);
    });

    // Test valid keyword search
    test("should return workouts matching valid keyword", async () => {
      const response = await request(app)
        .get("/api/workouts/search")
        .query({ keyword: "weight loss" });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].title).toBe("Weight Loss HIIT");
    });

    // Test case-insensitive search
    test("should perform case-insensitive search", async () => {
      const response = await request(app)
        .get("/api/workouts/search")
        .query({ keyword: "HIIT" });

      expect(response.status).toBe(200);
      expect(response.body.data[0].title).toBe("Weight Loss HIIT");
    });

    // Test search by goal
    test("should find workouts by goal", async () => {
      const response = await request(app)
        .get("/api/workouts/search")
        .query({ keyword: "muscle gain" });

      expect(response.status).toBe(200);
      expect(response.body.data[0].title).toBe("Muscle Building Basics");
    });

    // Test search with no results
    test("should return 404 when no workouts match", async () => {
      const response = await request(app)
        .get("/api/workouts/search")
        .query({ keyword: "nonexistent" });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        "No workouts found matching your search criteria"
      );
    });

    // Test missing keyword parameter
    test("should return 400 when keyword is missing", async () => {
      const response = await request(app).get("/api/workouts/search").query({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe("Keyword parameter is required");
    });

    // Test empty keyword parameter
    test("should return 400 when keyword is empty", async () => {
      const response = await request(app)
        .get("/api/workouts/search")
        .query({ keyword: "" });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    // Test search by exercise name
    test("should find workouts by exercise name", async () => {
      const response = await request(app)
        .get("/api/workouts/search")
        .query({ keyword: "Burpees" });

      expect(response.status).toBe(200);
      expect(response.body.data[0].exercises).toEqual(
        expect.arrayContaining([expect.objectContaining({ name: "Burpees" })])
      );
    });

    // Test search result limit
    test("should limit search results to 20 items", async () => {
      // Create 25 similar workouts
      const manyWorkouts = Array(25)
        .fill()
        .map((_, i) => ({
          ...sampleWorkouts[0],
          title: `Workout ${i}`,
          description: `Description ${i}`,
        }));
      await Workout.insertMany(manyWorkouts);

      const response = await request(app)
        .get("/api/workouts/search")
        .query({ keyword: "Workout" });

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeLessThanOrEqual(20);
    });

    // Test search with special characters
    test("should handle special characters in search", async () => {
      const response = await request(app)
        .get("/api/workouts/search")
        .query({ keyword: "weight-loss" });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
