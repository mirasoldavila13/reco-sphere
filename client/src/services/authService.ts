/**
 * AuthService
 *
 * A comprehensive client-side service for managing user authentication and account-related
 * operations, built to integrate seamlessly with a GraphQL API and backend services.
 *
 * Application Context:
 * - **GraphQL API**:
 *   - The application features a GraphQL API built with Node.js and Express.js.
 *   - Supports mutations for operations such as user registration, login, and profile updates.
 * - **Backend Services**:
 *   - Works with the `authController.js` for handling authentication and user management.
 *   - Leverages bcrypt for secure password hashing and JWT for token-based authentication.
 *   - Mongoose models manage user data within MongoDB.
 * - **Integration with Frontend**:
 *   - Provides utility functions for user authentication, token management, and profile handling.
 *   - Simplifies interaction between frontend components and backend endpoints.
 *
 * Key Features:
 * - **Registration**:
 *   - Sends user details (name, email, password) via GraphQL mutation.
 *   - Receives a JWT token and stores it in `localStorage`.
 * - **Login**:
 *   - Authenticates user credentials via GraphQL mutation.
 *   - Stores the returned JWT token for session management.
 * - **Profile Management**:
 *   - Decodes the JWT token to extract user details (ID, email, name, preferences).
 *   - Updates the user profile via the `updateUser` GraphQL mutation.
 * - **Account Deletion**:
 *   - Deletes user accounts by sending a request to the backend REST API.
 * - **Token Management**:
 *   - Securely stores and retrieves the JWT token from `localStorage`.
 *   - Validates token expiration and ensures session integrity.
 * - **Error Handling**:
 *   - Comprehensive error logging for both GraphQL and REST API interactions.
 *   - Displays detailed error messages for user-facing issues.
 * - **Logout**:
 *   - Clears the JWT token from `localStorage` to log the user out.
 * - **Security**:
 *   - Implements stateless authentication with JWT.
 *   - Verifies token validity and expiry before granting access to secure operations.
 * - **Extensibility**:
 *   - Designed to accommodate additional fields (e.g., profile pictures, phone numbers) in user registration.
 *
 * Design Considerations:
 * - **Scalability**:
 *   - Stateless design allows seamless scalability across distributed systems.
 * - **Performance**:
 *   - Efficient token decoding and validation.
 *   - Reduced network overhead with consolidated GraphQL requests.
 * - **Developer Experience**:
 *   - Centralized error logging simplifies debugging.
 *   - Intuitive API for frontend developers to manage authentication.
 *
 * Functions:
 * - **Core Operations**:
 *   - `register`: Registers a new user and stores the JWT token.
 *   - `login`: Authenticates a user and stores the JWT token.
 *   - `getProfile`: Decodes and returns the user profile from the JWT token.
 *   - `updateProfile`: Updates user details using the GraphQL `updateUser` mutation.
 *   - `deleteProfile`: Deletes a user account using a REST API endpoint.
 * - **Token Management**:
 *   - `getToken`: Retrieves the JWT token from `localStorage`.
 *   - `setToken`: Stores the JWT token in `localStorage`.
 *   - `isTokenExpired`: Validates if the token is expired.
 * - **Session Handling**:
 *   - `logout`: Clears the stored JWT token.
 *   - `isAuthenticated`: Checks if the user is logged in by validating the token.
 *
 * Dependencies:
 * - **GraphQL**:
 *   - Uses GraphQL mutations for core operations (`registerUser`, `loginUser`, `updateUser`).
 * - **jwt-decode**:
 *   - Decodes JWT tokens to extract user data and validate token expiration.
 * - **REST API**:
 *   - Integrates with REST endpoints for account deletion and other specific operations.
 *
 * Usage:
 * 1. Import `AuthService` into frontend components for authentication-related operations.
 * 2. Call methods like `register`, `login`, `getProfile`, or `updateProfile` as needed.
 * 3. Utilize `isAuthenticated` to conditionally render protected routes or components.
 */

import { JwtPayload, jwtDecode } from "jwt-decode";

declare module "jwt-decode" {
  export interface JwtPayload {
    id: string;
    email: string;
    name: string;
    exp?: number;
    preferences?: string[];
  }
}

interface UserData {
  name: string;
  email: string;
  password: string;
}

