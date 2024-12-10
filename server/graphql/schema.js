/**
 * GraphQL Schema for User Authentication
 *
 * This file defines the GraphQL schema and resolvers for managing user authentication,
 * including user registration, login, and data retrieval. It integrates securely with
 * the MongoDB database to handle user credentials and authentication tokens.
 *
 * Key Features:
 * - **User Registration**: Allows new users to register by providing name, email, and password.
 *   Passwords are securely hashed using bcrypt before being stored in the database.
 * - **User Login**: Validates user credentials (email and password) and generates a JWT
 *   token for stateless authentication upon successful login.
 * - **JWT Token Generation**: Provides stateless authentication by issuing signed JWT tokens
 *   for both registration and login operations.
 * - **Data Retrieval**: Enables fetching all users or a specific user by ID, excluding sensitive
 *   fields like passwords for security purposes.
 *
 * Components:
 * - `typeDefs`: Defines GraphQL schema types, queries, and mutations for authentication.
 * - `resolvers`: Implements the logic for GraphQL operations, including validation and secure
 *   data handling.
 *
 * Dependencies:
 * - `apollo-server-express`: Integrates GraphQL with an Express server.
 * - `apollo-server-errors`: Handles error types and structured error responses.
 * - `bcrypt`: Hashes passwords securely for storage and performs comparison for authentication.
 * - `jsonwebtoken`: Signs and verifies JWT tokens for secure, stateless user sessions.
 * - `User`: Mongoose model for interacting with the MongoDB user collection.
 *
 * Queries:
 * - **`getAllUsers`**: Fetches all users from the database, excluding sensitive fields like passwords.
 * - **`getUserById`**: Fetches a specific user's profile by ID while excluding sensitive data.
 *
 * Mutations:
 * - **`registerUser`**: Registers a new user by validating input, hashing their password, storing
 *   the data in the database, and issuing a JWT token.
 * - **`loginUser`**: Authenticates a user by validating their credentials and issuing a JWT token.
 */

import { gql } from "apollo-server-express";
import { ApolloError } from "apollo-server-errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Query {
    getAllUsers: [User!]! # Fetch all users
    getUserById(id: ID!): User # Fetch a user by their ID
  }

  type Mutation {
    registerUser(input: RegisterInput!): AuthPayload!
    loginUser(input: LoginInput!): AuthPayload!
  }
`;

const resolvers = {
  Query: {
    // Resolver to fetch all users
    getAllUsers: async () => {
      try {
        const users = await User.find().select("-password"); // Exclude passwords
        return users;
      } catch (error) {
        console.error("Error fetching users:", error.message);
        throw new Error("Failed to fetch users.");
      }
    },

    // Resolver to fetch a user by ID
    getUserById: async (_, { id }) => {
      try {
        const user = await User.findById(id).select("-password"); // Exclude password
        if (!user) {
          throw new Error("User not found.");
        }
        return user;
      } catch (error) {
        throw new Error("User not found.");
      }
    },
  },

  Mutation: {
    // Resolver to handle user registration
    registerUser: async (_, { input }) => {
      const { name, email, password } = input;

      // Input validation
      if (!name || !email || !password) {
        throw new Error("All fields are required.");
      }

      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("Email already in use.");
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user in the database
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      // Generate a JWT token
      const token = jwt.sign(
        { id: newUser._id, email: newUser.email, name: newUser.name },
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
      );

      return {
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
      };
    },

    // Resolver to handle user login
    loginUser: async (_, { input }) => {
      const { email, password } = input;

      // Input validation
      if (!email || !password) {
        throw new ApolloError("All fields are required.", "BAD_USER_INPUT");
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new ApolloError(
          "Please provide a valid email address.",
          "BAD_USER_INPUT",
        );
      }

      // Check if the user exists (moved out of the try block)
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        throw new ApolloError(
          "User not found. Please sign up first.",
          "USER_NOT_FOUND",
        );
      }

      try {
        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(
          password,
          existingUser.password,
        );
        if (!isPasswordValid) {
          throw new ApolloError("Invalid email or password.", "UNAUTHORIZED");
        }

        // Generate a JWT token
        const token = jwt.sign(
          {
            id: existingUser._id,
            email: existingUser.email,
            name: existingUser.name,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1h" },
        );

        return {
          token,
          user: {
            id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
          },
        };
      } catch (error) {
        console.error("Error during login:", error.message);
        throw new ApolloError(
          "Failed to login. Please try again later.",
          "INTERNAL_SERVER_ERROR",
        );
      }
    },
  },
};

export { typeDefs, resolvers };
