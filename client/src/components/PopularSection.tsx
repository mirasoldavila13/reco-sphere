/**
 * PopularSection Component
 *
 * This component is responsible for displaying two sections of trending content:
 * popular movies and popular TV shows. It interacts with backend APIs to fetch
 * the necessary data, integrates genre metadata for better user understanding,
 * and allows authenticated users to perform CRUD operations on their favorites.
 *
 * =======================
 * **Core Functionalities**
 * =======================
 * 1. **Dynamic Content Display**:
 *    - Fetches popular movies and TV shows via backend API endpoints.
 *    - Enriches content with human-readable genres using metadata.
 *    - Displays content in horizontally scrollable carousels.
 *
 * 2. **User Interactivity**:
 *    - Provides actions for users to:
 *      - Add/remove items from their favorites.
 *      - View details for movies and TV shows in a modal.
 *      - Rate content using a rating modal.
 *
 * 3. **Loading and Error States**:
 *    - Implements a `loading` state to display a spinner or loading message
 *      while fetching data from the backend.
 *    - Implements an `error` state to handle and display error messages if
 *      fetching data fails due to authentication issues or API errors.
 *
 * 4. **Backend Integration**:
 *    - Communicates with `/api/popular/movies`, `/api/popular/tv`, and `/api/genres`.
 *    - Uses authenticated API calls for secure interactions.
 *    - Caches genres locally for performance optimization.
 *
 * 5. **State Management**:
 *    - Handles the following states:
 *      - Content data (`popularMovies`, `popularTVShows`).
 *      - Genre metadata (`movieGenres`, `tvGenres`).
 *      - User favorites (`favorites`).
 *      - Modals for detailed view and rating.
 *      - `loading` and `error` statuses to manage asynchronous operations.
 *
 * 6. **Responsive Design**:
 *    - Fully responsive UI for carousels and modals.
 *    - Utilizes horizontal scrolling and adaptive layouts.
 *
 * =====================
 * **State Management**
 * =====================
 * - **`popularMovies` & `popularTVShows`**:
 *   Stores the lists of trending movies and TV shows, enriched with genre metadata.
 *
 * - **`movieGenres` & `tvGenres`**:
 *   Maps genre IDs to human-readable names using a locally cached dictionary.
 *
 * - **`favorites`**:
 *   Tracks the user's favorites and synchronizes with the backend for consistent state.
 *
 * - **`loading`**:
 *   Indicates whether the component is actively fetching data from the backend.
 *   - Displays a "Loading" message or spinner when `true`.
 *   - Prevents rendering of content until data is fully fetched.
 *
 * - **`error`**:
 *   Stores error messages from failed API calls.
 *   - Displays error messages to the user when fetching data fails.
 *   - Prevents rendering of content if an error is present.
 *
 * - **`detailsModalItem` & `ratingItem`**:
 *   Manages the currently selected content for detailed view and rating modals.
 *
 * ========================
 * **Key Functions & Logic**
 * ========================
 * 1. **`fetchData`**:
 *    - Fetches movies, TV shows, and genres in parallel.
 *    - Ensures user authentication before proceeding with requests.
 *    - Manages `loading` and `error` states during the fetch process.
 *    - Clears the `loading` state upon successful completion or sets `error`
 *      if fetching fails.
 *
 * 2. **`fetchPopularMovies` & `fetchPopularTVShows`**:
 *    - Communicates with the respective API endpoints to fetch popular items.
 *    - Augments the data with a `media_type` field for better contextual understanding.
 *
 * 3. **`fetchGenres`**:
 *    - Fetches genre metadata and stores it in a locally cached map.
 *    - Optimizes the component's performance by reducing repetitive API calls.
 *
 * 4. **`handleFavoriteAction`**:
 *    - Delegates the logic for adding/removing content to/from favorites.
 *    - Utilizes `handleFavorites` from `favoritesHandler.ts` for backend interaction.
 *    - Displays success or error messages via modals.
 *
 * 5. **`renderCard`**:
 *    - Dynamically renders each movie/TV show card.
 *    - Includes contextual actions like add/remove favorites, view details, and rate content.
 *
 * ========================
 * **Backend Integration**
 * ========================
 * 1. **API Endpoints**:
 *    - `/api/popular/movies`: Fetches trending movies.
 *    - `/api/popular/tv`: Fetches trending TV shows.
 *    - `/api/genres`: Provides a mapping of genre IDs to names.
 *
 * 2. **Authentication**:
 *    - Ensures all interactions with the backend are authenticated using JWT tokens.
 *    - Restricts actions like adding/removing favorites to logged-in users.
 *
 * 3. **Genre Enrichment**:
 *    - Maps genre IDs to names for better user understanding.
 *    - Handles cases where genres are missing or invalid.
 *
 * ======================
 * **Component Structure**
 * ======================
 * - **Horizontal Carousels**:
 *   - Displays popular movies and TV shows in separate carousels.
 *   - Includes scroll buttons for easy navigation.
 *
 * - **Modals**:
 *   - Details Modal: Provides an in-depth view of the selected content.
 *   - Rating Modal: Allows users to rate a movie or TV show.
 *
 * - **Loading and Error States**:
 *   - Displays a loading spinner or message when data is being fetched.
 *   - Shows error messages if API calls fail due to authentication or server issues.
 *
 * ===========================
 * **Error Handling**
 * ===========================
 * - **Authentication**:
 *   - Displays an error message if the user is not authenticated.
 *   - Prevents further actions until the user logs in.
 *
 * - **API Errors**:
 *   - Handles failures in fetching content or genres gracefully.
 *   - Provides fallback UI and error notifications to the user.
 *
 * ========================
 * **Key External Modules**
 * ========================
 * - **`axios`**: For making API calls to the backend.
 * - **`authService`**: Manages authentication logic and token retrieval.
 * - **`favoritesHandler.ts`**: Handles add/remove/update operations for favorites.
 *
 * ===========================
 * **Example Integration**
 * ===========================
 * ```
 * import PopularSection from "./PopularSection";
 *
 * const App = () => {
 *   const [favorites, setFavorites] = useState([]);
 *
 *   return (
 *     <div>
 *       <PopularSection favorites={favorites} setFavorites={setFavorites} />
 *     </div>
 *   );
 * };
 *
 * export default App;
 * ```
 */

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { PopularItem, FavoriteItem, GenreResponse } from "../types";
import fallbackImage from "../assets/images/fallback-image.jpg";
import authService from "../services/authService";
import { handleFavorites } from "../utils/favoritesHandler";
import Rating from "../components/Rating";

