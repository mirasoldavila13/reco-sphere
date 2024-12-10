/**
 * Auth Controller
 *
 * This module handles all aspects of user authentication and account management,
 * including registration, login, and secure credential validation.
 *
 * Key Features:
 * - **User Registration**: Allows new users to register by providing their name, email, and password.
 *   Passwords are securely hashed before being stored in the database.
 * - **User Login**: Authenticates users by validating their credentials (email and password),
 *   issuing a JWT token upon successful login.
 * - **JWT Token Generation**: Provides secure, stateless authentication by issuing signed JWT tokens.
 *
 * Design Considerations:
 * - **Input Validation**: Ensures all required fields are present and correctly formatted.
 * - **Error Messages**: Detailed error messages for easy troubleshooting and better user feedback.
 * - **Security**: Utilizes bcrypt for secure password hashing and validation, and JWT for stateless
 *   session management.
 * - **Extensibility**: Easily integrates with middleware to secure protected routes using JWT tokens.
 *
 * Routes:
 * - **`POST /api/auth/register`**:
 *   - Registers a new user with name, email, and password.
 *   - Returns a JWT token and the registered user's details upon success.
 *   - Returns a detailed error response if validation fails or the email is already in use.
 * - **`POST /api/auth/login`**:
 *   - Authenticates an existing user by validating their email and password.
 *   - Returns a JWT token and user details upon success.
 *   - Returns a detailed error response for invalid credentials or missing fields.
 *
 * Dependencies:
 * - `bcrypt`: Securely hashes passwords and validates hashed passwords.
 * - `jsonwebtoken`: Generates and verifies JWT tokens for secure authentication.
 * - `User`: Mongoose model for interacting with the MongoDB user collection.
 */

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

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

export { registerUser, loginUser };
