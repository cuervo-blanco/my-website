import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

vi.mock("./lib/firebase", () => ({ logPageView: vi.fn() }));
vi.mock("./components/sections/Reel.tsx", () => ({ default: () => <div>Reel</div> }));
vi.mock("./components/common/HeroStars", () => ({ default: () => <div id="hero-stars" aria-hidden="true" /> }));
import App from "./App";

afterEach(() => { window.history.pushState({}, "", "/"); });

test("puts work on the homepage with contact in primary navigation", () => {
  render(<App />);
  const navigation = within(screen.getByRole("navigation", { name: "Primary" }));
  expect(navigation.getAllByRole("link").map((link) => link.textContent)).toEqual(["Work", "Dev", "Animation", "Contact"]);
  expect(screen.getByRole("heading", { name: "Jaime Osvaldo", level: 1 })).toBeVisible();
  expect(screen.getByRole("link", { name: "Résumé" })).toBeInTheDocument();
  expect(navigation.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "/contact");
  expect(screen.queryByRole("heading", { name: "Contact" })).not.toBeInTheDocument();
  expect(document.title).toMatch(/New York Sound Mixer & Sound Designer/i);
});

test("orders the homepage as Film, Companies, then Live & Theatre", () => {
  const { container } = render(<App />);
  const sections = Array.from(container.querySelectorAll("main > section"), (section) => section.id);
  expect(sections.indexOf("credits")).toBeLessThan(sections.indexOf("recent-clients"));
  expect(sections.indexOf("recent-clients")).toBeLessThan(sections.indexOf("live-credits"));
  const live = screen.getByRole("region", { name: "Live & Theatre" });
  const billy = within(live).getByRole("heading", { name: "Reverend Billy and the Stop Shopping Choir" }).closest("li");
  const spotlight = within(live).getByRole("heading", { name: "Spotlight Festival" }).closest("li");
  expect(within(billy).getByText("A1")).toBeVisible();
  expect(within(spotlight).getByText("TD")).toBeVisible();
  expect(within(live).getAllByRole("heading", { name: "Reverend Billy and the Stop Shopping Choir" })).toHaveLength(1);
});

test("the service submenu has accessible links to each kind of work", () => {
  render(<App />);
  const destinations = within(screen.getByRole("navigation", { name: "Explore my work" }));
  for (const [name, href] of [
    ["sound mixer", "/#credits"], ["sound designer", "/#credits"], ["film", "/#credits"],
    ["theater", "/#live-credits"], ["Software developer", "/dev"],
    ["audio programmer", "/dev#dsp-dictionary"], ["animator", "/art"], ["Get in touch ↗", "/contact"],
  ]) expect(destinations.getByRole("link", { name, exact: true })).toHaveAttribute("href", href);
  fireEvent.click(destinations.getByRole("link", { name: "audio programmer", exact: true }));
  expect(window.location.pathname).toBe("/dev");
  expect(window.location.hash).toBe("#dsp-dictionary");
  expect(screen.getByRole("heading", { name: "DSP Dictionary" })).toBeVisible();
  expect(document.querySelector("#hero-stars").parentElement).toHaveAttribute("id", "application");
});

test.each([
  ["/film", "/", "#credits"], ["/live", "/", "#live-credits"],
  ["/live/companies", "/", "#recent-clients"], ["/dev/projects", "/dev", ""],
  ["/portfolio", "/", "#portfolio-films"],
])("consolidates old URL %s", (url, pathname, hash) => {
  window.history.pushState({}, "", url);
  render(<App />);
  expect(window.location.pathname).toBe(pathname);
  expect(window.location.hash).toBe(hash);
  expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
});

