"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config = {
    preset: "ts-jest", // Use the ts-jest preset for TypeScript
    testEnvironment: "jsdom", // Set the test environment to jsdom
    setupFilesAfterEnv: ["<rootDir>/src/test-config/jest.setup.ts"],
    moduleNameMapper: {
        "\\.(css|scss)$": "identity-obj-proxy", // Mock CSS imports
    },
    transform: {
        "^.+\\.tsx?$": "ts-jest", // Use ts-jest to transform TypeScript files
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
};
exports.default = config;
