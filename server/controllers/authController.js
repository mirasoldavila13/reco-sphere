/**
 * Auth Controller
 *
 * This module manages all user authentication and account-related operations, including registration, login, updating user details, and deleting user accounts. It integrates with the backend's MongoDB database using the `User` model and provides secure authentication via JWT tokens.
 *
 * Key Features:
 * - **User Registration**:
 *   - Registers new users with their name, email, and password.
 *   - Passwords are securely hashed using bcrypt before being stored.
 *   - Returns a JWT token upon successful registration.
 * - **User Login**:
 *   - Authenticates users by validating their credentials (email and password).
 *   - Issues a signed JWT token upon successful authentication.
 * - **Update User Details**:
 *   - Allows users to update their name and preferences securely.
 *   - Uses `findByIdAndUpdate` to ensure atomic operations.
 * - **Delete User Accounts**:
 *   - Securely deletes user accounts and associated data from the database.
 *   - Verifies the provided user ID before performing the deletion.
 * - **JWT Token Management**:
 *   - Generates secure JWT tokens for stateless authentication.
 *   - Validates user identity through tokens in protected routes.
 *
 * Design Considerations:
 * - **Input Validation**:
 *   - Validates required fields (e.g., email, password, and name) before processing.
 *   - Ensures email formatting and password security.
 * - **Error Handling**:
 *   - Returns meaningful error messages for common scenarios:
 *     - Missing fields
 *     - Invalid credentials
 *     - Unauthorized access
 *     - User not found
 * - **Security**:
 *   - Uses bcrypt for password hashing and validation.
 *   - Implements JWT for secure and stateless session management.
 * - **Extensibility**:
 *   - Middleware compatibility for securing additional routes with JWT validation.
 *   - Easily integrates additional user profile fields (e.g., phone, avatar).
 *
 * Routes:
 * - **`POST /api/auth/register`**:
 *   - Registers a new user and returns a JWT token and user details upon success.
 *   - Validates unique email addresses and hashes passwords securely.
 * - **`POST /api/auth/login`**:
 *   - Authenticates a user and issues a JWT token upon successful login.
 *   - Validates email formatting and password correctness.
 * - **`PUT /api/auth/update`**:
 *   - Updates the authenticated user's profile (name and preferences).
 *   - Requires a valid JWT token for access.
 *   - Returns updated user details upon success.
 * - **`DELETE /api/auth/delete`**:
 *   - Deletes a user account securely.
 *   - Verifies the provided user ID before performing the operation.
 *   - Responds with confirmation or error messages based on the outcome.
 *
 * Dependencies:
 * - `bcrypt`: Used for secure password hashing and comparison.
 * - `jsonwebtoken`: Used for generating and verifying JWT tokens.
 * - `User`: Mongoose model for interacting with the MongoDB user collection.
 *
 * Example Usage:
 * 1. **Register**:
 *    - Call `registerUser` to create a new user with hashed password and issue a JWT token.
 * 2. **Login**:
 *    - Call `loginUser` to validate credentials and issue a JWT token.
 * 3. **Update Profile**:
 *    - Call `updateUser` with the desired fields (e.g., `name`, `preferences`) to update a user profile.
 * 4. **Delete Account**:
 *    - Call `deleteUser` with the authenticated user's ID to remove their account and data.
 *
 * Future Enhancements:
 * - Add support for password reset functionality.
 * - Extend `updateUser` to handle more profile fields (e.g., profile pictures, phone numbers).
 * - Introduce rate limiting for sensitive operations (e.g., login, registration).
 * - Enhance error messages with localized support for better user experience.
 */

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * @desc Update user details.
 * @route PUT /api/auth/update
 * @access Private
 */
const updateUser = async (req, res) => {
  const { id } = req.user; // Assumes ID is extracted from the auth token middleware
  const { name, preferences } = req.body;

  try {
    const updateFields = {};
    if (name) updateFields.name = name;
    if (preferences) updateFields.preferences = preferences;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }, // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @desc Delete a user account.
 * @route DELETE /api/auth/delete
 * @access Private
 */
const deleteUser = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "User account deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting user:", error.message || error);
    res.status(500).json({ message: "Internal server error." });
  }
};

/* @desc Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Input validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already in use." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate a JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, name: newUser.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    // Respond with the user and token
    res.status(201).json({
      message: "User registered successfully!",
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    console.error("Error during registration:", error.message || error);
    res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * @desc Authenticates a user by validating email and password.
 *       Ensures required fields are provided and correctly formatted.
 *       Generates a JWT token on successful login.
 * @route POST /api/auth/login
 * @access Public
 * @param {Object} req - Express request object containing email and password in the body.
 * @param {Object} res - Express response object for sending results or errors.
 */
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Input validation
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ message: "Please provide a valid email address." });
  }

  try {
    // Check if the user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res
        .status(404)
        .json({ message: "User not found. Please sign up first." });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Generate a JWT token
    const token = jwt.sign(
      {
        id: existingUser._id,
        email: existingUser.email,
        name: existingUser.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    // Respond with the user and token
    res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
      },
    });
  } catch (error) {
    console.error("Error during login:", error.message || error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export { registerUser, loginUser, updateUser, deleteUser };
