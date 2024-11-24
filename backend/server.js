import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ApolloServer } from "apollo-server-express";
import connectDB from "./config/db.js"; 
import { typeDefs, resolvers } from "./graphql/schema.js";

// Load environment variables
dotenv.config();


const MONGODB_URI = process.env.MONGODB_URI;


const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    // Connect to MongoDB using  db.js
    await connectDB(MONGODB_URI);

    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();
    server.applyMiddleware({ app });

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}${server.graphqlPath}`);
    });
  } catch (err) {
    console.error("Error starting server:", err);
    process.exit(1);
  }
}

startServer();
