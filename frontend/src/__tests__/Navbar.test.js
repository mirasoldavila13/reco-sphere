import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../components/Navbar";
describe("Navbar Component", () => {
  test("renders the Navbar heading", () => {
    render(_jsx(MemoryRouter, { children: _jsx(Navbar, {}) }));
    const heading = screen.getByRole("heading", { name: /Reco Sphere/i });
    expect(heading).toBeInTheDocument();
  });
  test("toggles the mobile menu", () => {
    render(_jsx(MemoryRouter, { children: _jsx(Navbar, {}) }));
    const hamburgerButton = screen.getByRole("button", { name: "" });
    expect(hamburgerButton).toBeInTheDocument();
    // Mobile menu container should not be visible initially
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    // Click the hamburger button to open the menu
    fireEvent.click(hamburgerButton);
    expect(screen.getByRole("list")).toBeInTheDocument();
    // Click the hamburger button again to close the menu
    fireEvent.click(hamburgerButton);
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });
  test("handles window resize to set isMobile state", () => {
    render(_jsx(MemoryRouter, { children: _jsx(Navbar, {}) }));
    // Simulate a window resize to a large screen
    global.innerWidth = 1024;
    global.dispatchEvent(new Event("resize"));
    // Mobile menu should not be open
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    // Simulate a window resize to a small screen
    global.innerWidth = 500;
    global.dispatchEvent(new Event("resize"));
    // Hamburger button should now be present
    expect(screen.getByRole("button", { name: "" })).toBeInTheDocument();
  });
  test("renders desktop navigation links", () => {
    render(_jsx(MemoryRouter, { children: _jsx(Navbar, {}) }));
    // Desktop navigation links should be visible
    const loginButton = screen.getByRole("link", { name: /login/i });
    const signUpButton = screen.getByRole("link", { name: /sign up/i });
    expect(loginButton).toBeInTheDocument();
    expect(signUpButton).toBeInTheDocument();
  });
});
