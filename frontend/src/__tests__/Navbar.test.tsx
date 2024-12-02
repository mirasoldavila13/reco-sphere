import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../components/Navbar";

describe("Navbar Component", () => {
  beforeAll(() => {
    // Ensure a mobile screen size for initial tests
    act(() => {
      global.innerWidth = 500; // Simulate mobile screen
      global.dispatchEvent(new Event("resize"));
    });
  });

  test("renders the Navbar heading", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    const heading = screen.getByRole("heading", { name: /Reco Sphere/i });
    expect(heading).toBeInTheDocument();
  });

  test("toggles the mobile menu", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    const hamburgerButton = screen.getByRole("button");
    expect(hamburgerButton).toBeInTheDocument();

    // Mobile menu container should not be visible initially
    expect(screen.queryByRole("list")).not.toBeInTheDocument();

    // Click the hamburger button to open the menu
    act(() => {
      fireEvent.click(hamburgerButton);
    });

    const mobileMenu = screen.getByRole("list");
    expect(mobileMenu).toBeInTheDocument();

    // Click the hamburger button again to close the menu
    act(() => {
      fireEvent.click(hamburgerButton);
    });

    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  test("handles window resize to set isMobile state", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    // Simulate a window resize to a large screen
    act(() => {
      global.innerWidth = 1024; // Simulate desktop screen
      global.dispatchEvent(new Event("resize"));
    });

    // Menu should not be visible on a large screen
    expect(screen.queryByRole("list")).not.toBeInTheDocument();

    // Simulate a window resize to a small screen
    act(() => {
      global.innerWidth = 500; // Simulate mobile screen
      global.dispatchEvent(new Event("resize"));
    });

    // Hamburger button should be present
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  test("renders desktop navigation links", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    // Desktop navigation links should be visible
    const loginButton = screen.getByRole("link", { name: /login/i });
    const signUpButton = screen.getByRole("link", { name: /sign up/i });
    expect(loginButton).toBeInTheDocument();
    expect(signUpButton).toBeInTheDocument();
  });
});
