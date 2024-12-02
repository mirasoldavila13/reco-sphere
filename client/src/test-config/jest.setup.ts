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
