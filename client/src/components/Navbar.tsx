/**
 * Navbar Component
 *
 * Purpose:
 * - Provides a responsive navigation bar that dynamically adjusts based on the user's authentication state.
 * - Offers consistent navigation options across desktop and mobile devices.
 *
 * Key Features:
 * 1. **Dynamic Content Rendering**:
 *    - Displays different options for authenticated and unauthenticated users:
 *      - Authenticated: "Dashboard" and "Logout".
 *      - Non-Authenticated: "Login" and "Sign Up".
 * 2. **Responsive Design**:
 *    - Desktop: Navigation links are directly visible.
 *    - Mobile: A collapsible hamburger menu is provided for space efficiency.
 * 3. **Authentication State Management**:
 *    - Determines whether the user is authenticated using `authService.isAuthenticated()`.
 *    - Retrieves user-specific details (like user ID) dynamically.
 * 4. **Logout Functionality**:
 *    - Clears the user's authentication token.
 *    - Resets the navigation state and redirects to the landing page.
 * 5. **Persistent Header**:
 *    - Fixed at the top of the viewport for consistent access to navigation options.
 *
 * Lifecycle:
 * - React’s `useEffect` hook ensures that:
 *   - The authentication state is updated upon component mount.
 *   - The navbar dynamically adapts to screen resizing.
 *
 * Event Handlers:
 * - `toggleMenu`: Toggles the mobile menu visibility.
 * - `handleResize`: Adjusts the layout and menu state based on screen width.
 * - `handleLogout`: Logs the user out, clears the token, and navigates to the home page.
 *
 * Dependencies:
 * - React Router: Provides `Link` for navigation and `useNavigate` for redirection.
 * - `authService`: Manages authentication logic (e.g., validating tokens, fetching user details, and handling logout).
 * - TailwindCSS and DaisyUI: Ensure styling consistency and responsiveness.
 *
 * Design Considerations:
 * - Scalability:
 *   - The component structure supports the addition of new navigation links with minimal changes.
 * - Accessibility:
 *   - Semantic HTML (e.g., `header`, `nav`, `ul`) and ARIA roles ensure compatibility with screen readers.
 * - Performance:
 *   - Efficient state updates and event listeners to minimize unnecessary re-renders.
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
