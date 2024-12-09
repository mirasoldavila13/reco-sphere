/**
 * GraphQL Schema for User Authentication
 *
 * This file defines the GraphQL schema and resolvers for user authentication, including
 * registering new users and managing authentication tokens.
 *
 * Key Features:
 * - User Registration: Allows users to register by providing name, email, and password.
 * - JWT Token Generation: Issues a JWT for stateless authentication after successful registration.
 * - Secure Password Storage: Hashes passwords using bcrypt before storing them in the database.
 * - Fetch User Data: Provides queries to retrieve all users or specific users by ID.
 *
 * Components:
 * - `typeDefs`: Defines the GraphQL types, inputs, queries, and mutations.
 * - `resolvers`: Implements the logic for the GraphQL operations, including database interactions.
 *
 * Dependencies:
 * - `apollo-server-express`: Provides GraphQL functionality and middleware for Express.
 * - `bcrypt`: For hashing passwords securely before saving them to the database.
 * - `jsonwebtoken`: For generating and verifying JWTs to enable secure authentication.
 * - `User`: Mongoose model for interacting with the MongoDB User collection.
 *
 * Queries:
 * - `getAllUsers`: Fetches all users in the database, excluding their passwords.
 * - `getUserById`: Fetches a specific user's profile by their ID, excluding the password.
 *
 * Mutations:
 * - `registerUser`: Registers a new user, hashes their password, and issues a JWT.
 */

import { gql } from "apollo-server-express";
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

  type Query {
    getAllUsers: [User!]! # Fetch all users
    getUserById(id: ID!): User # Fetch a user by their ID
  }

  type Mutation {
    registerUser(input: RegisterInput!): AuthPayload!
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
  },
};

export { typeDefs, resolvers };
