import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import FilmCredits from "./FilmCredits";

test("features the three requested films and gives every displayed title artwork", () => {
  const { container } = render(<FilmCredits />);
  const featured = container.querySelector(".film-work__featured");
  expect(within(featured).getAllByRole("heading").map((heading) => heading.textContent.replace(" ↗", ""))).toEqual([
    "Krazy Klowny", "Dead Man's Creek", "The Omicron Killer",
  ]);
  const creek = container.querySelector('[data-film-title="Dead Man\'s Creek"]');
  expect(within(creek).getByText("Post-production")).toBeVisible();
  const cards = container.querySelectorAll("[data-film-title]");
  expect(cards).toHaveLength(19);
  for (const card of cards) expect(card.querySelector("img")).toHaveAttribute("src", expect.stringMatching(/^\/img\//));
  expect(container.querySelector('[data-film-title="Queer Khalifa"]')).not.toHaveClass("film-work__card--featured");
  expect(container.querySelector("iframe")).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: /Watch the film/ })).toHaveAttribute("href", "https://www.queerkhalifa.com/watch-film");
});
