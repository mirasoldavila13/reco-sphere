/**
 * Type Definitions for Media Data Handling
 *
 * This file contains TypeScript interfaces and types used across the application to define
 * and enforce the structure of data related to media items, genres, and API responses.
 *
 * Purpose:
 * - Establish a clear contract for handling data related to movies, TV shows, and persons.
 * - Provide reusable and extensible type definitions to improve type safety and maintainability.
 * - Define the expected shapes of responses from external APIs and internal data transformations.
 *
 * Key Features:
 * - **Genre Handling**:
 *   - `Genre`: Represents a single genre with an ID and name.
 *   - `GenreMap`: A utility interface for mapping genre IDs to their respective names.
 * - **Media Item Abstraction**:
 *   - `BaseMediaItem`: A base interface containing common properties for all media items.
 *   - `TrendingItem`: Extends `BaseMediaItem` with a required `media_type` field for trending content.
 *   - `PopularItem`: Extends `BaseMediaItem` with additional properties for popular content.
 *   - `FavoriteItem`: Combines `BaseMediaItem` with enriched metadata for user favorites.
 * - **API Response Shapes**:
 *   - `TrendingResponse` and `PopularResponse`: Define the structure of paginated API responses for trending and popular content.
 *   - `GenreResponse`: Represents the response format for fetching genres (movies and TV shows).
 *
 * Design Considerations:
 * - **Reusability**: Base interfaces like `BaseMediaItem` provide a foundation for creating more specific types.
 * - **Extensibility**: Allows for future additions, such as new media types or additional properties, without breaking existing code.
 * - **Type Safety**: Enforces correct usage of media data, reducing runtime errors.
 * - **API Integration**: Ensures consistency between the application's data structures and external API responses.
 *
 * Usage:
 * - Import specific interfaces to type-check functions, components, or services dealing with media data.
 * - Use response interfaces to handle and validate API responses before consuming them.
 *
 * Example:
 * ```ts
 * import { TrendingItem, GenreMap } from "./types";
 *
 * const trendingItem: TrendingItem = {
 *   id: 1,
 *   title: "Example Movie",
 *   media_type: "movie",
 *   genre_ids: [28, 12],
 *   poster_path: "/example.jpg",
 *   overview: "An example overview.",
 *   rating: 8.5,
 * };
 *
 * const genreMap: GenreMap = {
 *   28: "Action",
 *   12: "Adventure",
 * };
 * ```
 *
 * Dependencies:
 * - No external dependencies; designed to work seamlessly within the application.
 */

export interface Genre {
  id: number;
  name: string;
}

// Define a map for genres
export interface GenreMap {
  [key: number]: string;
}
// Define a base interface for common media item properties
export interface BaseMediaItem {
  id: number;
  title?: string; // Movies
  name?: string; // TV shows and persons
  genre_ids?: number[];
  poster_path?: string;
  overview?: string; // Description of the media
  rating?: number; // User rating  - shared across all media types
}

// TrendingItem extends BaseMediaItem with a required media_type
export interface TrendingItem extends BaseMediaItem {
  tmdbId?: number;
  media_type: "movie" | "tv" | "person"; // Explicit for TrendingItem
}

// PopularItem extends BaseMediaItem with additional optional properties
export interface PopularItem extends BaseMediaItem {
  media_type?: "movie" | "tv" | string; // Optional for PopularItem
  poster_path?: string;
  backdrop_path?: string; // Optional backdrop image path
  release_date?: string; // Optional release date
  vote_average?: number; // Optional average rating
  vote_count?: number; // Optional total votes
  popularity?: number; // Optional popularity metric
}

// Define FavoriteItem as a union of TrendingItem and PopularItem, with enrichment
export interface FavoriteItem extends BaseMediaItem {
  tmdbId: number; // TMDb ID for reverse lookup
  mediaType: "movie" | "tv"; // Type of media
  genres?: string[]; // Enriched genre names (optional)
}

// Responses for Trending and Popular sections
export interface TrendingResponse {
  page: number;
  results: TrendingItem[];
  total_pages: number;
  total_results: number;
}

export interface PopularResponse {
  page: number;
  results: PopularItem[];
  total_pages: number;
  total_results: number;
}

// Genre response format
export interface GenreResponse {
  movieGenres: Genre[];
  tvGenres: Genre[];
}
