/**
 * Register Component
 *
 * This component facilitates user registration for the application, integrating with a GraphQL API
 * and backend services to securely create new user accounts. It performs client-side validation,
 * interacts with the backend, and handles user feedback effectively.
 *
 * Application Context:
 * - **GraphQL API**:
 *   - The application features a GraphQL API with a Node.js and Express.js server.
 *   - Supports queries and mutations for CRUD operations, including user registration.
 * - **Auth Controller**:
 *   - Handles user authentication and account management in `authController.js`.
 *   - Utilizes bcrypt for password hashing and JWT for stateless authentication.
 * - **Schema.js**:
 *   - Defines the GraphQL `registerUser` mutation for creating users and returning JWT tokens.
 * - **MongoDB with Mongoose**:
 *   - Manages user data, ensuring secure storage and validation of credentials.
 *
 * Key Features:
 * - **Form Validation**:
 *   - Verifies required fields (name, email, password, confirm password).
 *   - Ensures passwords match and enforces a minimum password length of 6 characters.
 *   - Validates email format with a regular expression.
 * - **GraphQL Integration**:
 *   - Sends a `registerUser` mutation to the GraphQL API with input fields: name, email, password.
 *   - Receives a JWT token upon successful registration and stores it locally.
 * - **Error Handling**:
 *   - Displays detailed error messages for invalid input or backend failures.
 *   - Prevents submission if validation fails.
 * - **User Feedback**:
 *   - Success and error messages are displayed in a modal for clarity.
 *   - Redirects the user to `/dashboard/:userId` on successful registration.
 * - **Responsive Design**:
 *   - Optimized for a variety of screen sizes using TailwindCSS and DaisyUI.
 * - **Future Extensibility**:
 *   - The form is designed to accommodate additional fields such as profile pictures, phone numbers,
 *     or email verification in the future.
 *
 * Workflow:
 * 1. User inputs their name, email, password, and confirm password.
 * 2. Client-side validation ensures the data meets all requirements.
 * 3. Data is sent to the backend using the `authService.register` function.
 * 4. On success, a JWT token is stored, and the user is redirected to their dashboard.
 * 5. On failure, appropriate error messages are displayed in a modal.
 *
 * Dependencies:
 * - **authService**: Handles backend interaction for user registration.
 * - **react-router-dom**: Manages navigation and route redirection.
 * - **Navbar and Footer**: Provides consistent page layout across the application.
 * - **TailwindCSS and DaisyUI**: Styles the form for a modern and responsive user interface.
 */

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [modalMessage, setModalMessage] = useState<string | null>(null);

  const handleCloseModal = () => {
    setModalMessage(null);
    if (modalMessage === "User registered successfully!") {
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
    const { name, email, password, confirmPassword } = formData;
    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setModalMessage("All fields are required.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setModalMessage("Please enter a valid email address.");
      return false;
    }
    if (password.length < 6) {
      setModalMessage("Password must be at least 6 characters long.");
      return false;
    }
    if (password !== confirmPassword) {
      setModalMessage("Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const { name, email, password } = formData;
      const result = await authService.register({ name, email, password });

      if (result.token) {
        localStorage.setItem("jwtToken", result.token);
        setModalMessage("User registered successfully!");
      } else {
        setModalMessage(
          result.message || "An error occurred during registration.",
        );
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setModalMessage(error.message || "An unexpected error occurred.");
      } else {
        setModalMessage("An unknown error occurred during registration.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full bg-gray-800 text-white p-8 rounded-lg shadow-lg mt-16 md:mt-24">
          <h2 className="text-3xl font-bold mb-6 text-center">Register</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="name">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="input input-bordered w-full"
              />
            </div>
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
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="input input-bordered w-full"
              />
            </div>
            <button type="submit" className="btn btn-primary w-full">
              Register
            </button>
          </form>
          <p className="text-center mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-primary">
              Log in
            </Link>
          </p>
        </div>
      </main>
      {modalMessage && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Registration Status</h3>
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

export default Register;
