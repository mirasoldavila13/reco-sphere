/**
 * DashboardNavbar Component
 *
 * A navigation bar for the dashboard, providing quick access to the landing page and a logout option.
 *
 * Features:
 * - Displays the application logo as a clickable link to the landing page.
 * - Provides a logout button for authenticated users.
 * - Ensures secure logout by clearing the JWT token and redirecting the user to the landing page.
 *
 * Design:
 * - Minimalist and responsive design with TailwindCSS.
 * - Includes hover effects for better user experience.
 */

import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";

const DashboardNavbar = () => {
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    authService.logout(); // Clear the JWT token
    navigate("/"); // Redirect to the landing page
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center shadow-md">
      {/* RecoSphere Logo Section */}
      <div className="flex items-center">
        <Link to="/" className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold">
            <span className="text-primary">Reco</span>
            <span className="text-white">Sphere</span>
          </h1>
        </Link>
      </div>

      {/* Logout Button */}
      <div>
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
