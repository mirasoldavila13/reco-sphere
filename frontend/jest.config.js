"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/src/test-config/jest.setup.ts"],
    moduleNameMapper: {
        "\\.(css|scss)$": "identity-obj-proxy",
    },
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
};
exports.default = config;
