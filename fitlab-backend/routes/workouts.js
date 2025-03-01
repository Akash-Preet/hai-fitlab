const express = require("express");
const router = express.Router();
const Workout = require("../models/Workout");

// GET /api/workouts/search
router.get("/search", async (req, res) => {
  try {
    const { keyword } = req.query;

    // Validate keyword parameter
    if (!keyword || keyword.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Keyword parameter is required",
      });
    }

    // Create query using regex for all searchable fields
    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\-]/g, "\\$&");
    const searchRegex = new RegExp(escapedKeyword, "i");
    const query = {
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { goals: searchRegex },
        { keywords: searchRegex },
        { "exercises.name": searchRegex },
      ],
    };

    // Perform search with combined query
    const workouts = await Workout.find(query)
      .sort({ createdAt: -1 })
      .limit(20); // Limit results for performance

    // Handle no results found
    if (workouts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No workouts found matching your search criteria",
      });
    }

    // Return successful response with workouts
    res.json({
      success: true,
      count: workouts.length,
      data: workouts,
    });
  } catch (error) {
    console.error("Workout search error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error while searching workouts",
    });
  }
});

// GET /api/workouts/goals
router.get("/goals", async (req, res) => {
  try {
    // Get unique goals from all workouts
    const goals = await Workout.distinct("goals");

    res.json({
      success: true,
      data: goals,
    });
  } catch (error) {
    console.error("Goals fetch error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error while fetching goals",
    });
  }
});

module.exports = router;
