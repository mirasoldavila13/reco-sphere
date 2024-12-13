/**
 * CTASection Component
 *
 * This component renders a visually appealing call-to-action (CTA) section designed to encourage users
 * to take the next step, such as signing up or engaging with the platform. It includes:
 *
 * - A responsive design using TailwindCSS to ensure it looks great on all screen sizes.
 * - A gradient background to draw attention to the section.
 * - Prominent call-to-action buttons with hover effects for better user engagement.
 *
 * Features:
 * - Eye-catching heading with highlighted text for emphasis.
 * - Supporting text to communicate the value proposition.
 * - "Sign Up" and "Get Started" buttons with links to registration and login routes respectively.
 *
 * Prerequisites:
 * - TailwindCSS must be set up for styling.
 * - DaisyUI is used for button styling.
 *
 * Usage:
 * - Place this component on the homepage or any relevant page to prompt user engagement.
 */

import { Link } from "react-router-dom";
const CTASection = () => {
  return (
    <section
      id="cta"
      className="hero py-20 bg-gradient-to-r from-red-500 via-red-400 to-red-500"
    >
      <div className="hero-content text-center text-white">
        <div className="max-w-lg mx-auto px-6">
          {/* Main heading with highlighted text */}
          <h2 className="text-4xl font-extrabold mb-6">
            Ready to <span className="text-accent">Discover</span>?
          </h2>

          {/* Supporting text */}
          <p className="text-lg mb-8 leading-relaxed">
            Sign up and unlock a world of personalized recommendations tailored
            just for you.
          </p>

          {/* Buttons for navigation */}
          <div className="flex justify-center space-x-4">
            {/* Link to Sign Up */}
            <Link
              to="/register"
              className="btn btn-primary btn-lg transition-transform transform hover:scale-110 hover:shadow-xl"
            >
              Sign Up
            </Link>

            {/* Link to Login */}
            <Link
              to="/login"
              className="btn btn-accent btn-lg transition-transform transform hover:scale-110 hover:shadow-xl"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
