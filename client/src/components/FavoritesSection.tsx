/**
 * FavoritesSection Component
 *
 * This component is a reusable section designed to display a horizontal list of favorite items
 * (movies or TV shows). It supports scrollable navigation, dynamic genre mapping, and the ability
 * to remove items from the favorites list.
 *
 * Features:
 * - **Dynamic Favorites List**:
 *   - Accepts a list of favorite items and renders them with relevant metadata such as title,
 *     genres, and media type (movie/TV show).
 *   - Integrates a fallback image for items without a poster.
 * - **Genre Mapping**:
 *   - Dynamically maps genre IDs from `movieGenres` and `tvGenres` props to genre names.
 *   - Ensures genre data is displayed even when only genre IDs are available.
 * - **Scroll Navigation**:
 *   - Provides smooth horizontal scrolling with left/right arrow buttons.
 * - **Remove Favorite**:
 *   - Allows users to remove an item from the favorites list via a `handleRemoveFavorite` action.
 *   - Updates the UI dynamically by leveraging the parent state (`setFavorites`) and backend
 *     mutation logic in `favoritesHandler`.
 * - **Hover Effects**:
 *   - Includes hover-based scaling and shadow transitions for enhanced interactivity.
 *
 * Design Considerations:
 * - Responsive Layout:
 *   - Implements horizontal scrolling to accommodate varying screen sizes and long lists.
 *   - Hides scrollbars for a cleaner UI while ensuring usability.
 * - Modular Functionality:
 *   - Delegates the removal logic to a shared utility function (`handleFavorites`).
 * - Accessibility:
 *   - Provides clear visual indicators for scrollable sections and actionable buttons.
 *
 * Dependencies:
 * - `favoritesHandler`: Utility for performing CRUD operations with the backend.
 * - `movieGenres` and `tvGenres`: Maps for converting genre IDs to human-readable names.
 * - `fallbackImage`: A placeholder image for items missing a valid `poster_path`.
 *
 * Props:
 * - `favorites`: An array of favorite items (movies or TV shows).
 * - `setFavorites`: A state updater function for managing the favorites list in the parent component.
 * - `title`: The section title, e.g., "Favorite Movies" or "Favorite TV Shows".
 * - `movieGenres` and `tvGenres`: Objects mapping genre IDs to genre names.
 */

import React, { useRef } from "react";
import { FavoriteItem, GenreMap } from "../types";
import fallbackImage from "../assets/images/fallback-image.jpg";
import { handleFavorites } from "../utils/favoritesHandler";

interface FavoritesSectionProps {
  favorites: FavoriteItem[];
  setFavorites: React.Dispatch<React.SetStateAction<FavoriteItem[]>>;
  title: string;
  movieGenres: GenreMap;
  tvGenres: GenreMap;
}

const FavoritesSection: React.FC<FavoritesSectionProps> = ({
  favorites,
  setFavorites,
  title,
  movieGenres,
  tvGenres,
}) => {
  const favoritesRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (favoritesRef.current) {
      favoritesRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  const handleRemoveFavorite = async (favorite: FavoriteItem) => {
    await handleFavorites(
      "remove",
      favorite,
      setFavorites,
      (message) => {
        console.log(message); // Debugging feedback message
      },
      {}, // additionalData
      { movieGenres, tvGenres },
    );
  };

  // Return nothing if there are no favorites
  if (!favorites || favorites.length === 0) {
    return null;
  }

  return (
    <section className="py-6">
      <h3 className="text-2xl font-bold text-center mb-4 text-white">
        {title}
      </h3>
      <div className="relative">
        {/* Left Arrow Button */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 bg-opacity-50 text-white rounded-full p-3 shadow-lg hover:bg-opacity-80 transition duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Favorites List */}
        <div
          ref={favoritesRef}
          className="flex overflow-x-scroll scrollbar-hide space-x-4"
        >
          {favorites.map((item) => (
            <div
              key={item.id}
              className="relative flex-shrink-0 w-60 bg-base-100 shadow-lg rounded-lg transition-transform transform hover:scale-105 hover:shadow-2xl hover:border-primary border-transparent border-2"
            >
              <figure>
                <img
                  src={
                    item.poster_path
                      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                      : fallbackImage
                  }
                  alt={item.title || item.name || "Unknown"}
                  className="rounded-t-lg w-full h-72 object-cover"
                />
              </figure>
              <div className="p-4">
                <h3 className="text-lg font-bold text-white">
                  {item.title || item.name || "Unknown"}
                </h3>
                <p className="text-gray-400 text-sm">
                  {item.genres?.length
                    ? `Genre: ${item.genres.join(", ")}`
                    : item.genre_ids
                        ?.map(
                          (id) => movieGenres[id] || tvGenres[id] || "Unknown",
                        )
                        .join(", ") || "Genre: N/A"}
                </p>

                <p className="text-gray-500 text-sm">
                  {item.mediaType === "movie" ? "Movie" : "TV Show"}
                </p>
              </div>
              <button
                onClick={() => handleRemoveFavorite(item)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-700 transition-all"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 bg-opacity-50 text-white rounded-full p-3 shadow-lg hover:bg-opacity-80 transition duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default FavoritesSection;
