import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../components/Navbar";
import authService from "../services/authService";

// Mock the authService methods
jest.mock("../services/authService", () => ({
  isAuthenticated: jest.fn(),
  getProfile: jest.fn(),
  logout: jest.fn(),
}));

describe("Navbar Component", () => {
  beforeAll(() => {
    // Simulate mobile screen size for some tests
    act(() => {
      global.innerWidth = 500;
      global.dispatchEvent(new Event("resize"));
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
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

  test("renders Login and Sign Up for unauthenticated users", () => {
    (authService.isAuthenticated as jest.Mock).mockReturnValue(false);

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    const loginButton = screen.getByRole("link", { name: /login/i });
    const signUpButton = screen.getByRole("link", { name: /sign up/i });
    expect(loginButton).toBeInTheDocument();
    expect(signUpButton).toBeInTheDocument();
  });

  test("renders Dashboard and Logout for authenticated users", () => {
    (authService.isAuthenticated as jest.Mock).mockReturnValue(true);
    (authService.getProfile as jest.Mock).mockReturnValue({ id: "123" });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    const dashboardButton = screen.getByRole("link", { name: /dashboard/i });
    const logoutButton = screen.getByRole("button", { name: /logout/i });
    expect(dashboardButton).toBeInTheDocument();
    expect(logoutButton).toBeInTheDocument();
  });

  test("toggles the mobile menu and renders correct options for unauthenticated users", () => {
    (authService.isAuthenticated as jest.Mock).mockReturnValue(false);

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    const hamburgerButton = screen.getByRole("button");
    act(() => {
      fireEvent.click(hamburgerButton);
    });

    const mobileMenu = screen.getByRole("list");
    expect(mobileMenu).toBeInTheDocument();

    const loginLinks = screen.getAllByRole("link", { name: /login/i });
    const signUpLink = screen.getByRole("link", { name: /sign up/i });
    expect(loginLinks.length).toBeGreaterThan(0);
    expect(signUpLink).toBeInTheDocument();
  });

  test("renders correctly based on authentication state", () => {
    // Case 1: When the user is authenticated
    (authService.isAuthenticated as jest.Mock).mockReturnValue(true);
    (authService.getProfile as jest.Mock).mockReturnValue({ id: "123" });

    const { rerender } = render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    // Expect authenticated user navigation options
    expect(
      screen.getByRole("link", { name: /dashboard/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /login/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /sign up/i }),
    ).not.toBeInTheDocument();

    // Case 2: When the user is NOT authenticated
    (authService.isAuthenticated as jest.Mock).mockReturnValue(false);

    rerender(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    // Expect unauthenticated user navigation options
    expect(screen.getByRole("link", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sign up/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /dashboard/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /logout/i }),
    ).not.toBeInTheDocument();
  });

  test("renders authenticated navigation options", () => {
    // Simulate an authenticated user
    (authService.isAuthenticated as jest.Mock).mockReturnValue(true);
    (authService.getProfile as jest.Mock).mockReturnValue({ id: "123" });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    // Check if the Dashboard link and Logout button are rendered
    const dashboardLink = screen.getByRole("link", { name: /dashboard/i });
    const logoutButton = screen.getByRole("button", { name: /logout/i });

    expect(dashboardLink).toBeInTheDocument();
    expect(dashboardLink).toHaveAttribute("href", "/dashboard/123"); // Verify correct dynamic URL
    expect(logoutButton).toBeInTheDocument();

    // Ensure Login and Sign Up are NOT rendered
    expect(
      screen.queryByRole("link", { name: /login/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /sign up/i }),
    ).not.toBeInTheDocument();
  });

  test("renders unauthenticated navigation options", () => {
    // Simulate an unauthenticated user
    (authService.isAuthenticated as jest.Mock).mockReturnValue(false);

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    // Check if the Login and Sign Up links are rendered
    const loginLink = screen.getByRole("link", { name: /login/i });
    const signUpLink = screen.getByRole("link", { name: /sign up/i });

    expect(loginLink).toBeInTheDocument();
    expect(signUpLink).toBeInTheDocument();

    // Ensure Dashboard and Logout are NOT rendered
    expect(
      screen.queryByRole("link", { name: /dashboard/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /logout/i }),
    ).not.toBeInTheDocument();
  });

  test("handles logout click and updates state", () => {
    (authService.isAuthenticated as jest.Mock).mockReturnValue(true);
    (authService.getProfile as jest.Mock).mockReturnValue({ id: "123" });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    const logoutButton = screen.getByRole("button", { name: /logout/i });
    act(() => {
      fireEvent.click(logoutButton);
    });

    expect(authService.logout).toHaveBeenCalled();
    expect(
      screen.queryByRole("button", { name: /logout/i }),
    ).not.toBeInTheDocument();
  });

  test("shows desktop navigation for large screens", () => {
    act(() => {
      global.innerWidth = 1024;
      global.dispatchEvent(new Event("resize"));
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    const loginButton = screen.getByRole("link", { name: /login/i });
    const signUpButton = screen.getByRole("link", { name: /sign up/i });
    expect(loginButton).toBeInTheDocument();
    expect(signUpButton).toBeInTheDocument();
  });

  test("handles window resize to toggle isMobile state", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    act(() => {
      global.innerWidth = 1024;
      global.dispatchEvent(new Event("resize"));
    });

    expect(screen.queryByRole("list")).not.toBeInTheDocument();

    act(() => {
      global.innerWidth = 500;
      global.dispatchEvent(new Event("resize"));
    });

    const hamburgerButton = screen.getByRole("button");
    expect(hamburgerButton).toBeInTheDocument();
  });

  test("handles null profile for authenticated user", () => {
    (authService.isAuthenticated as jest.Mock).mockReturnValue(true);
    (authService.getProfile as jest.Mock).mockReturnValue(null);

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    const dashboardLink = screen.queryByRole("link", { name: /dashboard/i });
    expect(dashboardLink).not.toBeInTheDocument();
  });
});
