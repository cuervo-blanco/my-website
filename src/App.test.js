import { render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

vi.mock("./lib/firebase", () => ({
  logPageView: vi.fn(),
}));
vi.mock("./components/sections/Reel.tsx", () => ({
  default: () => <div>Reel</div>,
}));

import App from "./App";

afterEach(() => {
  window.history.pushState({}, "", "/");
});

test("renders primary navigation links", () => {
  render(<App />);
  expect(screen.getAllByRole("link", { name: /home/i }).length).toBeGreaterThan(0);
  expect(screen.getAllByRole("link", { name: /work/i }).length).toBeGreaterThan(0);
  expect(screen.getAllByRole("link", { name: /dsp dictionary/i }).length).toBeGreaterThan(0);
  expect(screen.getAllByRole("link", { name: /portfolio/i }).length).toBeGreaterThan(0);
  expect(screen.getAllByRole("link", { name: /contact/i }).length).toBeGreaterThan(0);
});

test("renders the dedicated portfolio page route", () => {
  window.history.pushState({}, "", "/portfolio");
  render(<App />);

  expect(
    screen.getByRole("heading", {
      name: /sound work across film, podcasts, and music/i,
    })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", {
      name: /selected film sound samples/i,
    })
  ).toBeInTheDocument();
});

test("updates the document title for the home page", () => {
  render(<App />);
  expect(document.title).toMatch(/jaime osvaldo/i);
});