interface GenreMap {
  [key: number]: string;
}

interface PopularSectionProps {
  favorites: FavoriteItem[];
  setFavorites: React.Dispatch<React.SetStateAction<FavoriteItem[]>>;
}

const PopularSection: React.FC<PopularSectionProps> = ({
  favorites,
  setFavorites,
}) => {
  const [popularMovies, setPopularMovies] = useState<PopularItem[]>([]);
  const [popularTVShows, setPopularTVShows] = useState<PopularItem[]>([]);
  const [movieGenres, setMovieGenres] = useState<GenreMap>({});
  const [tvGenres, setTVGenres] = useState<GenreMap>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [modalType, setModalType] = useState<"success" | "error" | null>(null);
  const [detailsModalItem, setDetailsModalItem] = useState<PopularItem | null>(
    null,
  );
  const [ratingItem, setRatingItem] = useState<PopularItem | null>(null); // State for managing Rating modal

  const moviesRef = useRef<HTMLDivElement>(null);
  const tvShowsRef = useRef<HTMLDivElement>(null);

  const scroll = (
    ref: React.RefObject<HTMLDivElement>,
    direction: "left" | "right",
  ) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!authService.isAuthenticated()) {
          setError("You must be logged in to view this content.");
          return;
        }

        const authToken = authService.getAuthToken();
        const headers: Record<string, string> = authToken
          ? { Authorization: `Bearer ${authToken}` }
          : {};

        await Promise.all([
          fetchPopularMovies(headers),
          fetchPopularTVShows(headers),
          fetchGenres(headers),
        ]);

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch popular items.");
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const fetchPopularMovies = async (headers: Record<string, string>) => {
    try {
      const response = await axios.get("/api/popular/movies", { headers });
      const movies = response.data.results.map((movie: PopularItem) => ({
        ...movie,
        media_type: "movie",
      }));
      setPopularMovies(movies);
    } catch (err) {
      console.error("Error fetching popular movies:", err);
    }
  };

  const fetchPopularTVShows = async (headers: Record<string, string>) => {
    try {
      const response = await axios.get("/api/popular/tv", { headers });
      const tvShows = response.data.results.map((tvShow: PopularItem) => ({
        ...tvShow,
        media_type: "tv",
      }));
      setPopularTVShows(tvShows);
    } catch (err) {
      console.error("Error fetching popular TV shows:", err);
    }
  };

  const fetchGenres = async (headers: Record<string, string>) => {
    try {
      const response = await axios.get<GenreResponse>("/api/genres", {
        headers,
      });
      const { movieGenres, tvGenres } = response.data;

      setMovieGenres(
        movieGenres.reduce((map, genre) => {
          map[genre.id] = genre.name;
          return map;
        }, {} as GenreMap),
      );

      setTVGenres(
        tvGenres.reduce((map, genre) => {
          map[genre.id] = genre.name;
          return map;
        }, {} as GenreMap),
      );
    } catch (err) {
      console.error("Error fetching genres:", err);
    }
  };

  const handleFavoriteAction = (
    action: "add" | "remove",
    item: PopularItem,
  ) => {
    if (
      !item.media_type ||
      (item.media_type !== "movie" && item.media_type !== "tv")
    ) {
      setModalMessage("Only movies and TV shows can be added to favorites.");
      setModalType("error");
      return;
    }

    const favoriteItem: FavoriteItem = {
      id: item.id,
      tmdbId: item.id,
      mediaType: item.media_type,
      title: item.title,
      name: item.name,
      genre_ids: item.genre_ids,
      poster_path: item.poster_path,
      overview: item.overview,
    };

    handleFavorites(
      action,
      favoriteItem,
      setFavorites,
      (message) => {
        setModalMessage(message);
        setModalType(action === "add" ? "success" : "error");
      },
      {},
      { movieGenres, tvGenres },
    );
  };

  const renderCard = (item: PopularItem, genres: GenreMap) => {
    const isFavorite = favorites.some((fav) => fav.tmdbId === item.id);

    return (
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
            alt={item.title || item.name}
            className="rounded-t-lg w-full h-72 object-cover"
          />
        </figure>
        <div className="p-4">
          <h3 className="text-lg font-bold text-white truncate">
            {item.title || item.name}
          </h3>
          <p className="text-gray-400 text-sm">
            {item.genre_ids?.map((id) => genres[id] || "Unknown").join(", ") ||
              "Genre: N/A"}
          </p>
        </div>

        <div className="absolute top-2 right-2">
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="btn btn-sm btn-circle bg-primary text-white shadow-lg hover:bg-primary-focus transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <circle cx="12" cy="6" r="1.5" />
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="12" cy="18" r="1.5" />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-gray-900 text-white rounded-box w-44"
            >
              <li>
                <button
                  onClick={() =>
                    handleFavoriteAction(isFavorite ? "remove" : "add", item)
                  }
                  className="hover:bg-primary hover:text-white transition-all px-2 py-1 rounded-md"
                >
                  {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                </button>
              </li>
              <li>
                <button
                  className="hover:bg-primary hover:text-white transition-all px-2 py-1 rounded-md"
                  onClick={() => setDetailsModalItem(item)}
                >
                  Details
                </button>
              </li>
              <li>
                <button
                  className="hover:bg-primary hover:text-whitetransition-all px-2 py-1 rounded-md"
                  onClick={() => setRatingItem(item)} // Set item for rating
                >
                  Rate
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="popular" className="py-16 bg-neutral text-gray-200">
      <div className="container mx-auto px-6">
        {/* Display loading state */}
        {loading && (
          <div className="text-center my-8">
            <p className="text-lg text-gray-400">Loading popular content...</p>
          </div>
        )}

        {/* Display error state */}
        {error && (
          <div className="text-center my-8">
            <p className="text-lg text-red-500">{error}</p>
          </div>
        )}

        {/* Display content when not loading and no error */}
        {!loading && !error && (
          <>
            {modalMessage && (
              <div className="modal modal-open">
                <div className="modal-box">
                  <p
                    className={`py-2 ${
                      modalType === "success" ? "text-white" : "text-red-500"
                    }`}
                  >
                    {modalMessage}
                  </p>
                  <div className="modal-action">
                    <button
                      className="btn btn-primary"
                      onClick={() => setModalMessage(null)}
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            )}

            {detailsModalItem && (
              <div className="modal modal-open">
                <div className="modal-box relative">
                  <button
                    className="btn btn-sm btn-circle absolute right-2 top-2"
                    onClick={() => setDetailsModalItem(null)}
                  >
                    ✕
                  </button>
                  <h3 className="font-bold text-lg text-white">
                    {detailsModalItem.title || detailsModalItem.name}
                  </h3>
                  <figure className="py-4">
                    <img
                      src={
                        detailsModalItem.poster_path
                          ? `https://image.tmdb.org/t/p/w500${detailsModalItem.poster_path}`
                          : fallbackImage
                      }
                      alt={detailsModalItem.title || detailsModalItem.name}
                      className="w-full rounded-lg"
                    />
                  </figure>
                  <p className="py-2 text-gray-400">
                    {detailsModalItem.overview || "No description available."}
                  </p>
                  <p className="py-1 text-sm text-gray-500">
                    <strong>Genres:</strong>{" "}
                    {detailsModalItem.genre_ids
                      ?.map(
                        (id) => movieGenres[id] || tvGenres[id] || "Unknown",
                      )
                      .join(", ") || "N/A"}
                  </p>
                  <div className="modal-action">
                    <button
                      className="btn btn-primary"
                      onClick={() => setDetailsModalItem(null)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

            {ratingItem && (
              <div className="modal modal-open">
                <div className="modal-box relative">
                  <button
                    className="btn btn-sm btn-circle absolute right-2 top-2"
                    onClick={() => setRatingItem(null)} // Close the rating modal
                  >
                    ✕
                  </button>
                  <h3 className="font-bold text-lg text-white">
                    Rate: {ratingItem.title || ratingItem.name}
                  </h3>
                  <Rating
                    tmdbId={ratingItem.id.toString()}
                    initialRating={ratingItem.rating || 0} // Pass initial rating
                    onRatingChange={(newRating) => {
                      console.log("New rating:", newRating);
                      if (ratingItem) ratingItem.rating = newRating; // Update local rating
                      setRatingItem(null); // Close after rating
                    }}
                  />
                </div>
              </div>
            )}

            <h3 className="text-2xl font-bold mb-4 text-white">
              Popular Movies
            </h3>
            <div className="relative mb-8">
              <button
                onClick={() => scroll(moviesRef, "left")}
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
              <div
                ref={moviesRef}
                className="flex overflow-x-scroll scrollbar-hide space-x-4"
              >
                {popularMovies.map((item) => renderCard(item, movieGenres))}
              </div>
              <button
                onClick={() => scroll(moviesRef, "right")}
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

            <h3 className="text-2xl font-bold mb-4 text-white">
              Popular TV Shows
            </h3>
            <div className="relative">
              <button
                onClick={() => scroll(tvShowsRef, "left")}
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
              <div
                ref={tvShowsRef}
                className="flex overflow-x-scroll scrollbar-hide space-x-4"
              >
                {popularTVShows.map((item) => renderCard(item, tvGenres))}
              </div>
              <button
                onClick={() => scroll(tvShowsRef, "right")}
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
          </>
        )}
      </div>
    </section>
  );
};

export default PopularSection;
