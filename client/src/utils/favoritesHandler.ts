/**
 * FavoritesHandler Utility
 *
 * This module provides a centralized handler for managing user favorites, including adding,
 * removing, updating, and enriching favorite items with metadata. It integrates seamlessly
 * with the GraphQL API and the backend REST endpoints to perform CRUD operations on user favorites.
 *
 * Key Features:
 * - **Authentication Checks**: Ensures actions are performed only by authenticated users.
 * - **CRUD Operations**:
 *   - `add`: Adds a new item to the user's favorites.
 *   - `remove`: Removes an existing item from the user's favorites.
 *   - `update`: Updates additional data for a favorite item, such as genres or ratings.
 * - **Dynamic Metadata Enrichment**:
 *   - Fetches additional metadata for favorite items from external APIs (e.g., TMDB) when required.
 *   - Enriches items with human-readable genres using provided `GenreMap` objects.
 * - **State Synchronization**:
 *   - Fetches the updated favorites list from the backend after every action to ensure consistency.
 *   - Updates the React state for favorites using a provided state setter.
 * - **Error Handling**:
 *   - Displays detailed error messages for API or validation failures using a `modalMessageSetter`.
 *
 * Schema Integration:
 * The `Favorite` schema is defined as part of the GraphQL schema and Mongoose model.
 * Here's how deletion is supported:
 *
 * GraphQL Mutation for Deleting Favorites:
 * ```graphql
 * mutation RemoveFavorite($id: ID!) {
 *   removeFavorite(id: $id)
 * }
 * ```
 *
 * Resolver Implementation for Deletion:
 * ```ts
 * removeFavorite: authenticate(async (_, { id }, context) => {
 *   try {
 *     const favorite = await Favorite.findOneAndDelete({ _id: id, userId: context.user.id });
 *     if (!favorite) {
 *       throw new ApolloError("Favorite not found.", "NOT_FOUND");
 *     }
 *     return true;
 *   } catch (error) {
 *     console.error("Error removing favorite:", error.message);
 *     throw new ApolloError("Failed to remove favorite.", "INTERNAL_SERVER_ERROR");
 *   }
 * });
 * ```
 *
 * REST API Endpoint for Deleting Favorites:
 * ```ts
 * app.delete("/api/favorites/:id", protectRoute, async (req, res) => {
 *   try {
 *     const favorite = await Favorite.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
 *     if (!favorite) {
 *       return res.status(404).json({ error: "Favorite not found." });
 *     }
 *     res.json({ message: "Favorite removed successfully!" });
 *   } catch (error) {
 *     console.error("Error deleting favorite:", error.message);
 *     res.status(500).json({ error: "Internal server error." });
 *   }
 * });
 * ```
 *
 * MongoDB Schema for Favorites:
 * ```ts
 * const favoriteSchema = new mongoose.Schema(
 *   {
 *     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
 *     tmdbId: { type: String, required: true },
 *     mediaType: { type: String, enum: ["movie", "tv"], required: true },
 *     addedAt: { type: Date, default: Date.now },
 *   },
 *   { timestamps: true }
 * );
 *
 * const Favorite = mongoose.model("Favorite", favoriteSchema);
 * ```
 *
 * Integration with Application:
 * - Works in conjunction with the `FavoriteSection` and `FavoritesPage` components.
 * - Utilizes the `authService` module for token management and user authentication.
 * - Leverages REST endpoints and GraphQL queries/mutations for dynamic data handling.
 *
 * Example Usage:
 * ```ts
 * import { handleFavorites } from "../utils/favoriteshandler";
 *
 * const removeFavorite = async (item) => {
 *   await handleFavorites(
 *     "remove",
 *     item,
 *     setFavorites,
 *     setModalMessage
 *   );
 * };
 * ```
 *
 * Design Considerations:
 * - **Extensibility**:
 *   - Easily extendable to support additional actions like bulk operations or complex metadata enrichment.
 * - **Scalability**:
 *   - Designed to handle dynamic changes and integrate with evolving GraphQL or REST APIs.
 * - **Robustness**:
 *   - Gracefully handles errors and invalid states, ensuring seamless user experience.
 *
 * Notes:
 * - Relies on a valid JWT token for authentication and authorization.
 * - Requires backend support for REST or GraphQL endpoints used in API calls.
 */

