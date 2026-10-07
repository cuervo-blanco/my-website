import { fireEvent, render, screen, within } from "@testing-library/react";
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

test("film search finds accented titles and roles and recovers from no results", () => {
  const { container } = render(<FilmCredits />);
  const search = screen.getByRole("searchbox", { name: "Search film credits" });
  fireEvent.change(search, { target: { value: "La Creacion" } });
  expect(container.querySelectorAll("[data-film-title]")).toHaveLength(1);
  expect(screen.getByRole("heading", { name: /La Creación/ })).toBeVisible();
  fireEvent.change(search, { target: { value: "La Obra 2023" } });
  expect(container.querySelectorAll("[data-film-title]")).toHaveLength(0);
  fireEvent.change(search, { target: { value: "La Obra 2022" } });
  expect(container.querySelectorAll("[data-film-title]")).toHaveLength(1);
  fireEvent.change(search, { target: { value: "Foley" } });
  expect(container.querySelector('[data-film-title="Hijas de la Invasión"]')).toBeInTheDocument();
  expect(container.querySelector('[data-film-title="Duelistas"]')).not.toBeInTheDocument();
  fireEvent.change(search, { target: { value: "No matching production" } });
  expect(screen.getByRole("status")).toHaveTextContent("0 matching projects");
  fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));
  expect(search).toHaveValue("");
  expect(container.querySelectorAll("[data-film-title]")).toHaveLength(19);
});
