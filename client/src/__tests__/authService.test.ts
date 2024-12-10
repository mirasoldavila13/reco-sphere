import authService from "../services/authService";
import { jwtDecode } from "jwt-decode"; // Correct import

// Mock jwtDecode
jest.mock("jwt-decode", () => ({
  jwtDecode: jest.fn(),
}));

describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("handles registration errors gracefully", async () => {
    const mockErrorResponse = {
      errors: [{ message: "Registration failed" }],
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockErrorResponse),
      }),
    ) as jest.Mock;

    const userData = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    };

    await expect(authService.register(userData)).rejects.toThrow(
      "Registration failed",
    );
  });

  it("registers a user successfully", async () => {
    const mockResponse = {
      data: {
        registerUser: {
          token: "mockToken",
          user: { id: "123", name: "Test User", email: "test@example.com" },
        },
      },
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockResponse),
      }),
    ) as jest.Mock;

    const userData = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    };
    const result = await authService.register(userData);

    expect(result).toEqual(mockResponse.data.registerUser);
    expect(localStorage.getItem("jwtToken")).toBe("mockToken");
  });

  it("handles missing data field in the response", async () => {
    const mockErrorResponse = {};

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockErrorResponse),
      }),
    ) as jest.Mock;

    const userData = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    };

    await expect(authService.register(userData)).rejects.toThrow(
      "An unknown error occurred during registration.",
    );
  });

  it("logs and throws an unknown error during registration", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    global.fetch = jest.fn(() => Promise.reject("Network Error"));

    const userData = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    };

    await expect(authService.register(userData)).rejects.toThrow(
      "An unknown error occurred during registration.",
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      "[AuthService]: Unknown error during registration",
      "Network Error",
    );

    consoleSpy.mockRestore();
  });

  describe("login", () => {
    it("logs in successfully and sets the token", async () => {
      const mockResponse = {
        data: {
          loginUser: {
            token: "mockToken",
          },
        },
      };

      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockResponse),
        }),
      ) as jest.Mock;

      const result = await authService.login("test@example.com", "password123");
      expect(result.token).toBe("mockToken");
      expect(localStorage.getItem("jwtToken")).toBe("mockToken");
    });

    it("handles login errors gracefully", async () => {
      const mockErrorResponse = {
        errors: [{ message: "Login failed" }],
      };

      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockErrorResponse),
        }),
      ) as jest.Mock;

      await expect(
        authService.login("test@example.com", "wrongpassword"),
      ).rejects.toThrow("Login failed");
    });
    it("handles missing token in the login response", async () => {
      const mockResponse = {
        data: {
          loginUser: {},
        },
      };

      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockResponse),
        }),
      ) as jest.Mock;

      await expect(
        authService.login("test@example.com", "password123"),
      ).rejects.toThrow("An unknown error occurred during login.");
    });

    it("logs and throws an unknown error during login", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      global.fetch = jest.fn(
        () => Promise.reject("Network Error"), // Simulate a network-level error
      );

      const email = "test@example.com";
      const password = "password123";

      await expect(authService.login(email, password)).rejects.toThrow(
        "An unknown error occurred during login.",
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        "[AuthService]: Unknown error during login",
        "Network Error",
      );

      consoleSpy.mockRestore();
    });
  });

  describe("logout", () => {
    it("clears the token from localStorage", () => {
      localStorage.setItem("jwtToken", "mockToken");
      authService.logout();
      expect(localStorage.getItem("jwtToken")).toBeNull();
    });

    it("handles logout when no token is present", () => {
      authService.logout();
      expect(localStorage.getItem("jwtToken")).toBeNull(); // Ensure no errors occur
    });
  });

  describe("getProfile", () => {
    it("returns null if the token is missing or invalid", () => {
      expect(authService.getProfile()).toBeNull();
    });

    it("returns the user profile from a valid token", () => {
      const mockToken = "mockTokenWithPayload";
      const mockProfile = {
        id: "123",
        email: "test@example.com",
        name: "Test User",
      };

      (jwtDecode as jest.Mock).mockReturnValue(mockProfile);
      localStorage.setItem("jwtToken", mockToken);

      const profile = authService.getProfile();
      expect(profile).toEqual(mockProfile);
    });

    it("handles invalid token decoding gracefully", () => {
      (jwtDecode as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      const mockToken = "invalidToken";
      localStorage.setItem("jwtToken", mockToken);

      const profile = authService.getProfile();
      expect(profile).toBeNull();
    });
  });

  describe("isTokenExpired", () => {
    it("returns true for expired tokens", () => {
      (jwtDecode as jest.Mock).mockReturnValue({
        exp: Math.floor(Date.now() / 1000) - 10, // Expired token
      });

      expect(authService.isAuthenticated()).toBe(false);
    });

    it("returns false for expired tokens", () => {
      (jwtDecode as jest.Mock).mockReturnValue({
        exp: Math.floor(Date.now() / 1000) - 10,
      });

      expect(authService.isAuthenticated()).toBe(false);
    });

    it("returns true for valid tokens", () => {
      (jwtDecode as jest.Mock).mockReturnValue({
        exp: Math.floor(Date.now() / 1000) + 1000,
      });

      expect(authService.isAuthenticated()).toBe(true);
    });
  });

  describe("Error Handling", () => {
    it("logs error messages in development", () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      process.env.NODE_ENV = "development";

      authService["logError"]("Test error message");

      expect(consoleSpy).toHaveBeenCalledWith(
        "[AuthService]: Test error message",
        undefined,
      );

      process.env.NODE_ENV = "test"; // Reset environment
      consoleSpy.mockRestore();
    });

    it("does not log errors in production", () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      process.env.NODE_ENV = "production";

      authService["logError"]("Test error message");

      expect(consoleSpy).not.toHaveBeenCalled();

      process.env.NODE_ENV = "test"; // Reset environment
      consoleSpy.mockRestore();
    });
  });
});