import authService from "../services/authService";
import { FavoriteItem, GenreMap } from "../types";

export const handleFavorites = async (
  action: "add" | "remove" | "edit" | "update",
  item: FavoriteItem | null,
  setFavorites: React.Dispatch<React.SetStateAction<FavoriteItem[]>>,
  modalMessageSetter: (message: string) => void,
  additionalData?: Partial<FavoriteItem>,
  genreMaps?: { movieGenres: GenreMap; tvGenres: GenreMap }, // Optional genres for enrichment
) => {
  if (!authService.isAuthenticated()) {
    modalMessageSetter("You need to log in to perform this action!");
    return;
  }

  const token = authService.getAuthToken();
  if (!token) {
    modalMessageSetter("Invalid session. Please log in again.");
    return;
  }

  try {
    let response;

    switch (action) {
      case "add": {
        if (!item) throw new Error("Item is missing for adding to favorites.");

        const payload = {
          tmdbId: item.id.toString(), // Ensure ID is a string
          mediaType: item.mediaType,
        };

        // Send the request to the backend
        response = await fetch("/api/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to add favorite.");
        }

        const newFavorite = await response.json();

        // Dynamically fetch metadata if genreMaps are provided
        const enrichedFavorite: FavoriteItem = {
          ...newFavorite,
          genres: genreMaps
            ? newFavorite.genre_ids?.map(
                (id: number) =>
                  genreMaps.movieGenres[id] ||
                  genreMaps.tvGenres[id] ||
                  "Unknown",
              )
            : [],
        };

        // Dynamically fetch metadata if the backend doesn't return full details
        if (!enrichedFavorite.title && enrichedFavorite.tmdbId) {
          const metadataResponse = await fetch(
            `https://api.themoviedb.org/3/${enrichedFavorite.mediaType}/${enrichedFavorite.tmdbId}`,
            {
              headers: {
                Authorization: `Bearer YOUR_TMDB_ACCESS_TOKEN`,
              },
            },
          );

          if (metadataResponse.ok) {
            const metadata = await metadataResponse.json();
            enrichedFavorite.title =
              metadata.title || metadata.name || "Unknown";
            enrichedFavorite.genres = metadata.genres?.map(
              (genre: { id: number; name: string }) => genre.name,
            );
            enrichedFavorite.poster_path = metadata.poster_path;
            enrichedFavorite.overview = metadata.overview;
          }
        }

        // Fetch the updated favorites list from the backend to synchronize state
        const updatedFavorites = await fetch("/api/favorites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((res) => res.json());

        // Update the favorites state with the fetched list
        setFavorites(updatedFavorites);

        // Show a success message
        modalMessageSetter("Successfully added to favorites!");
        break;
      }

      case "remove": {
        if (!item)
          throw new Error("Item is missing for removing from favorites.");

        const idToRemove = item.id.toString(); // Convert to string

        response = await fetch(`/api/favorites/${idToRemove}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to remove favorite.");
        }

        // Fetch the updated favorites list from the backend to synchronize state
        const updatedFavorites = await fetch("/api/favorites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((res) => res.json());

        // Update the favorites state with the fetched list
        setFavorites(updatedFavorites);

        modalMessageSetter("Successfully removed from favorites!");
        break;
      }

      case "update": {
        if (!item) throw new Error("Item is missing for updating favorites.");

        const idToUpdate = item.id.toString(); // Convert to string
        const payload = {
          ...(additionalData || {}),
        };

        response = await fetch(`/api/favorites/${idToUpdate}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update favorite.");
        }

        const updatedFavorite = await response.json();

        const enrichedFavorite: FavoriteItem = {
          ...updatedFavorite,
          genres: genreMaps
            ? updatedFavorite.genre_ids?.map(
                (id: number) =>
                  genreMaps.movieGenres[id] ||
                  genreMaps.tvGenres[id] ||
                  "Unknown",
              )
            : [],
        };

        setFavorites((prevFavorites) =>
          prevFavorites.map((favorite) =>
            favorite.id.toString() === idToUpdate ? enrichedFavorite : favorite,
          ),
        );
        modalMessageSetter("Successfully updated favorite!");
        break;
      }

      default:
        throw new Error("Invalid action.");
    }
  } catch (error) {
    console.error("Error handling favorite action:", error);
    modalMessageSetter((error as Error).message || "An error occurred.");
  }
};
