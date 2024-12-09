/**
 * PublicRoute Component
 *
 * A wrapper for React Router routes that restricts access to authenticated users.
 * Redirects authenticated users to their dashboard while allowing unauthenticated users
 * to access the specified route.
 *
 * Features:
 * - **Redirection**: Ensures authenticated users cannot access public routes like `Login` or `Sign Up`.
 * - **Dynamic Routing**: Redirects to `/dashboard/:userId` with the correct user ID.
 *
 * Dependencies:
 * - React Router's `Navigate` and `Outlet` components for redirection and nested routes.
 * - `authService`: Validates the user's authentication status.
 */

import { Navigate, Outlet } from "react-router-dom";
import authService from "../services/authService";

const PublicRoute = () => {
  const isAuthenticated = authService.isAuthenticated();

  // Redirect to dashboard if authenticated, otherwise allow access to child routes
  return isAuthenticated ? <Navigate to="/dashboard/:userId" /> : <Outlet />;
};

export default PublicRoute;
