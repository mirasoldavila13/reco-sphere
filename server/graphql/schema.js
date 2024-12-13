/**
 * GraphQL Schema for User Management and Content Operations
 *
 * This module defines a comprehensive GraphQL schema and resolvers for managing
 * users, content, favorites, recommendations, and user authentication. It is
 * designed to support dynamic, secure, and efficient CRUD operations for a robust platform.
 *
 * Key Features:
 * - **User Management**: Facilitates user registration, login, and profile updates
 *   with secure password hashing, sensitive data protection, and preferences support.
 * - **Favorites Management**: Allows users to manage their favorite content, enabling
 *   addition, updating, retrieval, and deletion of favorites tied to specific user data.
 * - **Content Management**: Provides a dynamic catalog with CRUD operations, supporting
 *   filters by genre, rating, and metadata for flexible content discovery.
 * - **Recommendations**: Enables linking content recommendations to users, including
 *   detailed rationale for each suggestion to personalize the user experience.
 * - **Authentication**: Ensures secure access using JWT-based stateless authentication
 *   for both queries and mutations requiring authorization.
 *
 * Components:
 * - **Schema (`typeDefs`)**: Defines GraphQL types, queries, and mutations to standardize
 *   and organize the API structure.
 * - **Resolvers**: Implements the backend logic for executing GraphQL queries and mutations,
 *   ensuring the business rules are enforced and data is retrieved or manipulated correctly.
 * - **Authentication Middleware**: Verifies JWT tokens for stateless access control,
 *   enforcing authentication and authorization policies at the resolver level.
 *
 * Technologies and Dependencies:
 * - `apollo-server-express`: Integrates GraphQL server with Express.js for efficient request handling.
 * - `apollo-server-errors`: Provides structured and developer-friendly error messages compatible
 *   with GraphQL specifications.
 * - `bcrypt`: Ensures robust password hashing and comparison for secure authentication workflows.
 * - `jsonwebtoken (JWT)`: Manages stateless authentication, including token issuance and validation.
 * - **MongoDB with Mongoose**: Facilitates efficient data storage and querying using
 *   schemas for users, content, favorites, and recommendations.
 *
 * Schema Overview:
 * - **User**: Represents a user entity with fields for ID, email, hashed password,
 *   preferences, and activity history.
 * - **Favorite**: Tracks user-specific favorite content, including TMDB identifiers,
 *   media types (e.g., movies, TV), and timestamps for auditing changes.
 * - **Content**: Represents items in a content catalog, with fields for title, genre,
 *   rating, and metadata.
 * - **Recommendation**: Connects content items to users with rationales for personalized
 *   recommendations.
 * - **Authentication**: Issues JWTs upon successful registration or login, ensuring secure
 *   user sessions.
 *
 * Queries:
 * - `getAllUsers`: Lists all users, excluding sensitive data like passwords.
 * - `getUserById`: Retrieves a specific user's profile by ID.
 * - `getFavorites`: Fetches the authenticated user's list of favorite items.
 * - `getContent`: Retrieves content items filtered by attributes such as genre or rating.
 * - `getRecommendations`: Fetches personalized recommendations for a user.
 *
 * Mutations:
 * - **User Management**:
 *   - `registerUser`: Registers a new user, hashes their password securely, and issues a JWT.
 *   - `loginUser`: Validates user credentials, issues a JWT, and returns user details.
 *   - `createUser`: Creates a user entity (intended for admin or automated workflows).
 *   - `updateUser`: Modifies user profile fields, including name, preferences, or password.
 *   - `deleteUser`: Permanently removes a user and their data from the system.
 * - **Favorites Management**:
 *   - `addFavorite`: Adds a content item to the user's favorites.
 *   - `updateFavorite`: Updates metadata or attributes of an existing favorite.
 *   - `removeFavorite`: Deletes a specific favorite from the user's collection.
 * - **Content Management**:
 *   - `createContent`: Adds new content to the catalog.
 *   - `updateContent`: Updates existing content metadata by ID.
 *   - `deleteContent`: Deletes a catalog item by its unique ID.
 * - **Recommendations**:
 *   - `createRecommendation`: Links a user to recommended content, with rationale.
 *   - `updateRecommendation`: Updates the rationale or attributes of a recommendation.
 */

import { gql } from "apollo-server-express";
import { ApolloError } from "apollo-server-errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Favorite from "../models/Favorite.js";
import Content from "../models/Content.js";
import Recommendation from "../models/Recommendation.js";

