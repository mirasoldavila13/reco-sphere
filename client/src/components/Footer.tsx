/**
 * Footer Component
 *
 * The `Footer` component provides navigational links and useful information about the platform,
 * divided into four main sections:
 * 1. **Features**: Highlights core platform functionalities.
 * 2. **Resources**: Links to helpful documentation and guides.
 * 3. **Company**: Provides company-related information like About Us and Careers.
 * 4. **Stay Connected**: Links to the company's social media platforms.
 *
 * Features:
 * - **Responsive Design**: Adapts to different screen sizes with a grid layout.
 * - **Semantic Markup**: Uses semantic HTML tags for accessibility and better structure.
 * - **Dynamic Links**: Employs React Router's `Link` component for navigation.
 * - **Modern UI**: Styled using TailwindCSS for consistency with the platform's theme.
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
                <Link to="#" className="hover:text-primary">
                  Personalized Recommendations
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary">
                  Advanced Filtering Options
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary">
                  Trending Movies & Shows
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary">
                  Cross-Platform Sync
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary">
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
                <Link to="#" className="hover:text-primary">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary">
                  API Documentation
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary">
                  Support
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary">
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
                <Link to="#" className="hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary">
                  Press
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary">
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
                <Link to="#" className="hover:text-primary">
                  Facebook
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary">
                  Twitter
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary">
                  Instagram
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary">
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
