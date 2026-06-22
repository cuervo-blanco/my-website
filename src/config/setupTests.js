import "@testing-library/jest-dom";
import { TextDecoder, TextEncoder } from "util";
import { vi } from "vitest";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

Object.defineProperty(window, "scrollTo", {
  writable: true,
  value: vi.fn(),
});

class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }

  observe() {
    this.callback([{ isIntersecting: true }]);
  }

  disconnect() {}

  unobserve() {}
}

global.IntersectionObserver = MockIntersectionObserver;