// Authentication middleware for GraphQL
const authenticate = (resolver) => async (parent, args, context, info) => {
  const token = context.headers.authorization?.split(" ")[1]; // Extract token
  if (!token) {
    throw new ApolloError("Authentication required.", "UNAUTHENTICATED");
  }

  try {
    // Verify token and attach user to context
    const user = jwt.verify(token, process.env.JWT_SECRET);
    context.user = user; // Attach user info to context
    return resolver(parent, args, context, info);
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    throw new ApolloError("Invalid or expired token.", "UNAUTHENTICATED");
  }
};

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    password: String
    preferences: [String]
    history: [String]
  }

  type Favorite {
    id: ID!
    userId: ID!
    tmdbId: String!
    mediaType: String! # "movie" or "tv"
    addedAt: String!
  }

  input UpdateFavoriteInput {
    tmdbId: String
    mediaType: String
  }

  type Content {
    id: ID!
    title: String!
    genre: String!
    rating: Float!
    metadata: String!
  }

  type Recommendation {
    id: ID!
    userId: ID!
    contentId: ID!
    reason: String!
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

  input UpdateUserInput {
    name: String
    email: String
    password: String
    preferences: [String]
  }

  input ContentInput {
    title: String!
    genre: String!
    rating: Float!
    metadata: String!
  }

  input UpdateContentInput {
    title: String
    genre: String
    rating: Float
    metadata: String
  }

  type Query {
    getAllUsers: [User!]!
    getUserById(id: ID!): User
    getFavorites: [Favorite!]! # Fetch all favorites for the authenticated user
    getContent(filter: ContentInput): [Content]
    getRecommendations(userId: ID!): [Recommendation]
  }

  type Mutation {
    registerUser(input: RegisterInput!): AuthPayload!
    loginUser(input: LoginInput!): AuthPayload!
    addFavorite(tmdbId: String!, mediaType: String!): Favorite!
    updateFavorite(id: ID!, input: UpdateFavoriteInput!): Favorite!
    removeFavorite(id: ID!): Boolean

    createUser(email: String!, password: String!): User
    updateUser(id: ID!, input: UpdateUserInput!): User
    deleteUser(id: ID!): Boolean

    createContent(input: ContentInput!): Content
    updateContent(id: ID!, input: UpdateContentInput!): Content
    deleteContent(id: ID!): Boolean

    createRecommendation(
      userId: ID!
      contentId: ID!
      reason: String!
    ): Recommendation
    updateRecommendation(id: ID!, reason: String!): Recommendation
  }
`;

const resolvers = {
  Query: {
    // Fetch all users
    getAllUsers: authenticate(async () => {
      try {
        const users = await User.find().select("-password"); // Exclude passwords
        return users;
      } catch (error) {
        console.error("Error fetching users:", error.message);
        throw new ApolloError("Failed to fetch users.");
      }
    }),

    // Fetch a user by ID
    getUserById: authenticate(async (_, { id }) => {
      try {
        const user = await User.findById(id).select("-password");
        if (!user) {
          throw new ApolloError("User not found.", "NOT_FOUND");
        }
        return user;
      } catch (error) {
        throw new ApolloError("Failed to fetch user.", "INTERNAL_SERVER_ERROR");
      }
    }),

    // Fetch all favorites for the authenticated user
    getFavorites: authenticate(async (_, args, context) => {
      try {
        const favorites = await Favorite.find({ userId: context.user.id }).sort(
          { addedAt: -1 },
        );
        return favorites;
      } catch (error) {
        console.error("Error fetching favorites:", error.message);
        throw new ApolloError("Failed to fetch favorites.");
      }
    }),

    // Fetch content based on filter
    getContent: async (_, { filter }) => {
      try {
        const content = await Content.find(filter || {});
        return content;
      } catch (error) {
        throw new ApolloError("Failed to fetch content.", error);
      }
    },

    // Fetch recommendations for a user
    getRecommendations: async (_, { userId }) => {
      try {
        const recommendations = await Recommendation.find({ userId });
        return recommendations;
      } catch (error) {
        throw new ApolloError("Failed to fetch recommendations.", error);
      }
    },
  },

  Mutation: {
    // Register a new user
    registerUser: async (_, { input }) => {
      const { name, email, password } = input;
      if (!name || !email || !password) {
        throw new ApolloError("All fields are required.", "BAD_USER_INPUT");
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new ApolloError("Email already in use.", "BAD_USER_INPUT");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      const token = jwt.sign(
        { id: newUser._id, email: newUser.email, name: newUser.name },
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
      );

      return {
        token,
        user: { id: newUser._id, name: newUser.name, email: newUser.email },
      };
    },

    // Authenticate and log in a user
    loginUser: async (_, { input }) => {
      const { email, password } = input;

      const user = await User.findOne({ email });
      if (!user) {
        throw new ApolloError("User not found. Please sign up.", "NOT_FOUND");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new ApolloError("Invalid email or password.", "UNAUTHORIZED");
      }

      const token = jwt.sign(
        { id: user._id, email: user.email, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
      );

      return {
        token,
        user: { id: user._id, name: user.name, email: user.email },
      };
    },

    // Update a user's profile
    updateUser: authenticate(async (_, { id, input }) => {
      const updateFields = {};
      if (input.name !== undefined) updateFields.name = input.name;
      if (input.preferences !== undefined)
        updateFields.preferences = input.preferences;
      if (input.password) {
        const hashedPassword = await bcrypt.hash(input.password, 10);
        updateFields.password = hashedPassword;
      }

      const updatedUser = await User.findByIdAndUpdate(id, updateFields, {
        new: true,
      });
      if (!updatedUser) {
        throw new ApolloError("User not found.", "NOT_FOUND");
      }
      return updatedUser;
    }),

    // Delete a user account
    deleteUser: authenticate(async (_, { id }) => {
      try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
          throw new ApolloError("User not found.", "NOT_FOUND");
        }
        return true;
      } catch (error) {
        console.error("Error deleting user:", error.message);
        throw new ApolloError(
          "Failed to delete user.",
          "INTERNAL_SERVER_ERROR",
        );
      }
    }),

    // Add a new favorite
    addFavorite: authenticate(async (_, { tmdbId, mediaType }, context) => {
      try {
        const existingFavorite = await Favorite.findOne({
          userId: context.user.id,
          tmdbId,
        });
        if (existingFavorite) {
          throw new ApolloError(
            "This item is already in your favorites.",
            "BAD_USER_INPUT",
          );
        }

        const favorite = new Favorite({
          userId: context.user.id,
          tmdbId,
          mediaType,
        });
        await favorite.save();
        return favorite;
      } catch (error) {
        console.error("Error adding favorite:", error.message);
        throw new ApolloError("Failed to add favorite.");
      }
    }),

    updateFavorite: authenticate(async (_, { id, input }, context) => {
      try {
        // Validate input fields
        if (!input.tmdbId && !input.mediaType) {
          throw new ApolloError(
            "At least one field (tmdbId or mediaType) must be provided.",
            "BAD_USER_INPUT",
          );
        }

        // Update the favorite if it exists and belongs to the user
        const updatedFavorite = await Favorite.findOneAndUpdate(
          { _id: id, userId: context.user.id }, // Match user ownership
          { $set: input }, // Apply updates
          { new: true }, // Return the updated document
        );

        if (!updatedFavorite) {
          throw new ApolloError(
            "Favorite not found or unauthorized.",
            "NOT_FOUND",
          );
        }

        return updatedFavorite;
      } catch (error) {
        console.error("Error updating favorite:", error.message);
        throw new ApolloError(
          "Failed to update favorite.",
          "INTERNAL_SERVER_ERROR",
        );
      }
    }),

    // Remove a favorite by its ID
    removeFavorite: authenticate(async (_, { id }, context) => {
      try {
        const favorite = await Favorite.findOneAndDelete({
          _id: id,
          userId: context.user.id,
        });
        if (!favorite) {
          throw new ApolloError("Favorite not found.", "NOT_FOUND");
        }
        return true;
      } catch (error) {
        console.error("Error removing favorite:", error.message);
        throw new ApolloError("Failed to remove favorite.");
      }
    }),

    // Create content
    createContent: async (_, { input }) => {
      try {
        const newContent = new Content(input);
        await newContent.save();
        return newContent;
      } catch (error) {
        throw new ApolloError("Failed to create content.", error);
      }
    },

    // Update content
    updateContent: async (_, { id, input }) => {
      try {
        const updatedContent = await Content.findByIdAndUpdate(id, input, {
          new: true,
        });
        return updatedContent;
      } catch (error) {
        throw new ApolloError("Failed to update content.", error);
      }
    },

    // Delete content
    deleteContent: async (_, { id }) => {
      try {
        await Content.findByIdAndDelete(id);
        return true;
      } catch (error) {
        throw new ApolloError("Failed to delete content.", error);
      }
    },

    // Create recommendation
    createRecommendation: async (_, { userId, contentId, reason }) => {
      try {
        const newRecommendation = new Recommendation({
          userId,
          contentId,
          reason,
        });
        await newRecommendation.save();
        return newRecommendation;
      } catch (error) {
        throw new ApolloError("Failed to create recommendation.", error);
      }
    },

    // Update recommendation
    updateRecommendation: async (_, { id, reason }) => {
      try {
        const updatedRecommendation = await Recommendation.findByIdAndUpdate(
          id,
          { reason },
          { new: true },
        );
        return updatedRecommendation;
      } catch (error) {
        throw new ApolloError("Failed to update recommendation.", error);
      }
    },
  },
};

export { typeDefs, resolvers };
