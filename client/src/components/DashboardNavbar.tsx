/**
 * DashboardNavbar Component
 *
 * This component provides a responsive and dynamic navigation bar for authenticated users
 * within the dashboard section of the application. It ensures users can easily navigate
 * between core features like the dashboard, favorites, and profile, while also providing
 * logout functionality.
 *
 * Features:
 * - **Dynamic Route Detection**:
 *   - Highlights and conditionally hides links to the currently active page.
 * - **Authentication-Integrated Navigation**:
 *   - Uses `authService` to fetch the user's details and manage authentication state.
 * - **Logout Functionality**:
 *   - Logs out the user, clears the session, and redirects to the homepage.
 *
 * Design Considerations:
 * - Tailwind CSS for responsive and consistent styling.
 * - Conditional rendering ensures unnecessary links (e.g., the current page) are not displayed.
 * - Minimalist design for intuitive navigation while maintaining branding consistency.
 *
 * Dependencies:
 * - React Router:
 *   - `useNavigate` for programmatic navigation.
 *   - `useLocation` for detecting the current route.
 * - `authService` for authentication-related utilities.
 */

import { Link, useNavigate, useLocation } from "react-router-dom";
import authService from "../services/authService";

const DashboardNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    authService.logout();
    navigate("/");
  };

  const user = authService.getProfile();
  const currentPath = location.pathname;

  // Determine current route to conditionally show navigation links
  const isFavoritesPage = currentPath === `/dashboard/${user?.id}/favorites`;
  const isProfilePage = currentPath === `/profile/${user?.id}`;
  const isDashboardPage = currentPath === `/dashboard/${user?.id}`;

  return (
    <nav className="bg-neutral text-white px-6 py-4 flex justify-between items-center shadow-md">
      {/* Logo Section */}
      <div className="flex items-center">
        <Link to="/" className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold">
            <span className="text-primary">Reco</span>
            <span className="text-white">Sphere</span>
          </h1>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center space-x-6">
        {!isDashboardPage && (
          <Link
            to={`/dashboard/${user?.id}`}
            className="text-sm hover:text-primary transition"
          >
            Dashboard
          </Link>
        )}
        {!isFavoritesPage && (
          <Link
            to={`/dashboard/${user?.id}/favorites`}
            className="text-sm hover:text-primary transition"
          >
            Favorites
          </Link>
        )}
        {!isProfilePage && (
          <Link
            to={`/profile/${user?.id}`}
            className="text-sm hover:text-primary transition"
          >
            Profile
          </Link>
        )}
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded text-sm hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
