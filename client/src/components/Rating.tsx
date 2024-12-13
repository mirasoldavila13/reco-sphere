/**
 * Rating Component
 *
 * A reusable React component for rating content on a scale of 1 to 10.
 * It supports fetching and submitting ratings for authenticated users and provides real-time feedback.
 *
 * =============================
 * **Core Features**
 * =============================
 * 1. **User Ratings**:
 *    - Allows users to rate content on a scale of 1 to 10.
 *    - Displays the user's current rating or prompts to rate if not yet rated.
 *
 * 2. **Dynamic Rating State**:
 *    - Tracks and displays the current rating.
 *    - Provides hover effects for visual feedback.
 *
 * 3. **Integration with Backend**:
 *    - Fetches the user's existing rating from the backend when the component mounts.
 *    - Submits new or updated ratings to the backend via an API call.
 *
 * =============================
 * **Implementation Details**
 * =============================
 * - **Initial Rating Fetch**:
 *   - Uses `useEffect` to fetch the user's existing rating for the given `tmdbId`.
 *   - Displays the fetched rating or defaults to 0 if no rating exists.
 *
 * - **Rating Submission**:
 *   - Submits the selected rating to the backend via a POST request.
 *   - Updates the rating state upon successful submission.
 *
 * - **Error Handling**:
 *   - Displays error messages for issues like network errors or authentication failures.
 *
 * ============================
 * **Component Props**
 * ============================
 * - `tmdbId`: A unique identifier for the content being rated.
 * - `initialRating` (optional): The initial rating value to display (default is 0).
 * - `onRatingChange` (optional): A callback function triggered when the rating changes.
 *
 * ============================
 * **State Management**
 * ============================
 * - `rating`: The current rating value.
 * - `hoverRating`: Tracks the rating value currently hovered by the user.
 * - `error`: Stores error messages for display.
 *
 * ============================
 * **User Interaction**
 * ============================
 * - Users can hover over buttons to preview a rating visually.
 * - Clicking a button submits the selected rating.
 *
 * ============================
 * **Error Handling**
 * ============================
 * - **Authentication Errors**:
 *   - Prompts users to log in if they attempt to rate without authentication.
 * - **Network Errors**:
 *   - Displays a fallback error message for network or API issues.
 *
 * ============================
 * **Key Dependencies**
 * ============================
 * - **authService**:
 *   - Handles user authentication and retrieves the authentication token.
 * - **API Integration**:
 *   - Fetches and submits ratings to the backend.
 *
 * ============================
 * **Example Usage**
 * ============================
 * ```tsx
 * import Rating from "./Rating";
 *
 * const handleRatingUpdate = (newRating) => {
 *   console.log("New rating:", newRating);
 * };
 *
 * <Rating
 *   tmdbId="12345"
 *   initialRating={8}
 *   onRatingChange={handleRatingUpdate}
 * />
 * ```
 *
 * ============================
 * **Future Enhancements**
 * ============================
 * - Implement average ratings display for non-authenticated users.
 * - Add role-based restrictions for rating certain content.
 * - Include additional feedback, such as a success toast upon rating submission.
 */

import React, { useState, useEffect } from "react";
import authService from "../services/authService";

interface RatingProps {
  tmdbId: string;
  initialRating?: number;
  onRatingChange?: (newRating: number) => void; // Callback to notify parent component
}

const Rating: React.FC<RatingProps> = ({
  tmdbId,
  initialRating = 0,
  onRatingChange,
}) => {
  const [rating, setRating] = useState<number>(initialRating); // Track the current rating
  const [hoverRating, setHoverRating] = useState<number | null>(null); // Track hover state
  const [error, setError] = useState<string | null>(null); // Handle errors

  // Fetch existing rating when the component mounts
  useEffect(() => {
    const fetchRating = async () => {
      try {
        const token = authService.getAuthToken();
        if (!token) return;

        const response = await fetch(`/api/ratings?tmdbId=${tmdbId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setRating(data.rating || 0); // Set the fetched rating
        }
      } catch (error) {
        console.error("Error fetching rating:", error);
        setError("Failed to load rating. Please try again.");
      }
    };

    fetchRating();
  }, [tmdbId]);

  // Handle rating submission
  const handleRatingClick = async (newRating: number) => {
    try {
      const token = authService.getAuthToken();
      if (!token) {
        setError("You must be logged in to rate content.");
        return;
      }

      const response = await fetch("/api/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tmdbId, rating: newRating }),
      });

      if (response.ok) {
        setRating(newRating); // Update the current rating
        if (onRatingChange) onRatingChange(newRating); // Notify parent component
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to submit rating.");
      }
    } catch (err) {
      console.error("Error submitting rating:", err);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Display the current rating */}
      <h3 className="text-lg font-bold text-white mb-4">
        {rating ? `Your Rating: ${rating}` : "Rate this Content"}
      </h3>
      <div className="flex items-center justify-center space-x-2">
        {/* Render rating buttons */}
        {[...Array(10)].map((_, index) => {
          const value = index + 1;
          return (
            <button
              key={value}
              onClick={() => handleRatingClick(value)}
              onMouseEnter={() => setHoverRating(value)}
              onMouseLeave={() => setHoverRating(null)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                value === rating
                  ? "bg-yellow-500 text-white border-yellow-600" // Highlight selected rating
                  : hoverRating && value <= hoverRating
                    ? "bg-yellow-400 text-white" // Highlight hover state
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600" // Default style
              }`}
            >
              {value}
            </button>
          );
        })}
      </div>
      {/* Display errors if any */}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default Rating;
