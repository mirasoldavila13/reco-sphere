/**
 * Dashboard Component
 *
 * The `Dashboard` component serves as the primary interface for authenticated users, providing
 * an overview of their personalized content, including trending items, popular items, and
 * user favorites. It integrates multiple child components to deliver a rich and interactive
 * user experience.
 *
 * ============================
 * **Key Features**
 * ============================
 * 1. **User Greeting**:
 *    - Dynamically greets the logged-in user using their name from the authentication profile.
 *    - Displays a default message if the user's name is unavailable.
 *
 * 2. **Favorites Integration**:
 *    - Displays the user's favorite movies and TV shows.
 *    - Allows seamless addition and removal of favorites with real-time state updates.
 *
 * 3. **Trending & Popular Content**:
 *    - Includes `TrendingSection` and `PopularSection` to highlight trending and popular movies/TV shows.
 *    - Fetches content and genre metadata from APIs.
 *
 * 4. **Shared Favorites State**:
 *    - Maintains a single state for favorites, shared across all sections for consistency.
 *
 * 5. **Error Handling**:
 *    - Displays error messages when data fetching fails or if the user is not authenticated.
 *
 * 6. **Responsive Layout**:
 *    - Designed to adapt to various screen sizes with a responsive grid and spacing.
 *
 * ============================
 * **State Management**
 * ============================
 * - `userName`: Stores the logged-in user's name for personalized greeting.
 * - `favorites`: Shared state for all favorites across sections.
 * - `movieGenres`: Maps movie genre IDs to names.
 * - `tvGenres`: Maps TV genre IDs to names.
 * - `error`: Stores error messages to display to the user.
 *
 * ============================
 * **Child Components**
 * ============================
 * - **`DashboardNavbar`**:
 *   - Navigation bar for dashboard-specific routes and actions.
 * - **`TrendingSection`**:
 *   - Displays trending movies and TV shows.
 * - **`PopularSection`**:
 *   - Displays popular movies and TV shows.
 * - **`FavoritesSection`**:
 *   - Displays the user's favorite movies and TV shows.
 * - **`Footer`**:
 *   - Consistent footer with branding and navigation links.
 *
 * ============================
 * **Data Fetching**
 * ============================
 * - Fetches user favorites and genre metadata via API calls.
 * - Uses `authService` to retrieve the user's authentication profile and token.
 * - Handles both authenticated and unauthenticated states gracefully.
 *
 * ============================
 * **Error Scenarios**
 * ============================
 * - Displays error messages for:
 *   - Missing authentication token.
 *   - Failed API calls for favorites or genres.
 *   - Unauthenticated user attempting to access the dashboard.
 *
 * ============================
 * **Usage Example**
 * ============================
 * ```tsx
 * import Dashboard from "./Dashboard";
 *
 * const App = () => {
 *   return <Dashboard />;
 * };
 *
 * export default App;
 * ```
 *
 * ============================
 * **Future Enhancements**
 * ============================
 * 1. Add search functionality to filter displayed content dynamically.
 * 2. Implement paginated or infinite scrolling for large datasets.
 * 3. Include user statistics, such as total favorites and watch history.
 * 4. Add settings or customization options for personalized dashboards.
 */

import { useEffect, useState } from "react";
import authService from "../services/authService";
import DashboardNavbar from "../components/DashboardNavbar";
import TrendingSection from "../components/TrendingSection";
import PopularSection from "../components/PopularSection";
import FavoritesSection from "../components/FavoritesSection";
import Footer from "../components/Footer";
import { FavoriteItem, GenreResponse } from "../types";

interface GenreMap {
  [key: number]: string;
}

const Dashboard = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]); // Shared state for all favorites
  const [movieGenres, setMovieGenres] = useState<GenreMap>({});
  const [tvGenres, setTVGenres] = useState<GenreMap>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const profile = authService.getProfile();
      if (profile) {
        setUserName(profile.name);

        try {
          const token = authService.getAuthToken();
          if (!token) {
            throw new Error("Invalid session. Please log in again.");
          }

          const [favoritesResponse, genresResponse] = await Promise.all([
            fetch("/api/favorites", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch("/api/genres"),
          ]);

          if (!favoritesResponse.ok || !genresResponse.ok) {
            throw new Error("Failed to fetch data.");
          }

          const favoritesData: FavoriteItem[] = await favoritesResponse.json(); // Assuming the API returns FavoriteItem[]
          const genresData: GenreResponse = await genresResponse.json();

          setFavorites(favoritesData);
          setMovieGenres(
            genresData.movieGenres.reduce((map, genre) => {
              map[genre.id] = genre.name;
              return map;
            }, {} as GenreMap),
          );
          setTVGenres(
            genresData.tvGenres.reduce((map, genre) => {
              map[genre.id] = genre.name;
              return map;
            }, {} as GenreMap),
          );
        } catch (err) {
          console.error("Error fetching data:", err);
          setError("Unable to fetch data. Please try again later.");
        }
      } else {
        setError("You must be logged in to view this page.");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-neutral text-gray-200">
      <DashboardNavbar />
      <main className="container mx-auto px-6 py-10">
        {error && (
          <p className="text-center text-red-500 font-bold mb-6">{error}</p>
        )}
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Welcome {userName || "to Your Dashboard"}!
        </h1>

        {/* Render PopularSection */}
        <PopularSection
          favorites={favorites} // Pass shared favorites
          setFavorites={setFavorites} // Pass state setter
        />
        {/* Render FavoritesSection */}
        <FavoritesSection
          favorites={favorites}
          setFavorites={setFavorites}
          title="Your Favorites"
          movieGenres={movieGenres} // Pass movieGenres
          tvGenres={tvGenres} // Pass tvGenres
        />

        {/* Render TrendingSection */}
        <TrendingSection
          favorites={favorites} // Pass shared favorites
          setFavorites={setFavorites} // Pass state setter
          movieGenres={movieGenres}
          tvGenres={tvGenres}
        />
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
