/**
 * Jest Setup File
 *
 * This file configures the testing environment for Jest, setting up necessary
 * polyfills, mocks, and global utilities to ensure compatibility and smooth testing.
 *
 * Purpose:
 * - Provides a consistent and controlled testing environment by addressing browser and environment-specific limitations.
 * - Implements polyfills and mocks for features not natively available in the Node.js environment.
 *
 * Key Features:
 * - **Testing Library Setup**:
 *   - Imports `@testing-library/jest-dom` to extend Jest's `expect` functionality with custom DOM matchers (e.g., `toBeInTheDocument`).
 * - **Polyfills**:
 *   - Adds polyfills for `TextEncoder` and `TextDecoder` to address missing implementations in Node.js.
 * - **Global Mocks**:
 *   - Mocks `window.matchMedia` to prevent errors when testing components relying on CSS media queries.
 *   - Mocks `ResizeObserver` to allow testing components that depend on size observation (e.g., responsive components).
 *
 * Mocks:
 * - `window.matchMedia`:
 *   - Mocked to return a consistent response and avoid runtime errors in a Node.js environment.
 *   - Provides stub implementations for `addEventListener` and `removeEventListener`.
 * - `ResizeObserver`:
 *   - Provides no-op implementations for methods like `observe`, `unobserve`, and `disconnect`.
 *
 * Polyfills:
 * - `TextEncoder`:
 *   - Adds a polyfill for the `TextEncoder` class, required by some libraries for encoding text data.
 * - `TextDecoder`:
 *   - Adds a polyfill for the `TextDecoder` class, enabling decoding of text data within tests.
 *
 * Usage:
 * - Automatically loaded before each test file by specifying it in Jest's `setupFilesAfterEnv` configuration.
 * - Ensures compatibility with React components and modern web APIs during tests.
 *
 * Dependencies:
 * - `@testing-library/jest-dom`: Provides additional matchers for testing DOM nodes.
 * - `util`: Node.js module used for `TextEncoder` and `TextDecoder` polyfills.
 *
 * Example:
 * ```json
 * {
 *   "jest": {
 *     "setupFilesAfterEnv": ["<rootDir>/jest.setup.ts"]
 *   }
 * }
 * ```
 */

import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder as NodeTextDecoder } from "util";

// Mock for matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  })),
});

// Mock for ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
};

// Polyfill for TextEncoder and TextDecoder
if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === "undefined") {
  global.TextDecoder = NodeTextDecoder as unknown as typeof global.TextDecoder;
}
