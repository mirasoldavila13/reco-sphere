export default {
  // Root of source code
  roots: ["<rootDir>/tests"],

  // Test environment
  testEnvironment: "node",

  // File extensions to consider
  moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "node"],

  // Use native ESM handling
  transform: {},

  // Coverage settings
  collectCoverage: true,
  collectCoverageFrom: [
    "graphql/**/*.js",
    "config/**/*.js",
    "models/**/*.js",
    "!**/node_modules/**",
    "!**/coverage/**",
  ],
  coverageDirectory: "<rootDir>/coverage",

  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // Ignore patterns for tests
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/coverage/"],

  //  Load environment variables for tests
  setupFiles: ["dotenv/config"],
};
