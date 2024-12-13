/**
 * FavoritesPage Component
 *
 * This component displays and manages the authenticated user's favorite movies and TV shows.
 * It performs CRUD operations by interacting with the backend, ensuring real-time updates
 * to the user's favorites. Any changes made (e.g., removing a favorite) are reflected
 * dynamically within this component and other interconnected components, such as `Dashboard`.
 *
 * Key Backend Integration:
 * - **GraphQL Schema**:
 *   - Includes queries (`getFavorites`) and mutations (`addFavorite`, `removeFavorite`) for
 *     managing user favorites.
 *   - These queries and mutations are implemented in `schema.js` and resolved using Mongoose models.
 * - **REST API Endpoints**:
 *   - Interacts with endpoints in `api/favorites.js` to fetch, add, and remove favorites.
 *   - Endpoints are secured with JWT-based authentication middleware (`authMiddleware.js`).
 * - **MongoDB Database**:
 *   - Favorites are stored in the `favorites` collection using the `Favorite` Mongoose model.
 *   - The model ensures unique entries for each user and timestamps for tracking changes.
 *
 * Features:
 * - **Fetch and Display Favorites**:
 *   - Retrieves the user's favorite movies and TV shows upon component mount.
 *   - Categorizes favorites into movies and TV shows for better organization.
 * - **Remove Favorites**:
 *   - Users can remove a movie or TV show from their favorites.
 *   - The removal triggers a backend API call, updates the `favorites` state locally, and ensures
 *     consistency across the application, including the `Dashboard` component.
 * - **Real-Time Updates**:
 *   - Ensures that any changes (e.g., removing a favorite) are reflected dynamically within this
 *     component and other connected components.
 * - **Error Handling**:
 *   - Provides detailed error feedback for issues such as authentication failure or backend errors.
 * - **User-Friendly UI**:
 *   - Utilizes the `FavoritesSection` component for a modular and polished user interface.
 *   - Includes global navigation elements like `DashboardNavbar` and `Footer` for consistent design.
 *
 * Dependencies:
 * - `authService`: Manages JWT tokens and retrieves user authentication details.
 * - `FavoritesSection`: A reusable child component responsible for displaying categorized lists of favorites.
 * - **Backend**:
 *   - GraphQL resolvers (`getFavorites`, `addFavorite`, `removeFavorite`) in `schema.js`.
 *   - REST controllers (`favoritesController.js`) and the `Favorite` Mongoose model.
 *
 * Component Flow:
 * 1. **Fetch Favorites**:
 *    - On component mount, the `fetchFavorites` function retrieves the user's favorites from the backend.
 *    - If successful, the favorites are stored in the `favorites` state; otherwise, an error is displayed.
 * 2. **Categorize Favorites**:
 *    - Separates the fetched favorites into movies and TV shows based on their `mediaType`.
 * 3. **Render Favorites**:
 *    - The categorized data is passed to the `FavoritesSection` component for rendering.
 *    - Users can interact with the lists (e.g., remove items), triggering backend updates and UI synchronization.
 * 4. **Real-Time Dashboard Updates**:
 *    - Any updates to the favorites are reflected in connected components like `Dashboard`, ensuring consistent data across the application.
 *
 * Future Improvements:
 * - Enhance the `FavoritesSection` component to support sorting and filtering options.
 * - Add pagination or lazy loading for larger lists of favorites.
 * - Improve metadata enrichment (e.g., detailed genres, runtime, or user ratings) for a more engaging UI.
 * - Introduce visual feedback for removal actions (e.g., animations or confirmation modals).
 *
 * Notes:
 * - The ability to remove movies and TV shows ensures the user has complete control over their favorites list.
 * - Changes are consistently propagated across components, such as `Dashboard`.
 */

import { useEffect, useState } from "react";
import authService from "../services/authService";
import DashboardNavbar from "../components/DashboardNavbar";
import Footer from "../components/Footer";
import FavoritesSection from "../components/FavoritesSection";
import { FavoriteItem } from "../types";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch favorites from the API
  const fetchFavorites = async () => {
    try {
      const token = authService.getAuthToken();
      if (!token) {
        throw new Error("Authentication token is missing. Please log in.");
      }

      const response = await fetch("/api/favorites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch favorites");
      }

      const data = await response.json();
      setFavorites(data);
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error fetching favorites:", err.message);
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const favoriteMovies = favorites.filter((item) => item.mediaType === "movie");
  const favoriteTVShows = favorites.filter((item) => item.mediaType === "tv");

  if (loading) return <p>Loading favorites...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <DashboardNavbar />
      <div className="container mx-auto py-6">
        <h2 className="text-3xl font-bold text-left mb-6 text-white">
          Your Favorites
        </h2>
        {/* Movies Section */}
        <FavoritesSection
          favorites={favoriteMovies}
          setFavorites={setFavorites}
          title="Favorite Movies"
          movieGenres={{}}
          tvGenres={{}}
        />
        {/* TV Shows Section */}
        <FavoritesSection
          favorites={favoriteTVShows}
          setFavorites={setFavorites}
          title="Favorite TV Shows"
          movieGenres={{}}
          tvGenres={{}}
        />
      </div>
      <Footer />
    </>
  );
};

export default FavoritesPage;