test("legacy film sample links reveal the playable samples on the homepage", () => {
  window.history.pushState({}, "", "/film/samples");
  const { container } = render(<App />);
  expect(window.location.pathname).toBe("/");
  const samples = container.querySelector("#portfolio-films");
  expect(samples).toBeTruthy();
  expect(samples).toBeVisible();
  const firstFilm = samples.querySelector("details");
  fireEvent.click(firstFilm.querySelector("summary"));
  expect(firstFilm).toHaveAttribute("open");
  expect(samples.querySelectorAll("audio").length).toBeGreaterThan(0);
});

test("deep sample links open their collapsed media section", () => {
  window.history.pushState({}, "", "/film/samples#portfolio-music");
  const { container } = render(<App />);
  const music = container.querySelector("#portfolio-music");
  expect(window.location.pathname).toBe("/");
  expect(music.closest("details")).toHaveAttribute("open");
  expect(music).toBeVisible();
});

test("keeps all companies on the combined page", () => {
  render(<App />);
  const directory = screen.getByRole("region", { name: "Companies I’ve Worked With & Still Work With" });
  expect(within(directory).getByRole("img", { name: "SDN Broadcast" })).toBeVisible();
  expect(within(directory).getByRole("img", { name: "McCabe Event Services" })).toBeVisible();
  expect(within(directory).getByRole("img", { name: "Amas Musical Theatre" })).toHaveAttribute("data-logo-backdrop", "light");
  expect(within(directory).getAllByRole("listitem")).toHaveLength(19);
  expect(within(directory).queryByText("The Immediate Life")).not.toBeInTheDocument();
  for (const name of ["Encore", "Creative Technology", "Blackstone", "Oracle", "Dataiku"]) {
    expect(within(directory).getByRole("img", { name })).toBeVisible();
    expect(within(directory).queryByText(name)).not.toBeInTheDocument();
  }
  expect(screen.queryByRole("textbox", { name: "Message" })).not.toBeInTheDocument();
});

test("features the three large films and gives every displayed film a picture", () => {
  const { container } = render(<App />);
  const featured = container.querySelector(".film-work__featured");
  expect([...featured.querySelectorAll("h3")].map((heading) => heading.textContent.replace(" ↗", ""))).toEqual(["Krazy Klowny", "Dead Man's Creek", "The Omicron Killer"]);
  expect(within(featured).getByRole("link", { name: /Watch sizzle reel/ })).toHaveAttribute("href", "https://www.imdb.com/video/vi1734527769/");
  const creek = within(featured).getByRole("heading", { name: /Dead Man's Creek/ }).closest("article");
  expect(within(creek).getByText("Post-production")).toBeVisible();
  const filmCards = container.querySelectorAll("[data-film-title]");
  expect(filmCards).toHaveLength(19);
  for (const card of filmCards) expect(card.querySelector("img")).toBeTruthy();
  const queer = container.querySelector('[data-film-title="Queer Khalifa"]');
  expect(queer).not.toHaveClass("film-work__card--featured");
  expect(within(queer).getByRole("link", { name: /Watch the film/ })).toHaveAttribute("href", "https://www.queerkhalifa.com/watch-film");
  expect(container.querySelector('iframe[title*="Queer Khalifa"]')).toBeNull();
});

test("puts GitHub above the complete interactive DSP dictionary on Dev", () => {
  window.history.pushState({}, "", "/dev");
  render(<App />);
  expect(screen.getByRole("heading", { name: "Dev", level: 1 })).toBeVisible();
  expect(screen.getByRole("heading", { name: "DSP Dictionary", level: 2 })).toBeVisible();
  expect(document.querySelectorAll("[data-dsp-concept]")).toHaveLength(28);
  expect(screen.queryByRole("link", { name: /DSP Dictionary/ })).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: /GitHub/ })).toHaveAttribute("href", "https://github.com/cuervo-blanco");
  expect(screen.queryByRole("heading", { name: "Delay Compensation Plugin" })).not.toBeInTheDocument();
  expect(screen.getAllByRole("slider").length).toBeGreaterThan(28);
  expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute("href", "https://jaimeosvaldo.com/dev");
  expect(document.querySelector('script[data-seo="structured-data"]').textContent).not.toContain("Delay Compensation Plugin");
  expect(within(screen.getByRole("navigation", { name: "Primary" })).getByRole("link", { name: "Contact" })).toHaveAttribute("href", "/contact");
});

