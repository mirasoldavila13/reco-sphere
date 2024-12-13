/**
 * Login Component
 *
 * The `Login` component is designed to provide a user-friendly and secure interface for users
 * to authenticate themselves into the RecoSphere platform. This component includes robust validation,
 * error handling, and user feedback mechanisms to ensure a seamless login experience.
 *
 * ============================
 * **Key Features**
 * ============================
 * 1. **Form Validation**:
 *    - Validates email and password fields for completeness and proper email format.
 *    - Automatically focuses on invalid fields to guide the user.
 *
 * 2. **Error Handling**:
 *    - Displays contextual error messages for:
 *      - Invalid credentials.
 *      - Missing or improperly formatted input.
 *      - Unexpected server errors.
 *    - Gracefully handles scenarios such as server unavailability.
 *
 * 3. **Login Throttling**:
 *    - Restricts login attempts after 5 consecutive failures.
 *    - Implements a 30-second cooldown before re-enabling login attempts.
 *
 * 4. **Loading State**:
 *    - Provides visual feedback during the authentication process using a spinner icon.
 *
 * 5. **Modal Notifications**:
 *    - Displays success or error messages in a modal dialog for better user feedback.
 *
 * 6. **JWT Authentication**:
 *    - Relies on `authService` to securely handle login requests and store tokens.
 *
 * ============================
 * **Dependencies**
 * ============================
 * - **authService**: Centralized authentication service for login requests and token handling.
 * - **react-router-dom**: Used for seamless navigation to the dashboard after successful login.
 * - **Navbar** and **Footer**: Reusable components to maintain consistent UI design.
 *
 * ============================
 * **Component Behavior**
 * ============================
 * - Validates the user’s input on form submission.
 * - Prevents further actions during ongoing login attempts (`isLoading` state).
 * - Redirects authenticated users to their personalized dashboard.
 * - Locks login functionality after excessive failed attempts to deter brute-force attacks.
 *
 * ============================
 * **Design Principles**
 * ============================
 * - **Accessibility**:
 *   - Focuses on invalid fields for better guidance.
 *   - Uses descriptive labels and placeholders for inputs.
 * - **Security**:
 *   - Manages authentication securely via `authService`.
 *   - Avoids exposing sensitive data in error messages.
 * - **User Experience**:
 *   - Provides clear feedback at every step of the login process.
 *   - Incorporates retry limits and error messages to inform users of issues.
 *
 * ============================
 * **Usage Example**
 * ============================
 * ```tsx
 * import Login from "./Login";
 *
 * const App = () => {
 *   return <Login />;
 * };
 *
 * export default App;
 * ```
 *
 * ============================
 * **Future Enhancements**
 * ============================
 * 1. **Remember Me**:
 *    - Allow users to stay logged in by persisting tokens securely.
 * 2. **Social Login**:
 *    - Integrate third-party authentication options (e.g., Google, Facebook).
 * 3. **Forgot Password**:
 *    - Add a flow to reset forgotten passwords.
 * 4. **Captcha**:
 *    - Include CAPTCHA to deter automated login attempts.
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
