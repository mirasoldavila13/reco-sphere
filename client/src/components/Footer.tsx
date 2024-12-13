/**
 * Footer Component
 *
 * The `Footer` component serves as a centralized area for navigational links and general platform
 * information. It is divided into multiple sections to ensure users can easily access relevant
 * resources, learn about the company, and stay connected through social media.
 *
 * Key Features:
 * - **Navigational Links**:
 *   - Organized into four sections: Features, Resources, Company, and Stay Connected.
 *   - Links use React Router's `Link` component for seamless client-side navigation.
 * - **Responsive Grid Design**:
 *   - Adapts to various screen sizes using TailwindCSS's grid layout.
 *   - Ensures optimal usability on mobile, tablet, and desktop devices.
 * - **Semantic HTML**:
 *   - Enhances accessibility by using semantic tags (`nav`, `section`, `h3`) and `aria-labelledby` attributes.
 * - **Consistent Styling**:
 *   - Matches the platform's theme with a neutral background and hover effects for interactivity.
 * - **Footer Bottom Section**:
 *   - Displays copyright information and links to Privacy Policy and Terms of Service.
 *
 * Design Considerations:
 * - **Scalability**:
 *   - New sections or links can be added easily by extending the current structure.
 * - **Accessibility**:
 *   - Utilizes semantic elements and meaningful link descriptions for screen readers.
 * - **Responsive Design**:
 *   - TailwindCSS's utility classes ensure the layout adjusts seamlessly across devices.
 *
 * Dependencies:
 * - `react-router-dom`: Provides the `Link` component for navigation.
 * - `TailwindCSS`: Offers utility classes for styling and responsiveness.
 *
 * Props:
 * - None (currently self-contained and static).
 */

import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-neutral text-gray-400 py-10">
      <div className="container mx-auto px-6">
        {/* Footer Grid */}
        <section
          className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm text-center md:text-left"
          aria-labelledby="footer-navigation"
        >
          {/* Column 1: Features */}
          <nav aria-labelledby="footer-features">
            <h3 id="footer-features" className="text-white font-semibold mb-4">
              Features
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/coming-soon" className="hover:text-primary">
                  Personalized Recommendations
                </Link>
              </li>
              <li>
                <Link to="/coming-soon" className="hover:text-primary">
                  Advanced Filtering Options
                </Link>
              </li>
              <li>
                <Link to="/coming-soon" className="hover:text-primary">
                  Trending Movies & Shows
                </Link>
              </li>
              <li>
                <Link to="/coming-soon" className="hover:text-primary">
                  Cross-Platform Sync
                </Link>
              </li>
              <li>
                <Link to="/coming-soon" className="hover:text-primary">
                  Seamless API Integrations
                </Link>
              </li>
            </ul>
          </nav>

          {/* Column 2: Resources */}
          <nav aria-labelledby="footer-resources">
            <h3 id="footer-resources" className="text-white font-semibold mb-4">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/coming-soon" className="hover:text-primary">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/coming-soon" className="hover:text-primary">
                  API Documentation
                </Link>
              </li>
              <li>
                <Link to="/coming-soon" className="hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/coming-soon" className="hover:text-primary">
                  Support
                </Link>
              </li>
              <li>
                <Link to="/credit" className="hover:text-primary">
                  Credit
                </Link>
              </li>
            </ul>
          </nav>

          {/* Column 3: Company */}
          <nav aria-labelledby="footer-company">
            <h3 id="footer-company" className="text-white font-semibold mb-4">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/coming-soon" className="hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/coming-soon" className="hover:text-primary">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/coming-soon" className="hover:text-primary">
                  Press
                </Link>
              </li>
              <li>
                <Link to="/coming-soon" className="hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          {/* Column 4: Stay Connected */}
          <section aria-labelledby="footer-social">
            <h3 id="footer-social" className="text-white font-semibold mb-4">
              Stay Connected
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/coming-soon" className="hover:text-primary">
                  Facebook
                </Link>
              </li>
              <li>
                <Link to="/coming-soon" className="hover:text-primary">
                  Twitter
                </Link>
              </li>
              <li>
                <Link to="/coming-soon" className="hover:text-primary">
                  Instagram
                </Link>
              </li>
              <li>
                <Link to="/coming-soon" className="hover:text-primary">
                  LinkedIn
                </Link>
              </li>
            </ul>
          </section>
        </section>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-8"></div>

        {/* Footer Bottom Section */}
        <section className="mt-6 text-center text-sm text-gray-500">
          <p>&copy; 2024 RecoSphere. All rights reserved.</p>
          <p>
            <Link to="#" className="hover:text-primary">
              Privacy Policy
            </Link>{" "}
            |{" "}
            <Link to="#" className="hover:text-primary">
              Terms of Service
            </Link>
          </p>
        </section>
      </div>
    </footer>
  );
};

export default Footer;
