/**
 * Auth Controller
 *
 * This module handles user authentication, including registration and token generation.
 *
 * Functions:
 * - `registerUser`: Handles user registration, validates input, checks for duplicates,
 *   hashes passwords, creates a new user in the database, and generates a JWT.
 *
 * Design:
 * - Input validation ensures all required fields are provided.
 * - Secure password storage using bcrypt hashing.
 * - JWT generation for stateless authentication.
 *
 * Dependencies:
 * - `bcrypt`: For hashing passwords.
 * - `jsonwebtoken`: For generating JWT tokens.
 * - `User`: Mongoose model for interacting with the database.
 *

 * @desc Register a new user
 * @route POST /api/auth/register
 * @access Public
 */

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

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

export { registerUser };
