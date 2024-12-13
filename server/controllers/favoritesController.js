/**
 * Favorites Controller
 *
 * This module manages user favorites, enabling Create, Read, Update, and Delete (CRUD) operations
 * for movies and TV shows. It integrates seamlessly with The Movie Database (TMDb) API to enrich
 * favorites with detailed metadata and genre information, providing a dynamic and interactive user experience.
 *
 * ========================
 * **Core Functionalities**
 * ========================
 * 1. **Retrieve Favorites**:
 *    - Fetches all favorites for the authenticated user from the database.
 *    - Enriches each favorite with metadata (title, genres, poster) fetched from the TMDb API.
 *    - Implements an in-memory cache to reduce redundant API calls for metadata.
 *
 * 2. **Add Favorites**:
 *    - Allows authenticated users to add a new favorite (movie or TV show) to their collection.
 *    - Enriches the favorite with metadata from the TMDb API upon creation.
 *    - Ensures duplicate favorites cannot be added by the same user.
 *
 * 3. **Update Favorites**:
 *    - Enables updates to existing favorites by their database ID.
 *    - Supports partial updates (e.g., modifying user notes or custom fields).
 *    - Validates ownership to ensure only the user who owns the favorite can modify it.
 *
 * 4. **Delete Favorites**:
 *    - Removes a favorite from the database by its ID.
 *    - Validates ownership to ensure only the authenticated user can delete their own favorites.
 *
 * ==========================
 * **TMDb API Integration**
 * ==========================
 * - **Metadata Enrichment**:
 *   - Fetches detailed metadata for movies and TV shows (title, genres, poster, etc.).
 *   - Uses in-memory caching (`metadataCache`) to minimize redundant API calls and improve performance.
 * - **Genre Management**:
 *   - Fetches and caches movie and TV genres on server startup (`genreCache`).
 *   - Maps genre IDs to human-readable names for better user understanding.
 *
 * =====================
 * **Key Dependencies**
 * =====================
 * - **`Favorite` Mongoose Model**:
 *   - Stores user favorites in the database with fields like `userId`, `tmdbId`, and `mediaType`.
 *   - Ensures secure operations with validation and schema constraints.
 * - **`axios`**:
 *   - Makes HTTP requests to the TMDb API for metadata and genre information.
 * - **TMDb API**:
 *   - Provides metadata and genre details for movies and TV shows.
 * - **Environment Variables**:
 *   - `TMDB_ACCESS_TOKEN`: Secures API requests to the TMDb platform.
 *
 * =====================
 * **Route Endpoints**
 * =====================
 * 1. **`GET /api/favorites`**:
 *    - Retrieves all favorites for the authenticated user.
 *    - Enriches each favorite with metadata (title, genres, poster) from the TMDb API.
 * 2. **`POST /api/favorites`**:
 *    - Adds a new favorite to the database.
 *    - Validates input (`tmdbId`, `mediaType`) and checks for duplicates.
 *    - Enriches the favorite with metadata from the TMDb API.
 * 3. **`PUT /api/favorites/:id`**:
 *    - Updates an existing favorite by its ID.
 *    - Supports partial updates and validates user ownership.
 * 4. **`DELETE /api/favorites/:id`**:
 *    - Deletes a favorite by its ID.
 *    - Ensures only the owner can delete their favorites.
 *
 * ========================
 * **Error Handling**
 * ========================
 * - **Database Errors**:
 *   - Handles errors during database operations, such as missing or invalid IDs.
 *   - Returns appropriate HTTP status codes (e.g., `404` for not found, `500` for server errors).
 * - **TMDb API Errors**:
 *   - Logs errors when fetching metadata or genres fails.
 *   - Provides fallback data (e.g., "Unknown" title or empty genre list) to ensure resilience.
 * - **Validation Errors**:
 *   - Validates required fields (`tmdbId`, `mediaType`) for adding favorites.
 *   - Ensures user ownership before allowing updates or deletions.
 *
 * =========================
 * **Caching Mechanisms**
 * =========================
 * - **Metadata Cache**:
 *   - Reduces redundant TMDb API calls by caching metadata for movies and TV shows.
 *   - Keyed by `mediaType-tmdbId` (e.g., `movie-12345`, `tv-67890`).
 * - **Genre Cache**:
 *   - Stores movie and TV genre mappings fetched from TMDb on server startup.
 *   - Reduces API dependency for frequent genre lookups.
 *
 * ========================
 * **Future Enhancements**
 * ========================
 * 1. Add pagination to the `GET /api/favorites` endpoint for better performance with large datasets.
 * 2. Support bulk operations for adding or removing multiple favorites simultaneously.
 * 3. Implement user-specific metadata (e.g., custom tags, notes) for enhanced personalization.
 * 4. Introduce real-time updates with WebSockets or server-sent events for dynamic favorite lists.
 */

import Favorite from "../models/Favorite.js";
import axios from "axios";

const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;

// Cache to store genre mappings and metadata
let genreCache = {};
const metadataCache = {}; // In-memory cache for movie/TV metadata

