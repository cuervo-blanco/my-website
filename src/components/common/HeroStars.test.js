import { act, render, waitFor } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import HeroStars from "./HeroStars";
import { getHeroStarEngine } from "../../lib/heroStars";

vi.mock("../../lib/heroStars", () => ({ getHeroStarEngine: vi.fn() }));

afterEach(() => { vi.unstubAllGlobals(); vi.resetAllMocks(); });

test("reduced-motion visitors receive static decorative stars", async () => {
  const preference = { matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() };
  vi.stubGlobal("matchMedia", vi.fn(() => preference));
  const destroy = vi.fn();
  const load = vi.fn().mockResolvedValue({ destroy });
  getHeroStarEngine.mockResolvedValue({ load });
  const { container, unmount } = render(<HeroStars />);
  await waitFor(() => expect(load).toHaveBeenCalledTimes(1));
  const options = load.mock.calls[0][0].options;
  expect(options.particles.move.enable).toBe(false);
  expect(options.particles.opacity.animation.enable).toBe(false);
  expect(options.particles.shape.type).toBe("star");
  expect(options.particles.paint.color.value).toBe("#fff");
  expect(options.particles.number.value).toBeLessThanOrEqual(24);
  expect(options.particles.color).toBeUndefined();
  expect(options.fullScreen.enable).toBe(false);
  expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  unmount();
  expect(destroy).toHaveBeenCalledTimes(1);
  expect(preference.removeEventListener).toHaveBeenCalledWith("change", expect.any(Function));
});

test("leaving the hero while its canvas loads still releases the canvas", async () => {
  let finishLoading;
  const destroy = vi.fn();
  const load = vi.fn(() => new Promise((resolve) => { finishLoading = resolve; }));
  getHeroStarEngine.mockResolvedValue({ load });
  const { unmount } = render(<HeroStars />);
  await waitFor(() => expect(load).toHaveBeenCalledTimes(1));
  unmount();
  await act(async () => finishLoading({ destroy }));
  expect(destroy).toHaveBeenCalledTimes(1);
});
