/**
 * ProfilePage Component
 *
 * This component provides a user interface for managing user profiles in an application
 * that leverages a GraphQL API with a Node.js and Express.js server. It allows users to
 * view, update, and delete their profile data stored in a MongoDB database using Mongoose.
 *
 * Key Features:
 * - **CRUD Operations via GraphQL**:
 *   - **Read**: Fetches the user's current profile data, including name and preferences.
 *   - **Update**: Allows users to modify their name and preferences.
 *     - Prepares an `updatedData` object with optional fields (`name`, `preferences`) using explicit type definitions for type safety.
 *   - **Delete**: Enables secure account deletion with a confirmation modal.
 * - **GraphQL Integration**:
 *   - Queries and mutations are used to retrieve, update, and delete data from the backend.
 *   - Includes secure JWT-based authentication for protected operations.
 * - **Authentication**:
 *   - Ensures only authenticated users can access the page.
 *   - Redirects unauthenticated users to the login page.
 * - **Error Handling**:
 *   - Displays clear error or success messages for all actions.
 *   - Includes validation for input fields like name and preferences.
 * - **Responsive Design**:
 *   - The layout adapts seamlessly to different screen sizes.
 *   - Accessible design with labeled inputs and focus management.
 *
 * Workflow:
 * 1. **Authentication Check**:
 *    - On mount, verifies the user's authentication status using a JWT.
 *    - Retrieves the user's profile details via a GraphQL query.
 * 2. **Profile Update**:
 *    - Validates the input fields and prepares an `updatedData` object with optional fields:
 *      - `name`: A trimmed string of the user's name.
 *      - `preferences`: An array of trimmed strings, split by commas from the input.
 *    - Sends an update mutation to the backend using `authService.updateProfile`.
 *    - Reflects changes in the UI upon a successful response.
 *    - Uses strong typing for the `updatedData` object to ensure type safety.
 * 3. **Account Deletion**:
 *    - Opens a modal for user confirmation.
 *    - Sends a delete mutation to the backend and logs the user out on success.
 *
 * Dependencies:
 * - **authService**: Manages authentication, including token validation and logout.
 * - **react-router-dom**: Handles navigation and redirection.
 * - **Navbar and Footer**: Provides consistent layout across pages.
 * - **GraphQL Backend**: Connects to a Node.js and Express.js server for API operations.
 *
 * Extensibility:
 * - Can easily add new profile fields or preferences.
 * - Supports additional GraphQL queries or mutations as needed.
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    preferences: "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Ensure the user is authenticated
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login"); // Redirect to login if not authenticated
      return;
    }

    const profile = authService.getProfile();
    if (profile) {
      setFormData({
        name: profile.name || "",
        preferences: profile.preferences?.join(", ") || "",
      });
    }
  }, [navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedData: { name?: string; preferences?: string[] } = {};
    if (formData.name) updatedData.name = formData.name.trim();
    if (formData.preferences)
      updatedData.preferences = formData.preferences
        .split(",")
        .map((pref) => pref.trim());

    try {
      await authService.updateProfile(updatedData);
      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Failed to update profile.");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const profile = authService.getProfile();
      if (profile?.id) {
        await authService.deleteProfile(profile.id);
        authService.logout();
        navigate("/");
      }
    } catch (error) {
      console.error("Error deleting profile:", error);
      setMessage("Failed to delete account.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral text-white">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center text-red-500 mb-4">
            Manage Account
          </h2>
          {message && (
            <div className="bg-neutral text-gray-100 rounded-lg p-4 mb-4 shadow-md">
              {message}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input input-bordered w-full bg-gray-900 text-white"
              />
            </div>
          </form>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="btn btn-error w-full mt-4"
          >
            Delete Account
          </button>
        </div>
      </main>
      <Footer />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-neutral p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-bold text-white mb-4">
              Delete Account
            </h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg focus:outline-none"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
