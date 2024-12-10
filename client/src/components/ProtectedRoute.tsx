/**
 * ProtectedRoute Component
 *
 * A wrapper for React Router routes that ensures only authenticated users can access
 * the specified route. Redirects unauthenticated users to the login page.
 *
 * Features:
 * - **Access Control**: Restricts access to sensitive content for unauthenticated users.
 * - **Redirection**: Redirects unauthenticated users to the `/login` page.
 *
 * Dependencies:
 * - React Router's `Navigate` and `Outlet` components for redirection and nested routes.
 * - `authService`: Validates the user's authentication status.
 */

import { Navigate, Outlet } from "react-router-dom";
import authService from "../services/authService";

const ProtectedRoute = () => {
  const isAuthenticated = authService.isAuthenticated();

  // Allow access to child routes if authenticated, otherwise redirect to login
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