// Function to fetch genres and store them in the cache
const fetchGenres = async () => {
  try {
    const [movieGenresResponse, tvGenresResponse] = await Promise.all([
      axios.get("https://api.themoviedb.org/3/genre/movie/list", {
        headers: { Authorization: `Bearer ${TMDB_ACCESS_TOKEN}` },
      }),
      axios.get("https://api.themoviedb.org/3/genre/tv/list", {
        headers: { Authorization: `Bearer ${TMDB_ACCESS_TOKEN}` },
      }),
    ]);

    genreCache.movie = movieGenresResponse.data.genres.reduce((acc, genre) => {
      acc[genre.id] = genre.name;
      return acc;
    }, {});

    genreCache.tv = tvGenresResponse.data.genres.reduce((acc, genre) => {
      acc[genre.id] = genre.name;
      return acc;
    }, {});
  } catch (error) {
    console.error("Error fetching genres:", error.message);
    genreCache = { movie: {}, tv: {} }; // Fallback to empty mappings
  }
};

// Fetch genres on server startup
fetchGenres();

// Helper function to get metadata from cache or TMDB API
const getMetadataFromCacheOrAPI = async (tmdbId, mediaType) => {
  const cacheKey = `${mediaType}-${tmdbId}`;

  // Return cached metadata if it exists
  if (metadataCache[cacheKey]) {
    return metadataCache[cacheKey];
  }

  // Construct TMDB API URL
  const tmdbUrl =
    mediaType === "movie"
      ? `https://api.themoviedb.org/3/movie/${tmdbId}`
      : `https://api.themoviedb.org/3/tv/${tmdbId}`;

  // Fetch metadata from TMDB API
  try {
    const response = await axios.get(tmdbUrl, {
      headers: { Authorization: `Bearer ${TMDB_ACCESS_TOKEN}` },
    });

    const data = response.data;

    // Cache the metadata
    metadataCache[cacheKey] = data;
    return data;
  } catch (error) {
    console.error(`Error fetching metadata for ${tmdbId}:`, error.message);
    return null;
  }
};

/**
 * Get all favorites for the authenticated user.
 */
export const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user.id });

    const enrichedFavorites = await Promise.all(
      favorites.map(async (favorite) => {
        const metadata = await getMetadataFromCacheOrAPI(
          favorite.tmdbId,
          favorite.mediaType,
        );

        if (!metadata) {
          return {
            id: favorite._id,
            tmdbId: favorite.tmdbId,
            mediaType: favorite.mediaType,
            title: "Unknown",
            poster_path: null,
            genres: [],
          };
        }

        const genreNames = metadata.genres
          ? metadata.genres.map((genre) => genre.name)
          : [];

        return {
          id: favorite._id,
          tmdbId: favorite.tmdbId,
          mediaType: favorite.mediaType,
          title: metadata.title || metadata.name || "Unknown",
          poster_path: metadata.poster_path,
          genres: genreNames,
        };
      }),
    );

    res.json(enrichedFavorites);
  } catch (error) {
    console.error("Error fetching favorites:", error.message);
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
};

/**
 * Add a new favorite for the authenticated user.
 */
export const addFavorite = async (req, res) => {
  const { tmdbId, mediaType } = req.body;

  if (!tmdbId || !mediaType) {
    return res.status(400).json({ error: "tmdbId and mediaType are required" });
  }

  try {
    // Check if the favorite already exists for this user
    const existingFavorite = await Favorite.findOne({
      userId: req.user.id,
      tmdbId,
    });

    if (existingFavorite) {
      return res.status(400).json({ error: "Favorite already exists" });
    }

    // Add new favorite
    const favorite = await Favorite.create({
      userId: req.user.id,
      tmdbId,
      mediaType,
    });

    // Fetch metadata for the added favorite
    const tmdbUrl =
      mediaType === "movie"
        ? `https://api.themoviedb.org/3/movie/${tmdbId}`
        : `https://api.themoviedb.org/3/tv/${tmdbId}`;

    const response = await axios.get(tmdbUrl, {
      headers: {
        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
      },
    });

    const data = response.data;
    const genreNames = data.genres
      ? data.genres.map((genre) => genre.name)
      : [];

    // Respond with enriched favorite data
    res.status(201).json({
      id: favorite._id, // Return `_id` as `id` for frontend compatibility
      tmdbId: favorite.tmdbId,
      mediaType: favorite.mediaType,
      title: data.title || data.name || "Unknown",
      poster_path: data.poster_path,
      genres: genreNames,
    });
  } catch (error) {
    console.error("Error adding favorite:", error.message);
    res.status(500).json({ error: "Failed to add favorite" });
  }
};

/**
 * Remove a favorite by ID for the authenticated user.
 */
export const removeFavorite = async (req, res) => {
  const { id } = req.params;

  try {
    // Remove favorite by database `_id` and `userId` to ensure ownership
    const deletedFavorite = await Favorite.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    if (!deletedFavorite) {
      return res.status(404).json({ error: "Favorite not found" });
    }

    res.json({ message: "Favorite removed" });
  } catch (error) {
    console.error("Error removing favorite:", error.message);
    res.status(500).json({ error: "Failed to remove favorite" });
  }
};

/**
 * Update a favorite item for the authenticated user.
 */
export const updateFavorite = async (req, res) => {
  const { id } = req.params; // Favorite's database ID
  const updates = req.body; // Fields to update

  try {
    const favorite = await Favorite.findOneAndUpdate(
      { _id: id, userId: req.user.id }, // Match by ID and ensure ownership
      updates, // Apply updates
      { new: true }, // Return the updated document
    );

    if (!favorite) {
      return res.status(404).json({ error: "Favorite not found" });
    }

    res.json(favorite); // Respond with the updated favorite
  } catch (error) {
    console.error("Error updating favorite:", error.message);
    res.status(500).json({ error: "Failed to update favorite" });
  }
};
