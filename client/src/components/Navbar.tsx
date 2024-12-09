/**
 * Navbar Component
 *
 * The `Navbar` component is a dynamic and responsive navigation bar that adapts its content
 * based on the user's authentication state. It provides a clean and consistent user experience
 * across the application, whether the user is logged in or not.
 *
 * Behavior:
 * - **For Non-Authenticated Users**:
 *   - Displays "Login" and "Sign Up" buttons, ensuring that unauthenticated users only see the
 *     options to access or create an account.
 *   - Even when navigating to the home page, the options remain consistent for non-authenticated users.
 * - **For Authenticated Users**:
 *   - Displays "Dashboard" (linking to `/dashboard/:userId`) and "Logout" buttons.
 *   - If a logged-in user navigates to the home page (`/`), the navigation bar dynamically adjusts
 *     to reflect the authenticated state by showing "Dashboard" and "Logout" options instead
 *     of "Login" and "Sign Up".
 *
 * Features:
 * - **Dynamic Content Based on Authentication State**:
 *   - Authentication is determined by the presence of a valid JWT token (checked using `authService.isAuthenticated`).
 *   - Dashboard navigation uses the logged-in user's ID, extracted dynamically from the JWT payload.
 * - **Logout Functionality**:
 *   - Provides a seamless logout experience by clearing the authentication token, resetting the navigation state,
 *     and redirecting the user to the landing page (`/`).
 * - **Responsive Design**:
 *   - Automatically adjusts layout for desktop and mobile views.
 *   - On desktop, navigation links are displayed directly.
 *   - On mobile, a collapsible hamburger menu is provided.
 * - **Persistent Header**:
 *   - The navbar remains fixed at the top of the viewport for consistent access to navigation options.
 *
 * State Management:
 * - `menuOpen`: Tracks whether the mobile menu is open.
 * - `isMobile`: Tracks if the viewport width qualifies as mobile.
 * - `isAuthenticated`: Tracks the user's login state by verifying the presence and validity of a JWT token.
 *
 * Event Handlers:
 * - `toggleMenu`: Toggles the visibility of the mobile navigation menu.
 * - `handleResize`: Dynamically adjusts the `isMobile` state and menu visibility based on viewport size.
 * - `handleLogout`: Logs the user out, clears the token, and redirects to the home page.
 *
 * Lifecycle:
 * - Listens to `resize` events to adjust layout dynamically.
 * - Syncs the authentication state upon component mount and updates in real-time based on user actions.
 *
 * Dependencies:
 * - React Router's `Link` for navigation.
 * - `authService` for authentication logic, including token validation, retrieval of user details, and logout handling.
 * - TailwindCSS and DaisyUI for styling.
 *
 * Design Considerations:
 * - Desktop Navigation:
 *   - Displays buttons dynamically for either "Login/Sign Up" or "Dashboard/Logout" based on authentication.
 * - Mobile Navigation:
 *   - Offers a toggleable menu to conserve screen space and maintain usability on smaller devices.
 *
 * Usage:
 * Include this component at the top of your application's layout to provide dynamic and consistent navigation.
 */

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isAuthenticated, setIsAuthenticated] = useState(
    authService.isAuthenticated(),
  );
  const navigate = useNavigate();

  // Toggles the mobile menu visibility
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Handles screen resizing to toggle the menu state
  const handleResize = () => {
    if (window.innerWidth >= 768) {
      setMenuOpen(false);
      setIsMobile(false);
    } else {
      setIsMobile(true);
    }
  };

  // Handles the logout action
  const handleLogout = () => {
    authService.logout(); // Clear the token
    setIsAuthenticated(false); // Update state
    navigate("/"); // Redirect to the landing page
  };

  // Sync authentication state and window resize event listener
  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated()); // Check authentication state
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <header className="bg-neutral text-text fixed top-0 left-0 w-full z-50 shadow-md">
      <nav className="flex justify-between items-center py-4 px-4">
        {/* RecoSphere Logo Section */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold">
              <span className="text-primary">Reco</span>
              <span className="text-white">Sphere</span>
            </h1>
          </Link>
        </div>

        {/* Buttons for Desktop */}
        <div className="hidden md:flex space-x-4 ml-auto">
          {isAuthenticated ? (
            <>
              {/* Authenticated User Options */}
              <Link
                to={`/dashboard/${authService.getProfile()?.id}`}
                className="btn btn-accent"
              >
                Dashboard
              </Link>
              <button onClick={handleLogout} className="btn btn-error">
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Non-Authenticated User Options */}
              <Link to="/login" className="btn btn-outline btn-accent">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Hamburger Button */}
        <button
          className="block md:hidden focus:outline-none ml-auto"
          onClick={toggleMenu}
        >
          <div className="flex flex-col items-center justify-center w-6 h-6 space-y-1">
            <span className="block w-full h-0.5 bg-white"></span>
            <span className="block w-full h-0.5 bg-white"></span>
            <span className="block w-full h-0.5 bg-white"></span>
          </div>
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && isMobile && (
        <div className="absolute top-16 left-0 w-full bg-neutral py-4">
          <ul
            role="list"
            className="flex flex-col items-center space-y-4 text-white"
          >
            {isAuthenticated ? (
              <>
                {/* Authenticated User Options */}
                <li>
                  <Link
                    to={`/dashboard/${authService.getProfile()?.id}`}
                    className="btn btn-accent"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="btn btn-error">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                {/* Non-Authenticated User Options */}
                <li>
                  <Link
                    to="/login"
                    className="btn btn-outline hover:bg-primary"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="btn btn-primary !text-white !hover:text-white bg-primary hover:bg-secondary"
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
