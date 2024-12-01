import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../components/Navbar";

describe("Navbar Component", () => {
  beforeAll(() => {
    // Mock window size for tests
    global.innerWidth = 500; // Mobile screen size
    global.dispatchEvent(new Event("resize"));
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
    fireEvent.click(hamburgerButton);

    // Debug the DOM after the click
    screen.debug();

    const mobileMenu = screen.getByRole("list", { hidden: true });
    expect(mobileMenu).toBeInTheDocument();

    // Click the hamburger button again to close the menu
    fireEvent.click(hamburgerButton);

    expect(
      screen.queryByRole("list", { hidden: true }),
    ).not.toBeInTheDocument();
  });

  test("handles window resize to set isMobile state", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    // Simulate a window resize to a large screen
    global.innerWidth = 1024;
    global.dispatchEvent(new Event("resize"));

    // Mobile menu should not be open
    expect(
      screen.queryByRole("list", { hidden: true }),
    ).not.toBeInTheDocument();

    // Simulate a window resize to a small screen
    global.innerWidth = 500;
    global.dispatchEvent(new Event("resize"));

    // Hamburger button should now be present
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
