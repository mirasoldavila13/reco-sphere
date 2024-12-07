import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { ApolloServer } from "apollo-server-express";
import connectDB from "./config/db.js";
import { typeDefs, resolvers } from "./graphql/schema.js";
import trendingRoute from "./routes/api/trending.js";
import genresRoute from "./routes/api/genres.js";
import popularRoute from "./routes/api/popular.js";
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

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET"],
    allowedHeaders: ["Content-Type"],
  }),
);
app.use(express.json());

// Helper variables for file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files
app.use(express.static(path.join(__dirname, "../client/dist")));

// Use the routes
app.use("/api/trending", trendingRoute);
app.use("/api/genres", genresRoute); // Note: /api/genres
app.use("/api/popular", popularRoute);

// Catch-all handler for React
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

// Initialize Apollo Server
async function startServer() {
  try {
    await connectDB(MONGODB_URI);
    logger.info("Connected to MongoDB");

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      introspection: true, //remove after development
      playground: true,
    });

    await server.start();
    server.applyMiddleware({ app });

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
