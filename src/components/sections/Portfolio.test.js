import { act } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { expect, test, vi } from "vitest";
import Portfolio from "./Portfolio";

test("film and album media hydrate from browser-parsed server HTML without replacing the page", async () => {
  const page = <Portfolio compact showTechnicalSection={false} />;
  const container = document.createElement("div");
  container.innerHTML = renderToString(page);
  document.body.appendChild(container);
  const recoverableError = vi.fn();
  let root;
  try {
    await act(async () => { root = hydrateRoot(container, page, { onRecoverableError: recoverableError }); });
    expect(recoverableError).not.toHaveBeenCalled();
    expect(container.querySelectorAll("audio")).toHaveLength(35);
    expect(container.querySelectorAll('a[href*="bandcamp.com"]').length).toBeGreaterThan(0);
  } finally {
    act(() => root?.unmount());
    container.remove();
  }
});
