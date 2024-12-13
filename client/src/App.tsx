/**
 * App Component
 *
 * The main application component that defines the routing structure and integrates public
 * and protected routes.
 *
 * Features:
 * - **Public Routes**:
 *   - Landing Page (`/`)
 *   - Registration Page (`/register`)
 * - **Protected Routes**:
 *   - Dashboard (`/dashboard/:userId`)
 * - **Catch-All Route**: Redirects all undefined routes to the Landing Page.
 *
 * Routing Design:
 * - **PublicRoute**: Restricts access to authenticated users by redirecting them to their dashboard.
 * - **ProtectedRoute**: Ensures only authenticated users can access protected content.
 * - Integration with React Router for dynamic URL parameters.
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import LandingPage from "./pages/LandingPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Credits from "./components/Credits";
import Dashboard from "./pages/Dashboard";
import FavoritesPage from "./pages/FavoritesPage";
import ProfilePage from "./pages/ProfilePage";
import ComingSoon from "./pages/ComingSoon";

const App = () => {
  return (
    <Router>
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/credit" element={<Credits />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route element={<PublicRoute />}>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard/:userId" element={<Dashboard />} />
            <Route
              path="/dashboard/:userId/favorites"
              element={<FavoritesPage />}
            />
            <Route path="/profile/:userId" element={<ProfilePage />} />
          </Route>

          {/* Catch-all Route */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
