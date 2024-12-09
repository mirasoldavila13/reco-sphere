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
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <Router>
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route element={<PublicRoute />}>
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard/:userId" element={<Dashboard />} />
          </Route>

          {/* Catch-all Route */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
