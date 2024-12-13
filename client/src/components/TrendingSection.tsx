/**
 * TrendingSection Component
 *
 * This component displays the trending movies and TV shows fetched from the TMDb API.
 * It provides features such as adding/removing favorites, rating content, and viewing detailed
 * information about each item.
 *
 * ============================
 * **Key Features**
 * ============================
 * 1. **Trending Movies and TV Shows**:
 *    - Fetches and displays the trending movies and TV shows separately.
 *    - Filters the content based on `media_type` (e.g., "movie", "tv").
 *
 * 2. **Favorites Management**:
 *    - Allows users to add or remove items from their favorites.
 *    - Uses the `handleFavorites` utility for backend communication and state synchronization.
 *
 * 3. **Dynamic Genre Mapping**:
 *    - Enriches content with genres using genre mappings fetched from the TMDb API.
 *
 * 4. **Loading and Error States**:
 *    - Implements a `loading` state to display a loading spinner or message during data fetching.
 *    - Implements an `error` state to handle and display error messages if data fetching fails
 *      (e.g., due to authentication or API issues).
 *
 * 5. **Interactive Features**:
 *    - Provides buttons to rate content, view details, and add/remove from favorites.
 *    - Implements a carousel-like scrolling experience for movies and TV shows.
 *
 * 6. **Responsive and User-Friendly UI**:
 *    - Fully responsive layout with hover effects and drop shadows.
 *    - Uses TailwindCSS for consistent styling.
 *
 * ============================
 * **Component Props**
 * ============================
 * - `favorites`: Array of favorite items to manage user's favorites.
 * - `setFavorites`: Function to update the favorites state.
 * - `movieGenres`: Mapping of movie genres by ID.
 * - `tvGenres`: Mapping of TV genres by ID.
 *
 * ============================
 * **State Management**
 * ============================
 * - **`trendingMovies`**: Stores the fetched trending movies.
 * - **`trendingTVShows`**: Stores the fetched trending TV shows.
 * - **`movieGenres` & `tvGenres`**: Maps genre IDs to human-readable genre names.
 * - **`loading`**:
 *    - Tracks whether the component is actively fetching data.
 *    - Displays a loading message or spinner while `true`.
 * - **`error`**:
 *    - Stores error messages when data fetching fails.
 *    - Displays error messages to the user, preventing the display of content if unresolved.
 * - **`modalMessage`**: Displays messages in a modal (e.g., errors, feedback).
 * - **`detailsModalItem`**: Stores the currently selected item for the details modal.
 * - **`ratingItem`**: Stores the currently selected item for the rating modal.
 *
 * ============================
 * **Lifecycle and Side Effects**
 * ============================
 * - Fetches trending data and genres on component mount using `useEffect`.
 * - Cleans up any side effects when the component unmounts.
 * - Updates `loading` and `error` states dynamically to reflect fetch progress and issues.
 *
 * ============================
 * **Functional Flow**
 * ============================
 * 1. Fetches trending movies, TV shows, and genre mappings from the backend.
 * 2. Updates state (`trendingMovies`, `trendingTVShows`, `movieGenres`, `tvGenres`) with fetched data.
 * 3. Manages user interactions (e.g., add to favorites, rate, view details).
 * 4. Dynamically displays content in carousels when data is available.
 * 5. Displays loading states while data is being fetched and error messages when fetching fails.
 *
 * ============================
 * **Error Handling**
 * ============================
 * - **Loading and Error States**:
 *    - `loading`: Ensures no content is displayed until data is fully fetched.
 *    - `error`: Provides user-friendly error messages for API failures or authentication issues.
 * - Prevents invalid actions (e.g., adding "persons" to favorites).
 *
 * ============================
 * **Example Usage**
 * ============================
 * ```tsx
 * import TrendingSection from "./TrendingSection";
 *
 * const App = () => {
 *   const [favorites, setFavorites] = useState([]);
 *
 *   return (
 *     <div className="bg-gray-900 text-white">
 *       <TrendingSection favorites={favorites} setFavorites={setFavorites} />
 *     </div>
 *   );
 * };
 *
 * export default App;
 * ```
 *
 * ============================
 * **Future Enhancements**
 * ============================
 * - Add pagination to fetch additional trending items.
 * - Implement advanced filtering (e.g., by genre, rating, release year).
 * - Integrate recommendations based on trending data.
 * - Add skeleton loading screens for a smoother user experience.
 */

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  TrendingItem,
  TrendingResponse,
  GenreResponse,
  FavoriteItem,
} from "../types";
import fallbackImage from "../assets/images/fallback-image.jpg";
import authService from "../services/authService";
import { handleFavorites } from "../utils/favoritesHandler";
import Rating from "../components/Rating";

