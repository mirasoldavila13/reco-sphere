/**
 * AuthService
 *
 * A client-side service for handling authentication operations such as registration, login,
 * token management, and user profile retrieval using GraphQL.
 *
 * Features:
 * - **Registration**: Sends user details via GraphQL mutation and retrieves a JWT upon success.
 * - **Login**: Authenticates a user with their credentials using a GraphQL mutation and stores the returned JWT.
 * - **Token Management**: Handles secure storage, retrieval, and validation of the JWT token in localStorage.
 * - **Profile Retrieval**: Decodes the JWT token to extract the user's profile information, such as ID, email, and name.
 * - **Logout**: Clears the token from localStorage and updates the authentication state.
 *
 * Design Considerations:
 * - Stateless authentication using JWT to ensure scalability and security.
 * - Integration with a single `/graphql` endpoint to handle all operations.
 * - Comprehensive error handling for backend and client-side validation.
 * - Ensures secure password handling with backend validation and hashing.
 *
 * Dependencies:
 * - `jwt-decode`: Decodes JWT tokens for extracting user information.
 */

import { JwtPayload, jwtDecode } from "jwt-decode";

declare module "jwt-decode" {
  export interface JwtPayload {
    id: string;
    email: string;
    name: string;
    exp?: number;
  }
}

interface UserData {
  name: string;
  email: string;
  password: string;
}

class AuthService {
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
          error.message || "An error occurred during registration."
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
            mutation LoginUser($email: String!, $password: String!) {
              loginUser(email: $email, password: $password) {
                token
              }
            }
          `,
          variables: { email, password },
        }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message || "Login failed");
      }

      const { token } = result.data.loginUser;
      this.setToken(token);
      return { token };
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logError("Error during login", error.message);
        throw new Error(error.message || "An error occurred during login.");
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
