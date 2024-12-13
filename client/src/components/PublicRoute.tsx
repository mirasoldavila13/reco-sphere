/**
 * PublicRoute Component
 *
 * The `PublicRoute` component acts as a guard for routes intended exclusively for unauthenticated users, such as
 * login or registration pages. It ensures that authenticated users are redirected to their dashboard or a
 * predefined route, thus restricting access to public routes for logged-in users.
 *
 * ===========================
 * **Core Functionality**
 * ===========================
 * 1. **Access Control**:
 *    - Determines the user's authentication status using `authService`.
 *    - If the user is authenticated, they are redirected to their dashboard.
 *
 * 2. **Dynamic Redirection**:
 *    - Redirects authenticated users to `/dashboard/:userId`, where `userId` is dynamically retrieved
 *      from the authenticated user's profile.
 *    - If no user profile is available, fallback handling may be necessary.
 *
 * ==========================
 * **Implementation Details**
 * ==========================
 * - **Authentication Check**:
 *   - Uses `authService.isAuthenticated()` to validate if the user is logged in.
 *   - Retrieves the user's profile using `authService.getProfile()` for dynamic routing.
 *
 * - **Routing Logic**:
 *   - Uses React Router's `<Navigate>` for redirection.
 *   - Employs `<Outlet>` to render nested child routes if the user is unauthenticated.
 *
 * =====================
 * **State Management**
 * =====================
 * - Relies entirely on `authService` for authentication state and user profile data.
 * - No internal state is managed within the component.
 *
 * ========================
 * **Key Dependencies**
 * ========================
 * - **React Router**:
 *   - `<Outlet>`: Renders nested child routes for unauthenticated users.
 *   - `<Navigate>`: Redirects authenticated users to their dashboard dynamically.
 *
 * - **authService**:
 *   - A service module providing methods such as `isAuthenticated()` and `getProfile()`
 *     for authentication validation and user data retrieval.
 *
 * ==========================
 * **Example Use Case**
 * ==========================
 * Protecting public routes like `Login` and `Register`:
 *
 * ```tsx
 * import PublicRoute from "./PublicRoute";
 * import Login from "./Login";
 * import Register from "./Register";
 *
 * <Route element={<PublicRoute />}>
 *   <Route path="/login" element={<Login />} />
 *   <Route path="/register" element={<Register />} />
 * </Route>
 * ```
 *
 * ========================
 * **Error Handling**
 * ========================
 * - **Missing Profile**:
 *   - If `authService.getProfile()` returns `null`, ensure fallback behavior is implemented
 *     to redirect to a general dashboard or a default route.
 * - **Broken AuthService**:
 *   - Log errors if `authService` methods fail unexpectedly, ensuring smooth redirection.
 *
 * ========================
 * **Security Considerations**
 * ========================
 * - Ensure `authService.isAuthenticated()` correctly validates tokens or session data.
 * - Use HTTPS to secure communication of sensitive authentication information.
 *
 * ===========================
 * **Edge Cases**
 * ===========================
 * - **Expired Token**:
 *   - Handle cases where the user is marked as authenticated but the token is expired or invalid.
 * - **Invalid User ID**:
 *   - Validate the user ID retrieved from the profile to prevent incorrect redirections.
 * - **Unauthenticated State**:
 *   - Ensure the component renders the intended child routes for unauthenticated users.
 *
 * ========================
 * **Component Structure**
 * ========================
 * - **Conditional Rendering**:
 *   - Redirects authenticated users to `/dashboard/:userId`.
 *   - Renders `<Outlet>` for unauthenticated users.
 *
 * ==========================
 * **Future Enhancements**
 * ==========================
 * - Implement role-based redirection (e.g., admin users vs. regular users).
 * - Add support for query parameters or session-based redirection for enhanced user experience.
 */

import { Navigate, Outlet } from "react-router-dom";
import authService from "../services/authService";

const PublicRoute = () => {
  const isAuthenticated = authService.isAuthenticated();
  const userProfile = authService.getProfile();

  // Redirect authenticated users to their dashboard dynamically
  return isAuthenticated ? (
    <Navigate to={`/dashboard/${userProfile?.id}`} />
  ) : (
    <Outlet />
  );
};

export default PublicRoute;