interface GenreMap {
  [key: number]: string;
}

interface TrendingSectionProps {
  favorites: FavoriteItem[];
  setFavorites: React.Dispatch<React.SetStateAction<FavoriteItem[]>>;
  movieGenres: GenreMap;
  tvGenres: GenreMap;
}

const TrendingSection: React.FC<TrendingSectionProps> = ({
  favorites = [],
  setFavorites,
}) => {
  const [trendingMovies, setTrendingMovies] = useState<TrendingItem[]>([]);
  const [trendingTVShows, setTrendingTVShows] = useState<TrendingItem[]>([]);
  const [movieGenres, setMovieGenres] = useState<GenreMap>({});
  const [tvGenres, setTVGenres] = useState<GenreMap>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [detailsModalItem, setDetailsModalItem] = useState<TrendingItem | null>(
    null,
  );
  const [ratingItem, setRatingItem] = useState<TrendingItem | null>(null);

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
        const headers: Record<string, string> = {};
        const authToken = authService.getAuthToken();
        if (authToken) {
          headers.Authorization = `Bearer ${authToken}`;
        }

        await Promise.all([fetchTrending(), fetchGenres()]);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch trending items.");
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const fetchTrending = async () => {
    try {
      const response = await axios.get<TrendingResponse>("/api/trending");
      const movies = response.data.results.filter(
        (item) => item.media_type === "movie",
      );
      const tvShows = response.data.results.filter(
        (item) => item.media_type === "tv",
      );
      setTrendingMovies(movies);
      setTrendingTVShows(tvShows);
    } catch (err) {
      console.error("Error fetching trending items:", err);
      setError("Failed to fetch trending items.");
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await axios.get<GenreResponse>("/api/genres");
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
      setError("Failed to fetch genres.");
    }
  };

  const handleFavoriteAction = (
    action: "add" | "remove",
    item: TrendingItem,
  ) => {
    if (item.media_type === "person") {
      setModalMessage("Persons cannot be added to favorites!");
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
      setModalMessage,
      {},
      { movieGenres, tvGenres },
    );
  };

  const renderCard = (item: TrendingItem, genres: GenreMap) => {
    const isFavorite = favorites.some(
      (fav) => fav.id === item.id && fav.mediaType === item.media_type,
    );

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

        {authService.isAuthenticated() && (
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
                    className="hover:bg-primary hover:text-white transition-all px-2 py-1 rounded-md"
                    onClick={() => setRatingItem(item)} // Set item for rating
                  >
                    Rate
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <section id="trending" className="py-16 bg-neutral text-gray-200">
      <div className="container mx-auto px-6">
        {/* Display loading message */}
        {loading && (
          <div className="text-center my-8">
            <p className="text-lg text-gray-400">Loading trending content...</p>
          </div>
        )}

        {/* Display error message */}
        {error && (
          <div className="text-center my-8">
            <p className="text-lg text-red-500">{error}</p>
          </div>
        )}

        {/* Display modals and content if not loading or error */}
        {!loading && !error && (
          <>
            {modalMessage && (
              <div className="modal modal-open">
                <div className="modal-box">
                  <p>{modalMessage}</p>
                  <div className="modal-action">
                    <button
                      className="btn"
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
              Trending Movies
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
                {trendingMovies.map((item) => renderCard(item, movieGenres))}
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
              Trending TV Shows
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
                {trendingTVShows.map((item) => renderCard(item, tvGenres))}
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

export default TrendingSection;
