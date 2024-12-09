/**
 * Register Component
 *
 * A user interface for creating an account. Validates user input, interacts with the authentication
 * service, and redirects the user to their dashboard upon successful registration.
 *
 * Features:
 * - **Form Validation**: Ensures all required fields are correctly filled.
 * - **API Integration**: Sends user data to the backend for registration.
 * - **Error Handling**: Displays detailed error messages for failed registration attempts.
 * - **Redirects**: Navigates the user to `/dashboard/:userId` after successful registration.
 *
 * Dependencies:
 * - `authService`: Handles registration logic and token storage.
 * - React Router's `Link` and `useNavigate` for navigation.
 * - TailwindCSS and DaisyUI for responsive and user-friendly design.
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
