/**
 * ProtectedRoute Component
 *
 * The `ProtectedRoute` component serves as a safeguard for routing within the application. It ensures
 * that only authenticated users can access specific routes and redirects unauthenticated users
 * to the login page. This helps secure sensitive or restricted areas of the platform, such as
 * user dashboards, favorites, and settings.
 *
 * =======================
 * **Core Functionality**
 * =======================
 * 1. **Access Control**:
 *    - Checks the user's authentication status using the `authService`.
 *    - Allows access to child routes if the user is authenticated.
 *
 * 2. **Redirection**:
 *    - Redirects unauthenticated users to the `/login` page for authentication.
 *    - Prevents unauthorized access to protected content.
 *
 * =======================
 * **Implementation Details**
 * =======================
 * - **Authentication Check**:
 *   - Calls the `authService.isAuthenticated()` method to validate the user's login status.
 *   - This method typically checks for a valid JWT token stored in cookies or local storage.
 *
 * - **Routing Logic**:
 *   - Uses React Router's `<Navigate>` component for redirection.
 *   - Employs `<Outlet>` to render nested routes if the user is authenticated.
 *
 * =====================
 * **State Management**
 * =====================
 * - Relies on `authService` for authentication state.
 * - The component itself does not manage local state, simplifying its design.
 *
 * =====================
 * **Key Dependencies**
 * =====================
 * - **React Router**:
 *   - `<Outlet>`: Renders nested child routes within the protected route.
 *   - `<Navigate>`: Redirects users to a specific route (e.g., `/login`).
 *
 * - **authService**:
 *   - A service module that provides methods for authentication, such as `isAuthenticated`.
 *
 * ==========================
 * **Example Use Case**
 * ==========================
 * Protecting a user's dashboard:
 *
 * ```tsx
 * import ProtectedRoute from "./ProtectedRoute";
 * import Dashboard from "./Dashboard";
 *
 * <Route path="/dashboard" element={<ProtectedRoute />}>
 *   <Route path=":userId" element={<Dashboard />} />
 * </Route>
 * ```
 *
 * =========================
 * **Error Handling**
 * =========================
 * - If `authService.isAuthenticated()` throws an error, consider adding a fallback route
 *   or logging the error to an analytics service.
 *
 * ========================
 * **Security Considerations**
 * ========================
 * - Ensure `authService.isAuthenticated()` accurately verifies token validity (e.g., expiration, signature).
 * - Use HTTPS to protect sensitive token exchanges.
 * - For added security, pair client-side protection with server-side validation for API requests.
 *
 * ===========================
 * **Edge Cases**
 * ===========================
 * - **Expired Token**:
 *   - If a user's session has expired, ensure they are redirected to `/login`.
 * - **Unregistered User**:
 *   - Redirects users who attempt to access protected routes without registering.
 * - **Broken AuthService**:
 *   - Add logging to handle unexpected behavior from `authService`.
 *
 * ==========================
 * **Component Structure**
 * ==========================
 * - **Conditional Rendering**:
 *   - Renders `<Outlet>` for authenticated users.
 *   - Renders `<Navigate>` for unauthenticated users.
 *
 * ========================
 * **Future Enhancements**
 * ========================
 * - Implement a fallback component (e.g., a loading spinner) for pending authentication checks.
 * - Add role-based routing to restrict access by user roles (e.g., admin vs. standard user).
 */

import { Navigate, Outlet } from "react-router-dom";
import authService from "../services/authService";

const ProtectedRoute = () => {
  const isAuthenticated = authService.isAuthenticated();

  // Allow access to child routes if authenticated, otherwise redirect to login
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
