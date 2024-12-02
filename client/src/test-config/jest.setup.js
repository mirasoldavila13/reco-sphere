import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder as NodeTextDecoder } from "util";
// Mock for matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  })),
});
// Mock for ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {
    Object.defineProperty(this, "observe", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: jest.fn(),
    });
    Object.defineProperty(this, "unobserve", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: jest.fn(),
    });
    Object.defineProperty(this, "disconnect", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: jest.fn(),
    });
  }
};
// Polyfill for TextEncoder and TextDecoder
if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === "undefined") {
  global.TextDecoder = NodeTextDecoder;
}
