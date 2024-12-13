/**
 * Ratings Routes
 *
 * Overview:
 * This module defines API endpoints for managing user-submitted ratings for movies and TV shows.
 * It supports creating, updating, retrieving, and deleting ratings, providing robust functionality
 * for personalized user interactions within the application.
 *
 * Features:
 * - **GET `/api/ratings`**:
 *   - Retrieves all ratings submitted by the authenticated user.
 * - **POST `/api/ratings`**:
 *   - Adds a new rating or updates an existing rating for a specific movie or TV show.
 * - **DELETE `/api/ratings/:id`**:
 *   - Removes a specific rating by its ID.
 *
 * Middleware:
 * - Utilizes `authMiddleware` (`protectRoute`) to ensure all routes are accessible only to authenticated users.
 * - Attaches user details to requests for personalized data access and updates.
 *
 * Error Handling:
 * - Provides descriptive error messages and appropriate HTTP status codes for invalid requests or server errors.
 * - Logs server-side errors for debugging and monitoring purposes.
 *
 * Dependencies:
 * - **`express`**: For HTTP routing.
 * - **`authMiddleware`**: Protects routes using JWT-based authentication.
 * - **Rating Controller**: Implements business logic for handling ratings (CRUD operations).
 *
 * Usage Example:
 * ```javascript
 * import express from "express";
 * import ratingRoutes from "./routes/ratings.js";
 *
 * const app = express();
 * app.use("/api/ratings", ratingRoutes);
 *
 * app.listen(3000, () => {
 *   console.log("Server running on port 3000");
 * });
 * ```
 *
 * Future Enhancements:
 * - **Pagination**:
 *   - Add pagination support for `/api/ratings` to handle large datasets efficiently.
 * - **Search and Filter**:
 *   - Allow filtering ratings by `mediaType` (e.g., `movie`, `tv`) or rating score range.
 * - **Caching**:
 *   - Implement caching for frequently accessed ratings to improve performance.
 * - **Bulk Updates**:
 *   - Enable bulk updates or deletions for user convenience.
 */

import express from "express";
import {
  getRatings,
  addOrUpdateRating,
  deleteRating,
} from "../../controllers/ratingController.js";
import protectRoute from "../../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/ratings - Get all ratings for the authenticated user
router.get("/", protectRoute, getRatings);

// POST /api/ratings - Add or update a rating
router.post("/", protectRoute, addOrUpdateRating);

// DELETE /api/ratings/:id - Remove a rating
router.delete("/:id", protectRoute, deleteRating);

export default router;
