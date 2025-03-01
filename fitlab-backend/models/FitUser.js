const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      validate: {
        validator: function (value) {
          // Password must contain at least one number and one special character
          return /^(?=.*[0-9])(?=.*[!@#$%^&*])/.test(value);
        },
        message:
          "Password must contain at least one number and one special character",
      },
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: {
        values: ["trainee", "trainer"],
        message: "Role must be either trainee or trainer",
      },
    },
    profileDetails: {
      type: Object,
      required: function () {
        return this.role === "trainee";
      },
      validate: {
        validator: function (value) {
          if (this.role !== "trainee") return true;

          // Validate required fields for trainee
          if (!value || typeof value !== "object") return false;

          const { age, weight, height } = value;

          // Check if all required fields exist and are numbers
          if (!age || !weight || !height) return false;
          if (
            typeof age !== "number" ||
            typeof weight !== "number" ||
            typeof height !== "number"
          )
            return false;

          // Validate ranges
          return (
            Number.isInteger(age) &&
            age > 0 &&
            age < 120 && // Reasonable age range
            weight > 0 &&
            weight < 500 && // Weight in kg
            height > 0 &&
            height < 300 // Height in cm
          );
        },
        message:
          "Invalid profile details. For trainees, age (positive integer), weight (positive number), and height (positive number) are required and must be within reasonable ranges",
      },
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const FitUser = mongoose.model("FitUser", userSchema, "fit_users");

module.exports = FitUser;
