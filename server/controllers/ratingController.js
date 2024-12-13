/**
 * Rating Controller
 *
 * This module manages user ratings for content, enabling Create, Read, Update, and Delete (CRUD)
 * operations. It supports seamless integration with the user authentication system to ensure
 * ratings are user-specific and secure.
 *
 * ========================
 * **Core Functionalities**
 * ========================
 * 1. **Retrieve Ratings**:
 *    - Fetches all ratings for the authenticated user from the database.
 *    - Allows users to view their previously rated content along with the associated rating values.
 *
 * 2. **Add or Update Ratings**:
 *    - Enables users to add a new rating or update an existing rating for specific content.
 *    - Automatically handles duplicates by updating the existing rating if it already exists.
 *    - Supports rating values between 0 and 10, adhering to typical rating scales.
 *
 * 3. **Delete Ratings**:
 *    - Allows users to remove a rating by its database ID.
 *    - Ensures only existing ratings are deleted and validates ownership to prevent unauthorized deletions.
 *
 * ========================
 * **Key Features**
 * ========================
 * - **User-Specific Ratings**:
 *   - All operations are scoped to the authenticated user, ensuring data isolation and security.
 * - **Seamless Add/Update Logic**:
 *   - Combines the add and update logic into a single endpoint for simplicity and efficiency.
 * - **Validation**:
 *   - Enforces required fields (`tmdbId`, `rating`) and validates data types to ensure consistency.
 * - **Error Handling**:
 *   - Provides detailed error responses for missing fields, invalid input, or database operation failures.
 *
 * =====================
 * **Route Endpoints**
 * =====================
 * 1. **`GET /api/ratings`**:
 *    - Fetches all ratings for the authenticated user.
 *    - Returns an array of rating objects, including `tmdbId` and the rating value.
 *
 * 2. **`POST /api/ratings`**:
 *    - Adds a new rating or updates an existing rating for specific content.
 *    - Validates input and ensures the rating is scoped to the authenticated user.
 *    - Returns the created or updated rating object.
 *
 * 3. **`DELETE /api/ratings/:id`**:
 *    - Deletes a rating by its database ID.
 *    - Ensures only existing ratings associated with the authenticated user can be removed.
 *    - Returns a success message upon deletion.
 *
 * =====================
 * **Error Handling**
 * =====================
 * - **Validation Errors**:
 *   - Ensures `tmdbId` and `rating` are provided for adding or updating ratings.
 *   - Returns `400 Bad Request` for missing or invalid input.
 * - **Database Errors**:
 *   - Handles errors during database operations, such as invalid IDs or failed queries.
 *   - Returns appropriate HTTP status codes (`404 Not Found`, `500 Internal Server Error`).
 * - **Ownership Validation**:
 *   - Ensures only the owner of the rating can modify or delete it, preventing unauthorized access.
 *
 * ==========================
 * **Schema Integration**
 * ==========================
 * - **Rating Schema**:
 *   - Defines the structure of a rating document in the database, including:
 *     - `userId`: The authenticated user's ID (references the User model).
 *     - `tmdbId`: The unique ID of the content being rated (from TMDb).
 *     - `rating`: A numeric value between 0 and 10.
 *
 * ========================
 * **Future Enhancements**
 * ========================
 * 1. Add support for average ratings across all users to provide community-based insights.
 * 2. Integrate pagination for large datasets in the `GET /api/ratings` endpoint.
 * 3. Enable filtering by content type (e.g., movies or TV shows) for better organization.
 * 4. Implement a soft delete mechanism to allow users to recover accidentally removed ratings.
 * 5. Extend schema to include optional user comments or review text alongside the numeric rating.
 *
 * =========================
 * **Example Usage**
 * =========================
 * - **Fetching Ratings**:
 *   ```javascript
 *   GET /api/ratings
 *   Authorization: Bearer <JWT>
 *   Response: [
 *     { id: "1", tmdbId: "12345", rating: 8 },
 *     { id: "2", tmdbId: "67890", rating: 7 }
 *   ]
 *   ```
 * - **Adding or Updating a Rating**:
 *   ```javascript
 *   POST /api/ratings
 *   Authorization: Bearer <JWT>
 *   Body: { tmdbId: "12345", rating: 9 }
 *   Response: { id: "1", tmdbId: "12345", rating: 9 }
 *   ```
 * - **Deleting a Rating**:
 *   ```javascript
 *   DELETE /api/ratings/1
 *   Authorization: Bearer <JWT>
 *   Response: { message: "Rating removed" }
 *   ```
 */

import Rating from "../models/Ratings.js";

/**
 * Get all ratings for the authenticated user.
 */
export const getRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ userId: req.user.id });
    res.json(ratings);
  } catch (error) {
    console.error("Error fetching ratings:", error.message);
    res.status(500).json({ error: "Failed to fetch ratings" });
  }
};

/**
 * Add or update a rating for content.
 */
export const addOrUpdateRating = async (req, res) => {
  const { tmdbId, rating } = req.body;

  if (!tmdbId || typeof rating !== "number") {
    return res
      .status(400)
      .json({ error: "tmdbId and rating (0-10) are required" });
  }

  try {
    const existingRating = await Rating.findOne({
      userId: req.user.id,
      tmdbId,
    });

    if (existingRating) {
      existingRating.rating = rating;
      await existingRating.save();
      return res.json(existingRating);
    }

    const newRating = await Rating.create({
      userId: req.user.id,
      tmdbId,
      rating,
    });
    res.status(201).json(newRating);
  } catch (error) {
    console.error("Error adding/updating rating:", error.message);
    res.status(500).json({ error: "Failed to add/update rating" });
  }
};

/**
 * Remove a rating by ID.
 */
export const deleteRating = async (req, res) => {
  try {
    const deletedRating = await Rating.findByIdAndDelete(req.params.id);
    if (!deletedRating) {
      return res.status(404).json({ error: "Rating not found" });
    }
    res.json({ message: "Rating removed" });
  } catch (error) {
    console.error("Error removing rating:", error.message);
    res.status(500).json({ error: "Failed to remove rating" });
  }
};
