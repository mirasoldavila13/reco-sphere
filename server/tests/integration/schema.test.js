import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers } from "../../graphql/schema";
import User from "../../models/User";
import jest from "jest-mock";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

// MongoDB connection setup
beforeAll(
  async () => {
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/test";
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  },
  30000, // Timeout for this hook
);

// MongoDB cleanup and disconnection after tests
afterAll(async () => {
  await mongoose.connection.close();
  await new Promise((resolve) => setTimeout(resolve, 1000));
});

// Apollo Server instance for testing
const testServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({}),
});

describe("GraphQL Schema", () => {
  beforeEach(async () => {
    await User.deleteMany();
    jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress error logs
  });

  it("should register a new user", async () => {
    const REGISTER_USER = `
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
        `;

    const variables = {
      input: {
        name: "Test User",
        email: "testuser@example.com",
        password: "password123",
      },
    };

    const response = await testServer.executeOperation({
      query: REGISTER_USER,
      variables,
    });

    expect(response.errors).toBeUndefined();
    expect(response.data.registerUser.user.name).toBe("Test User");
    expect(response.data.registerUser.user.email).toBe("testuser@example.com");
  }, 30000); // Timeout for this test case

  it("should not register a user with an already registered email", async () => {
    await User.create({
      name: "Existing User",
      email: "testuser@example.com",
      password: await bcrypt.hash("password123", 10),
    });

    const REGISTER_USER = `
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
        `;

    const variables = {
      input: {
        name: "New User",
        email: "testuser@example.com",
        password: "newpassword123",
      },
    };

    const response = await testServer.executeOperation({
      query: REGISTER_USER,
      variables,
    });

    expect(response.errors).toBeDefined();
    expect(response.errors[0].message).toBe("Email already in use.");
  }, 30000);

  it("should fetch a user by ID", async () => {
    const testUser = await User.create({
      name: "Test User",
      email: "userbyid@example.com",
      password: "password123",
    });

    const GET_USER_BY_ID = `
        query GetUserById($id: ID!) {
          getUserById(id: $id) {
            id
            name
            email
          }
        }
      `;

    const variables = { id: testUser._id.toString() };

    const response = await testServer.executeOperation({
      query: GET_USER_BY_ID,
      variables,
    });

    expect(response.errors).toBeUndefined();
    expect(response.data.getUserById.name).toBe("Test User");
    expect(response.data.getUserById.email).toBe("userbyid@example.com");
  });

  it("should return an error if user is not found by ID", async () => {
    const GET_USER_BY_ID = `
        query GetUserById($id: ID!) {
          getUserById(id: $id) {
            id
            name
            email
          }
        }
      `;

    const variables = { id: "nonexistentuserid" };

    const response = await testServer.executeOperation({
      query: GET_USER_BY_ID,
      variables,
    });

    expect(response.errors).toBeDefined();
    expect(response.errors[0].message).toBe("User not found.");
  });

  it("should handle errors in getAllUsers", async () => {
    const GET_ALL_USERS = `
        query GetAllUsers {
          getAllUsers {
            id
            name
            email
          }
        }
      `;

    // Mock User.find to throw an error
    jest.spyOn(User, "find").mockImplementationOnce(() => {
      throw new Error("Database error");
    });

    const response = await testServer.executeOperation({
      query: GET_ALL_USERS,
    });

    expect(response.errors).toBeDefined();
    expect(response.errors[0].message).toBe("Failed to fetch users.");
  });

  it("should return an error if required fields are missing in registerUser", async () => {
    const REGISTER_USER = `
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
      `;

    const variables = {
      input: {
        name: "",
        email: "",
        password: "",
      },
    };

    const response = await testServer.executeOperation({
      query: REGISTER_USER,
      variables,
    });

    expect(response.errors).toBeDefined();
    expect(response.errors[0].message).toBe("All fields are required.");
  });

  it("should return an error if the user is not found in getUserById", async () => {
    const GET_USER_BY_ID = `
        query GetUserById($id: ID!) {
          getUserById(id: $id) {
            id
            name
            email
          }
        }
      `;

    const variables = { id: new mongoose.Types.ObjectId().toString() }; // Non-existent ID

    const response = await testServer.executeOperation({
      query: GET_USER_BY_ID,
      variables,
    });

    expect(response.errors).toBeDefined();
    expect(response.errors[0].message).toBe("User not found.");
  });

  it("should fetch all users successfully", async () => {
    // Create mock users in the database
    await User.create([
      { name: "User One", email: "user1@example.com", password: "password1" },
      { name: "User Two", email: "user2@example.com", password: "password2" },
    ]);

    const GET_ALL_USERS = `
        query GetAllUsers {
          getAllUsers {
            id
            name
            email
          }
        }
      `;

    const response = await testServer.executeOperation({
      query: GET_ALL_USERS,
    });

    expect(response.errors).toBeUndefined();
    expect(response.data.getAllUsers.length).toBe(2); // Ensure two users are fetched
    expect(response.data.getAllUsers[0].name).toBe("User One");
    expect(response.data.getAllUsers[1].name).toBe("User Two");
  });
}, 30000); // Timeout for the entire test suite
