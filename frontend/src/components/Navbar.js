import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
  return _jsxs("header", {
    className: "bg-neutral text-text fixed top-0 left-0 w-full z-50 shadow-md",
    children: [
      _jsxs("nav", {
        className: "flex justify-between items-center py-4 px-4",
        children: [
          _jsx("div", {
            className: "flex items-center",
            children: _jsx(Link, {
              to: "/",
              className: "flex items-center space-x-3",
              children: _jsxs("h1", {
                className: "text-2xl font-bold",
                children: [
                  _jsx("span", { className: "text-primary", children: "Reco" }),
                  _jsx("span", { className: "text-white", children: "Sphere" }),
                ],
              }),
            }),
          }),
          _jsxs("div", {
            className: "hidden md:flex space-x-4 ml-auto",
            children: [
              _jsx(Link, {
                to: "/login",
                className: "btn btn-outline hover:bg-primary",
                children: "Login",
              }),
              _jsx(Link, {
                to: "/register",
                className: "btn btn-primary hover:bg-secondary",
                children: "Sign Up",
              }),
            ],
          }),
          _jsx("button", {
            className: "block md:hidden focus:outline-none ml-auto",
            onClick: toggleMenu,
            children: _jsxs("div", {
              className:
                "flex flex-col items-center justify-center w-6 h-6 space-y-1",
              children: [
                _jsx("span", { className: "block w-full h-0.5 bg-white" }),
                _jsx("span", { className: "block w-full h-0.5 bg-white" }),
                _jsx("span", { className: "block w-full h-0.5 bg-white" }),
              ],
            }),
          }),
        ],
      }),
      menuOpen &&
        isMobile &&
        _jsx("div", {
          className: "absolute top-16 left-0 w-full bg-neutral py-4",
          children: _jsxs("ul", {
            className: "flex flex-col items-center space-y-4 text-white",
            children: [
              _jsx("li", {
                children: _jsx(Link, {
                  to: "/login",
                  className: "btn btn-outline hover:bg-primary",
                  children: "Login",
                }),
              }),
              _jsx("li", {
                children: _jsx(Link, {
                  to: "/register",
                  className:
                    "btn btn-primary !text-white !hover:text-white bg-primary hover:bg-secondary",
                  children: "Sign Up",
                }),
              }),
            ],
          }),
        }),
    ],
  });
};
export default Navbar;
