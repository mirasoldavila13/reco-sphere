/**
 * Authentication Routes
 *
 * Overview:
 * This module provides a comprehensive set of API endpoints to manage user authentication and profile operations. It ensures secure access to user-specific resources through middleware and enforces data integrity with robust validation.
 *
 * Key Endpoints:
 * - **POST `/api/auth/register`**: Public endpoint for user registration.
 * - **POST `/api/auth/login`**: Public endpoint for user authentication.
 * - **GET `/api/auth/dashboard`**: Private endpoint for retrieving the authenticated user's profile.
 * - **PUT `/api/auth/update`**: Private endpoint for updating the user's profile information.
 * - **DELETE `/api/auth/delete`**: Private endpoint for deleting the user's account.
 * - **GET `/api/auth/:userId/preferences`**: Private endpoint for fetching user-specific preferences.
 * - **POST `/api/auth/:userId/preferences`**: Private endpoint for adding preferences to a user's profile.
 *
 * Security:
 * - **JWT Authentication**:
 *   - Uses the `protectRoute` middleware to ensure only authenticated users can access sensitive routes.
 *   - Verifies the JWT token from the `Authorization` header, extracts the user information, and injects it into the request object for downstream operations.
 * - **Access Control**:
 *   - Enforces ownership on preference-related routes, ensuring users can only access or modify their own data.
 *
 * Features:
 * - **User Registration and Login**:
 *   - Hashes passwords securely during registration.
 *   - Issues JWT tokens upon successful login.
 * - **User Profile Management**:
 *   - Allows users to view, update, and delete their accounts.
 *   - Supports updating user preferences with real-time validation.
 * - **Error Handling**:
 *   - Provides descriptive error messages and status codes for client-side debugging.
 *   - Logs server-side errors for better maintainability.
 * - **Flexible Preference Management**:
 *   - Enables users to fetch and update their preferences dynamically.
 *
 * Technologies and Design Considerations:
 * - **Separation of Concerns**:
 *   - Delegates core logic to controllers and middleware for maintainability and readability.
 * - **Validation**:
 *   - Uses Mongoose validations to ensure input data integrity when interacting with the database.
 * - **Extendability**:
 *   - Easily scalable for adding new user-related features, such as profile pictures, role-based access control, or enhanced preference settings.
 *
 * Example Usage:
 * ```javascript
 * import express from "express";
 * import authRoutes from "./routes/authRoutes.js";
 *
 * const app = express();
 * app.use("/api/auth", authRoutes);
 *
 * app.listen(3000, () => {
 *   console.log("Server running on port 3000");
 * });
 * ```
 *
 * Potential Enhancements:
 * - **Multi-Factor Authentication**:
 *   - Add support for two-factor authentication (2FA) during login for enhanced security.
 * - **Password Reset**:
 *   - Include endpoints for initiating and completing password reset workflows.
 * - **Role-Based Access Control (RBAC)**:
 *   - Allow differentiation between user roles (e.g., admin, user) to restrict certain actions.
 * - **Activity Logs**:
 *   - Track user login and update activities for security auditing.
 */

import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
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

/**
 * @desc Update user profile
 * @route PUT /api/auth/update
 * @access Private
 */
router.put("/update", protectRoute, async (req, res) => {
  try {
    const { name, preferences } = req.body;

    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, preferences },
      { new: true, runValidators: true }, // Return the updated user and validate inputs
    ).select("-password"); // Exclude the password

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user profile:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * @desc Delete user profile
 * @route DELETE /api/auth/delete
 * @access Private
 */
router.delete("/delete", protectRoute, async (req, res) => {
  try {
    // Delete the user from the database
    const deletedUser = await User.findByIdAndDelete(req.user.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User account deleted successfully" });
  } catch (error) {
    console.error("Error deleting user profile:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:userId/preferences", protectRoute, async (req, res) => {
  const { userId } = req.params;
  if (req.user.id !== userId) {
    return res.status(403).json({ error: "Access denied" });
  }
  const user = await User.findById(userId);
  res.json({ preferences: user.preferences });
});

router.post("/:userId/preferences", protectRoute, async (req, res) => {
  const { userId } = req.params;
  const { preference } = req.body;
  if (req.user.id !== userId) {
    return res.status(403).json({ error: "Access denied" });
  }
  const user = await User.findById(userId);
  user.preferences.push(preference);
  await user.save();
  res.json({ preferences: user.preferences });
});

export default router;
