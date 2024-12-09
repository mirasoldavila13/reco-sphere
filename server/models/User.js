/**
 * User Model
 *
 * This module defines the schema and model for storing user-related data
 * in the MongoDB database. It includes fields for user credentials,
 * preferences, and usage history, along with validations to ensure
 * data integrity and consistency.
 *
 * Key Features:
 * - Stores essential user information like name, email, and password.
 * - Supports customizable user preferences and content history.
 * - Implements validation for fields to maintain data quality.
 * - Automatically manages creation and update timestamps.
 *
 * Usage:
 * 1. Import this model into services or controllers to manage user accounts.
 * 2. Use it to create, update, or query users within the database.
 */

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email address format"], // Email regex validation
    },
    password: {
      type: String,
      required: [true, "Password is required"], // Ensures the field exists
      minlength: [8, "Password must be at least 8 characters long"], // Minimum length
      validate: {
        validator(value) {
          return value.trim().length > 0; // Ensures it's not empty or just spaces
        },
        message: "Password cannot be empty or contain only spaces",
      },
    },
    preferences: {
      type: [String],
      default: [],
      validate: {
        validator(arr) {
          return arr.every((pref) => typeof pref === "string");
        },
        message: "Preferences must be an array of strings",
      },
    },
    history: {
      type: [String],
      default: [],
      validate: {
        validator(arr) {
          return arr.every((id) => typeof id === "string");
        },
        message: "History must be an array of valid IDs",
      },
    },
  },
  { timestamps: true }, // Adds createdAt and updatedAt timestamps
);

const User = mongoose.model("User", userSchema);

export default User;
