const Footer = () => {
  return (
    <footer className="bg-neutral text-gray-400 py-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm text-center md:text-left">
          {/* Column 1: Features */}
          <div>
            <h3 className="text-white font-semibold mb-4">Features</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-primary">
                  Personalized Recommendations
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Advanced Filtering Options
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Trending Movies & Shows
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Cross-Platform Sync
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Seamless API Integrations
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-primary">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  API Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Support
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Credit
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-primary">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Press
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Stay Connected */}
          <div>
            <h3 className="text-white font-semibold mb-4">Stay Connected</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-primary">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8"></div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>&copy; 2024 RecoSphere. All rights reserved.</p>
          <p>
            <a href="#" className="hover:text-primary">
              Privacy Policy
            </a>{" "}
            |{" "}
            <a href="#" className="hover:text-primary">
              Terms of Service
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
