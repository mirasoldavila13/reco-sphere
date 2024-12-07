import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleResize = () => {
    if (window.innerWidth >= 768) {
      setMenuOpen(false);
      setIsMobile(false);
    } else {
      setIsMobile(true);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <header className="bg-neutral text-text fixed top-0 left-0 w-full z-50 shadow-md">
      <nav className="flex justify-between items-center py-4 px-4">
        {/* RecoSphere Logo Section*/}
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-3">
            {/* <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-6 h-6 text-white"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0 1 18 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0 1 18 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 0 1 6 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125"
                                />
                            </svg>
                        </div> */}
            <h1 className="text-2xl font-bold">
              <span className="text-primary">Reco</span>
              <span className="text-white">Sphere</span>
            </h1>
          </Link>
        </div>

        {/* Buttons for Desktop */}
        <div className="hidden md:flex space-x-4 ml-auto">
          <Link to="/login" className="btn btn-outline btn-accent">
            Login
          </Link>
          <Link to="/register" className="btn btn-primary">
            Sign Up
          </Link>
        </div>

        {/* Hamburger Button */}
        <button
          className="block md:hidden focus:outline-none ml-auto"
          onClick={toggleMenu}
        >
          <div className="flex flex-col items-center justify-center w-6 h-6 space-y-1">
            <span className="block w-full h-0.5 bg-white"></span>
            <span className="block w-full h-0.5 bg-white"></span>
            <span className="block w-full h-0.5 bg-white"></span>
          </div>
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && isMobile && (
        <div className="absolute top-16 left-0 w-full bg-neutral py-4">
          <ul
            role="list"
            className="flex flex-col items-center space-y-4 text-white"
          >
            <li>
              <Link to="/login" className="btn btn-outline hover:bg-primary">
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="btn btn-primary !text-white !hover:text-white bg-primary hover:bg-secondary"
              >
                Sign Up
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
