/**
 * Favorites Routes
 *
 * This module defines the Express routes for managing a user's favorite content.
 * It includes endpoints for retrieving, adding, updating, and deleting favorites,
 * with route-level protection through JWT-based authentication middleware.
 *
 * Key Features:
 * - **Protected Routes**: All endpoints require user authentication via `protectRoute`.
 * - **Comprehensive Favorites Management**:
 *   - Fetch all favorites for the authenticated user.
 *   - Add new favorites (e.g., movies or TV shows).
 *   - Update existing favorites with new attributes (e.g., mediaType).
 *   - Remove specific favorites by ID.
 * - **RESTful Design**: Routes are designed following REST principles for consistency and scalability.
 *
 * Route Details:
 * - `GET /api/favorites`:
 *   - Fetches all favorites for the authenticated user.
 *   - Requires a valid JWT for authentication.
 *   - Calls `getFavorites` from the `favoritesController`.
 * - `POST /api/favorites`:
 *   - Adds a new favorite to the user's collection.
 *   - Validates the request body and ensures no duplicates.
 *   - Calls `addFavorite` from the `favoritesController`.
 * - `DELETE /api/favorites/:id`:
 *   - Removes a specific favorite by its unique ID.
 *   - Ensures the favorite belongs to the authenticated user.
 *   - Calls `removeFavorite` from the `favoritesController`.
 * - `PUT /api/favorites/:id`:
 *   - Updates details of an existing favorite by ID.
 *   - Validates input fields before applying updates.
 *   - Calls `updateFavorite` from the `favoritesController`.
 *
 * Middleware:
 * - **`protectRoute`**:
 *   - Verifies the JWT token in the `Authorization` header.
 *   - Attaches user details to the request object for downstream use.
 *   - Denies access with appropriate status codes (`401 Unauthorized` or `403 Forbidden`) if the token is invalid or missing.
 *
 * Usage:
 * ```javascript
 * import express from "express";
 * import favoritesRouter from "./routes/favorites.js";
 *
 * const app = express();
 * app.use("/api/favorites", favoritesRouter);
 *
 * app.listen(3000, () => {
 *   console.log("Server running on port 3000");
 * });
 * ```
 *
 * Controller Functions:
 * - `getFavorites`: Retrieves the user's favorites from the database.
 * - `addFavorite`: Adds a new favorite after validating the request.
 * - `removeFavorite`: Deletes a favorite if it exists and belongs to the user.
 * - `updateFavorite`: Updates the specified favorite's attributes.
 *
 * Error Handling:
 * - **Authentication Errors**:
 *   - Returns `401 Unauthorized` for missing or invalid tokens.
 * - **Validation Errors**:
 *   - Responds with `400 Bad Request` for malformed or incomplete data.
 * - **Authorization Errors**:
 *   - Returns `403 Forbidden` if the user tries to access or modify favorites they don't own.
 * - **Not Found Errors**:
 *   - Returns `404 Not Found` for non-existent favorite items.
 *
 * Future Enhancements:
 * - **Pagination and Sorting**:
 *   - Add support for paginated and sorted responses in `getFavorites`.
 * - **Batch Operations**:
 *   - Implement batch addition or removal of favorites for enhanced user workflows.
 * - **Enhanced Validation**:
 *   - Validate `tmdbId` and `mediaType` against an external API (e.g., TMDb) for content consistency.
 *
 * Dependencies:
 * - **Express**: Framework for building and managing HTTP routes.
 * - **Middleware**: `protectRoute` for route-level authentication.
 * - **Controllers**: Encapsulates business logic for interacting with the `Favorite` model.
 */

import express from "express";
import protectRoute from "../../middleware/authMiddleware.js";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  updateFavorite,
} from "../../controllers/favoritesController.js";

const router = express.Router();

// GET /api/favorites - Get all favorites for the authenticated user
router.get("/", protectRoute, getFavorites);

// POST /api/favorites - Add a new favorite
router.post("/", protectRoute, addFavorite);

// DELETE /api/favorites/:id - Remove a favorite
router.delete("/:id", protectRoute, removeFavorite);

// PUT /api/favorites/:id - Update a favorite
router.put("/:id", protectRoute, updateFavorite);

export default router;
