/**
 * Login Component
 *
 * This component provides a user interface for logging into the application. It allows users
 * to enter their email and password, validates the input, and interacts with the authentication
 * service to authenticate the user. The component also handles error messages and loading states
 * for a seamless user experience.
 *
 * Key Features:
 * - **Form Validation**: Ensures that both email and password fields are completed, and validates the email format.
 * - **Error Handling**: Displays clear error messages for invalid credentials, missing fields, or unexpected errors.
 * - **Throttling Login Attempts**: Locks the form after 5 failed login attempts and enforces a 30-second cooldown.
 * - **Loading Indicator**: Provides visual feedback during the login process with a spinner icon.
 * - **Modal Notifications**: Displays success or error messages in a modal after form submission.
 * - **JWT Authentication**: Relies on the `authService` to handle authentication and token storage.
 *
 * Design Considerations:
 * - **Accessibility**: Automatically focuses on fields with errors for better user experience.
 * - **Security**: Uses `authService` to handle tokens securely, avoiding exposure of sensitive information in the UI.
 * - **Scalability**: Provides a structure for adding more features like "Remember Me" or "Forgot Password".
 *
 * Dependencies:
 * - `authService`: Handles login requests and JWT token management.
 * - `react-router-dom`: Used for navigation after successful login.
 * - `Navbar` and `Footer`: Reusable components for consistent page layout.
 */

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCloseModal = () => {
    setModalMessage(null);
    if (modalMessage === "Login successful!") {
      const userProfile = authService.getProfile();
      if (userProfile) {
        navigate(`/dashboard/${userProfile.id}`);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = (): boolean => {
    const { email, password } = formData;

    if (!email.trim()) {
      setModalMessage("Email is required.");
      document.getElementById("email")?.focus();
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setModalMessage("Please enter a valid email address.");
      document.getElementById("email")?.focus();
      return false;
    }

    if (!password.trim()) {
      setModalMessage("Password is required.");
      document.getElementById("password")?.focus();
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (retryCount >= 5) {
      setModalMessage(
        "Too many failed attempts. Please try again in 30 seconds.",
      );
      setIsLocked(true);
      setTimeout(() => {
        setRetryCount(0);
        setIsLocked(false);
      }, 30000);
      return;
    }

    try {
      setIsLoading(true);
      const { email, password } = formData;
      const result = await authService.login(email, password);

      if (result.token) {
        setModalMessage("Login successful!");
        setRetryCount(0); // Reset retry count on success
      }
    } catch (error: unknown) {
      setRetryCount((prev) => prev + 1);
      if (error instanceof Error) {
        if (error.message.includes("User not found")) {
          setModalMessage(
            "No account found with this email. Please sign up for an account.",
          );
        } else if (error.message.includes("Invalid email or password")) {
          setModalMessage("Invalid email or password.");
        } else {
          setModalMessage(error.message || "An unexpected error occurred.");
        }
      } else {
        setModalMessage("An unknown error occurred during login.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full bg-gray-800 text-white p-8 rounded-lg shadow-lg mt-16 md:mt-24">
          <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="input input-bordered w-full"
              />
            </div>
            <button
              type="submit"
              className={`btn btn-primary w-full flex items-center justify-center ${
                isLocked || isLoading ? "btn-disabled" : ""
              }`}
              disabled={isLocked || isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 100 8v4a8 8 0 01-8-8z"
                    ></path>
                  </svg>
                  <span>Logging in...</span>
                </div>
              ) : (
                <span>Login</span>
              )}
            </button>
          </form>
          <p className="text-center mt-4">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary">
              Sign up
            </Link>
          </p>
        </div>
      </main>
      {modalMessage && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Login Status</h3>
            <p data-testid="modal-message">{modalMessage}</p>
            <div className="modal-action">
              <button onClick={handleCloseModal} className="btn">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Login;
