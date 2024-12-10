/**
 * Auth Routes
 *
 * Defines routes related to authentication, including user registration, login, and access to protected resources.
 *
 * Routes:
 * - `POST /api/auth/register`: Public route for registering a new user.
 * - `POST /api/auth/login`: Public route for logging in an existing user.
 * - `GET /api/auth/dashboard`: Protected route that retrieves the authenticated user's profile.
 *
 * Middleware:
 * - Uses `protectRoute` to secure the `GET /dashboard` route.
 *
 * Design Considerations:
 * - Ensures separation of concerns by delegating route logic to controllers and middleware.
 * - Returns detailed error messages for better client-side error handling.
 */

import express from "express";
import { registerUser } from "../controllers/authController.js";
import { loginUser } from "../controllers/authController.js";
import protectRoute from "../middleware/authMiddleware.js";

import User from "../models/User.js";

const router = express.Router();

/**
 * @desc Register route
 * @route POST /api/auth/register
 * @access Public
 */
router.post("/register", registerUser);

/**
 * @desc Login route
 * @route POST /api/auth/login
 * @access Public
 */
router.post("/login", loginUser);

/**
 * @desc Dashboard route
 * @route GET /api/auth/dashboard
 * @access Private
 */
router.get("/dashboard", protectRoute, async (req, res) => {
  try {
    // Find the user in the database based on the ID in the JWT
    const user = await User.findById(req.user.id).select("-password"); // Exclude the password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the user's profile data
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
