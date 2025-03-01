const express = require("express");
const router = express.Router();
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const FitUser = require("../models/FitUser");

// Validation schema for registration
const registrationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])/)
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.base":
        "Password must contain at least one number and one special character",
      "any.required": "Password is required",
    }),
  role: Joi.string().valid("trainee", "trainer").required().messages({
    "any.only": "Role must be either trainee or trainer",
    "any.required": "Role is required",
  }),
  profileDetails: Joi.when("role", {
    is: "trainee",
    then: Joi.object({
      age: Joi.number().integer().min(1).max(119).required().messages({
        "number.base": "Age must be a number",
        "number.integer": "Age must be an integer",
        "number.min": "Age must be greater than 0",
        "number.max": "Age must be less than 120",
        "any.required": "Age is required for trainees",
      }),
      weight: Joi.number().min(1).max(499).required().messages({
        "number.base": "Weight must be a number",
        "number.min": "Weight must be greater than 0",
        "number.max": "Weight must be less than 500",
        "any.required": "Weight is required for trainees",
      }),
      height: Joi.number().min(1).max(299).required().messages({
        "number.base": "Height must be a number",
        "number.min": "Height must be greater than 0",
        "number.max": "Height must be less than 300",
        "any.required": "Height is required for trainees",
      }),
    })
      .required()
      .messages({
        "any.required": "Profile details are required for trainees",
      }),
    otherwise: Joi.forbidden().messages({
      "any.unknown": "Profile details should not be provided for trainers",
    }),
  }),
});

// Registration endpoint
router.post("/register", async (req, res) => {
  try {
    // Validate request body
    const { error, value } = registrationSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));
      return res.status(400).json({ errors });
    }

    // Check if user already exists
    const existingUser = await FitUser.findOne({ email: value.email });
    if (existingUser) {
      return res.status(400).json({
        errors: [
          {
            field: "email",
            message: "Email already registered",
          },
        ],
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(value.password, salt);

    // Create new user
    const user = new FitUser({
      email: value.email,
      password: hashedPassword,
      role: value.role,
      ...(value.role === "trainee" && { profileDetails: value.profileDetails }),
    });

    // Save user to database
    await user.save();

    // Return success response
    res.status(201).json({
      message: "Registration successful",
      role: user.role,
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({
      errors: [
        {
          field: "server",
          message: "Internal server error occurred",
        },
      ],
    });
  }
});

module.exports = router;