class AuthService {
  async deleteProfile(userId: string): Promise<{ message: string }> {
    const response = await fetch("/api/auth/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getAuthToken()}`,
      },
      body: JSON.stringify({ id: userId }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to delete account.");
    }

    return result;
  }

  async updateProfile(updatedData: {
    name?: string;
    preferences?: string[];
  }): Promise<void> {
    try {
      const token = this.getAuthToken();
      if (!token) throw new Error("User is not authenticated."); // Handle missing token

      const response = await fetch("/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Set token in Authorization header
        },
        body: JSON.stringify({
          query: `
            mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
              updateUser(id: $id, input: $input) {
                id
                name
                email
                preferences
              }
            }
          `,
          variables: {
            id: this.getProfile()?.id,
            input: updatedData,
          },
        }),
      });

      const result = await response.json();

      if (!response.ok || result.errors) {
        const errorMessage =
          result.errors?.[0]?.message || "Failed to update profile.";
        throw new Error(errorMessage);
      }

      if (!result.data || !result.data.updateUser) {
        throw new Error("Invalid response structure from the server.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logError("Error updating profile", { message: error.message });
        throw new Error(error.message);
      }
      this.logError("Unknown error updating profile", error);
      throw new Error("An unknown error occurred during profile update.");
    }
  }

  async register(userData: UserData): Promise<{
    token: string;
    user: { id: string; name: string; email: string };
    message?: string;
  }> {
    try {
      // GraphQL endpoint is universal and can handle all requests, including registration.
      const response = await fetch("/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            mutation RegisterUser($input: RegisterInput!) {
              registerUser(input: $input) {
                token
                user {
                  id
                  name
                  email
                }
              }
            }
          `,
          variables: { input: userData },
        }),
      });

      const result = await response.json();

      // Handle missing or invalid response structure
      if (!result || !result.data || !result.data.registerUser) {
        throw new Error("An unknown error occurred during registration.");
      }

      const { token, user } = result.data.registerUser;
      this.setToken(token);
      return { token, user };
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logError("Error during registration", error.message);
        throw new Error(
          error.message || "An error occurred during registration.",
        );
      }
      this.logError("Unknown error during registration", error);
      throw new Error("An unknown error occurred during registration.");
    }
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ token: string; message?: string }> {
    try {
      const response = await fetch("/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            mutation LoginUser($input: LoginInput!) {
              loginUser(input: $input) {
                token
                user {
                  id
                  name
                  email
                }
              }
            }
          `,
          variables: { input: { email, password } },
        }),
      });

      const result = await response.json();

      if (!response.ok || result.errors) {
        const errorMessage = result.errors?.[0]?.message || "Failed to login.";
        throw new Error(errorMessage);
      }

      if (
        !result.data ||
        !result.data.loginUser ||
        !result.data.loginUser.token
      ) {
        throw new Error("Invalid server response. Please try again.");
      }

      const { token } = result.data.loginUser;
      this.setToken(token);
      return { token };
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logError("Error during login", error.message);
        throw new Error(error.message);
      }
      this.logError("Unknown error during login", error);
      throw new Error("An unknown error occurred during login.");
    }
  }

  getProfile(): JwtPayload | null {
    const token = this.getToken();
    if (token) {
      try {
        return jwtDecode<JwtPayload>(token); // Decode and return the user profile
      } catch (error) {
        this.logError("Error decoding profile", error);
        return null;
      }
    }
    return null; // Return null if token is missing
  }

  logout(): void {
    localStorage.removeItem("jwtToken"); // Clear token on logout
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && !this.isTokenExpired(token);
  }

  private getToken(): string | null {
    return localStorage.getItem("jwtToken") || null;
  }

  getAuthToken(): string | null {
    return this.getToken(); // Safely return the private token
  }

  private setToken(token: string): void {
    localStorage.setItem("jwtToken", token);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decoded: JwtPayload = jwtDecode<JwtPayload>(token);
      return decoded.exp ? Date.now() >= decoded.exp * 1000 : true;
    } catch {
      return true;
    }
  }

  private logError(message: string, details?: unknown): void {
    if (process.env.NODE_ENV === "development") {
      console.error(`[AuthService]: ${message}`, details);
    }
  }
}

export default new AuthService();
