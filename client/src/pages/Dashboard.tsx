import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import authService from "../services/authService";
import DashboardNavbar from "../components/DashboardNavbar";

const Dashboard = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch user profile from authService
    const profile = authService.getProfile();
    if (profile) {
      setUserId(profile.id); // Set the user ID from the JWT
    }
  }, []); // Runs once when the component is mounted

  if (!userId) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-neutral text-gray-200">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-neutral text-gray-200">
      {/* Dashboard Navbar */}
      <DashboardNavbar />

      {/* Main Content */}
      <main className="flex items-center justify-center h-full">
        <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-3xl font-bold text-white mb-6">
            Welcome to RecoSphere, User!
          </h1>
          <p className="text-gray-400 mb-6">
            Your account has been created successfully. Explore your
            personalized recommendations and much more!
          </p>
          <div className="flex flex-col space-y-4">
            <Link to="/" className="btn btn-primary">
              Go to Homepage
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};
export default Dashboard;
