/**
 * User Model
 *
 * This module defines the schema and model for storing and managing user-related data
 * in the MongoDB database. It is a core component for user authentication, profile management,
 * and personalized content delivery systems.
 *
 * Key Features:
 * - **User Credentials**:
 *   - Stores user authentication information such as name, email, and hashed password.
 *   - Enforces strong validation rules to maintain data integrity.
 * - **Preferences and History**:
 *   - Tracks user-specific preferences and their interaction history with content.
 *   - Designed for extensibility to support personalized recommendations and engagement analytics.
 * - **Data Validation**:
 *   - Ensures proper formatting for fields like email and password.
 *   - Protects against invalid or inconsistent data inputs.
 * - **Automatic Timestamps**:
 *   - Uses Mongoose's `timestamps` feature to manage record creation and update dates.
 *
 * Schema Details:
 * - **Fields**:
 *   - `name` (String, required): Stores the user's full name with validation for length and format.
 *   - `email` (String, required): Unique email identifier for login, validated with a regex pattern.
 *   - `password` (String, required): Stores the user's hashed password, ensuring security and validation for non-empty inputs.
 *   - `preferences` (Array of Strings, optional): Tracks user-defined categories, genres, or tags of interest.
 *   - `history` (Array of Strings, optional): Logs content IDs representing user interactions.
 * - **Timestamps**:
 *   - Automatically adds `createdAt` and `updatedAt` fields for lifecycle tracking.
 *
 * Usage:
 * - **Authentication**:
 *   - Store and verify user credentials during login and registration workflows.
 * - **Personalization**:
 *   - Leverage `preferences` and `history` fields to tailor recommendations and user experiences.
 * - **Analytics**:
 *   - Analyze user behavior by querying the `history` field for trends and engagement metrics.
 *
 * Example Use Cases:
 * ```javascript
 * import User from './models/User.js';
 *
 * // Create a new user
 * const newUser = new User({
 *   name: "Jane Doe",
 *   email: "jane.doe@example.com",
 *   password: hashedPassword, // Password should be hashed before saving
 *   preferences: ["Sci-Fi", "Action"],
 *   history: ["content123", "content456"],
 * });
 * await newUser.save();
 *
 * // Find a user by email
 * const user = await User.findOne({ email: "jane.doe@example.com" });
 *
 * // Update user preferences
 * await User.findByIdAndUpdate(user._id, { $set: { preferences: ["Drama", "Mystery"] } });
 *
 * // Delete a user
 * await User.findByIdAndDelete(user._id);
 * ```
 *
 * Security and Best Practices:
 * - **Password Security**:
 *   - Always hash passwords before saving to the database (e.g., using `bcrypt`).
 *   - Never expose password fields in queries or APIs.
 * - **Validation**:
 *   - Ensure the `email` field is unique and correctly formatted.
 *   - Use strong regex patterns to validate emails and sanitize inputs.
 * - **Data Integrity**:
 *   - Use schema-level validation for `preferences` and `history` to prevent invalid data.
 * - **Error Handling**:
 *   - Handle `unique` index violations for `email` to provide meaningful feedback to users.
 *
 * Future Enhancements:
 * - **Role-Based Access Control (RBAC)**:
 *   - Extend the schema to include roles (e.g., "admin", "editor", "user") for advanced permissions.
 * - **User Activity Tracking**:
 *   - Add fields to log user login timestamps or IP addresses for security purposes.
 * - **Data Encryption**:
 *   - Encrypt sensitive fields like preferences or history if privacy compliance is required.
 *
 * Technologies:
 * - **Mongoose**: Provides schema validation, indexing, and robust query capabilities.
 * - **MongoDB**: Scales for large datasets of user profiles and interactions.
 *
 * Summary:
 * The `User` model serves as a foundational layer for managing authentication, personalization, and user data.
 * Its design ensures security, scalability, and extensibility for modern web applications.
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
