/**
 * Server Configuration for RecoSphere Application
 *
 * This file serves as the entry point for the server-side of the RecoSphere application.
 * It sets up and configures the following:
 *
 * - **Express Framework**: Handles RESTful APIs and middleware integration.
 * - **GraphQL with Apollo Server**: Provides a GraphQL endpoint for client interaction.
 * - **MongoDB Database**: Connects to the MongoDB database using Mongoose.
 * - **Static File Serving**: Serves the React frontend for client requests.
 * - **Logging**: Implements structured logging for debugging and production monitoring.
 *
 * Key Features:
 * - RESTful API Routes: Provides endpoints for trending, genres, popular movies, and authentication.
 * - Apollo GraphQL Server: Handles GraphQL operations like user registration.
 * - CORS Policy: Ensures secure communication between the frontend and backend.
 * - Middleware: Includes utilities like `morgan` for HTTP logging and `winston` for structured logging.
 * - Deployment Ready: Configured to serve static files for React in production.
 * - Modular Design: Separates route logic and database configuration into respective modules.
 *
 * Dependencies:
 * - `express`: Web framework for handling HTTP requests and middleware.
 * - `apollo-server-express`: Provides GraphQL functionality.
 * - `mongoose`: For database interaction with MongoDB.
 * - `morgan` & `winston`: For logging.
 * - `dotenv`: For environment variable management.
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { ApolloServer, AuthenticationError } from "apollo-server-express";
import jwt from "jsonwebtoken";
import connectDB from "./config/db.js";
import { typeDefs, resolvers } from "./graphql/schema.js";
import trendingRoute from "./routes/api/trending.js";
import genresRoute from "./routes/api/genres.js";
import popularRoute from "./routes/api/popular.js";
import authRoutes from "./routes/authRoutes.js";
import morgan from "morgan";
import winston from "winston";

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3001;

// Initialize Express app
const app = express();

// Setup logging with Winston
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.File({ filename: "combined.log" }),
    new winston.transports.File({ filename: "error.log", level: "error" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}

app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }),
);

// Middleware for REST and GraphQL
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

// Helper variables for file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files for React
app.use(express.static(path.join(__dirname, "../client/dist")));

// REST API routes
app.use("/api/trending", trendingRoute);
app.use("/api/genres", genresRoute);
app.use("/api/popular", popularRoute);
app.use("/api/auth", authRoutes);

// Initialize Apollo Server
async function startServer() {
  try {
    await connectDB(MONGODB_URI);
    logger.info("Connected to MongoDB");

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => {
        const token = req.headers.authorization?.split("")[1]; // Extract Bearer token
        if (token) {
          try {
            const user = jwt.verify(token, process.env.JWT_SECRET);
            return { user }; // Attach user to context
          } catch (error) {
            console.error("Invalid token:", error.message);
            throw new AuthenticationError(
              "Invalid or expired token. Please log in again.",
            );
          }
        }
        return {}; // Return empty context if no token is provided
      },
    });

    await server.start();
    server.applyMiddleware({ app, path: "/graphql" });

    // Catch-all handler for React app
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
    });

    app.listen(PORT, () => {
      logger.info(
        `🚀 Server running on http://localhost:${PORT}${server.graphqlPath}`,
      );
    });
  } catch (err) {
    logger.error("Error starting server:", err);
    process.exit(1);
  }
}

startServer();