test("shows all 28 interactive dictionary lessons without the original essays", () => {
  window.history.pushState({}, "", "/dev/dsp-dictionary#filter");
  const { container } = render(<App />);
  expect(window.location.pathname).toBe("/dev");
  expect(window.location.hash).toBe("#filter");
  expect(container.querySelectorAll("[data-dsp-concept]")).toHaveLength(28);
  expect(container.querySelectorAll(".dictionary-prose, .dictionary-code")).toHaveLength(0);
  const filter = container.querySelector('[data-dsp-concept="filter"]');
  expect(within(filter).getByText("A filter passes some frequencies and attenuates others.")).toBeVisible();
  expect(within(filter).getByRole("slider", { name: "Cutoff", exact: true })).toBeInTheDocument();
  expect(filter.querySelector("details")).not.toHaveAttribute("open");
  expect(within(filter).getByText(/H\(z\)/)).toBeVisible();
});

test("presents Animation on a single page with a user-controlled video", () => {
  window.history.pushState({}, "", "/art/about");
  render(<App />);
  expect(window.location.pathname).toBe("/art");
  expect(screen.getByRole("heading", { name: "Animation", level: 1 })).toBeVisible();
  const video = screen.getByLabelText("Dark Knites logo animation");
  expect(video).toHaveAttribute("controls");
  expect(video).not.toHaveAttribute("autoplay");
  expect(video).toHaveAttribute("poster", "/media/dark-knites-poster.jpg");
  expect(video.querySelector("source")).toHaveAttribute("src", "/media/dark-knites-logo.mp4");
  expect(screen.getByText("Animation & sound — Jaime Osvaldo")).toBeVisible();
  for (const tool of ["Blender", "DaVinci Resolve", "Logic Pro", "SuperCollider"]) {
    expect(screen.getByText(tool)).toBeVisible();
  }
});


test("Contact is a dedicated page with the form immediately visible and no unconfirmed email", () => {
  window.history.pushState({}, "", "/contact");
  render(<App />);
  expect(screen.getByRole("heading", { name: "Contact", level: 1 })).toBeVisible();
  expect(screen.getByRole("textbox", { name: "Message" })).toBeVisible();
  expect(screen.queryByRole("link", { name: "Email", exact: true })).not.toBeInTheDocument();
  expect(screen.queryByText(/support@jaimeosvaldo.com/)).not.toBeInTheDocument();
  expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute("href", "https://jaimeosvaldo.com/contact");
});

test("hamburger opens, closes with Escape, and navigates to Contact without leaving scrolling locked", () => {
  window.history.pushState({}, "", "/dev");
  render(<App />);
  const toggle = screen.getByRole("button", { name: "Open menu" });
  fireEvent.click(toggle);
  expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
  const mobile = screen.getByRole("navigation", { name: "Mobile" });
  expect(within(mobile).getAllByRole("link")).toHaveLength(4);
  expect(document.body.style.overflow).toBe("hidden");
  fireEvent.keyDown(document.activeElement, { key: "Escape" });
  expect(screen.queryByRole("navigation", { name: "Mobile" })).not.toBeInTheDocument();
  expect(toggle).toHaveFocus();
  expect(document.body.style.overflow).toBe("");
  fireEvent.click(toggle);
  fireEvent.click(within(screen.getByRole("navigation", { name: "Mobile" })).getByRole("link", { name: "Contact" }));
  expect(window.location.pathname).toBe("/contact");
  expect(screen.queryByRole("navigation", { name: "Mobile" })).not.toBeInTheDocument();
  expect(document.body.style.overflow).toBe("");
  expect(screen.getByRole("textbox", { name: "Message" })).toBeVisible();
});
