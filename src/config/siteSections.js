import { siteMetadata } from "./site";

export const sectionSites = {
  film: { key: "film", label: "Work", title: "Work", basePath: "/", subdomain: siteMetadata.url },
  dev: { key: "dev", label: "Dev", title: "Dev", basePath: "/dev", subdomain: "https://dev.jaimeosvaldo.com" },
  art: { key: "art", label: "Animation", title: "Animation", basePath: "/art", subdomain: "https://art.jaimeosvaldo.com" },
};

function browserHostname() {
  return typeof window !== "undefined" ? window.location.hostname : "";
}

export function getHostedSiteKey(hostname = "") {
  const host = hostname.toLowerCase().replace(/:\d+$/, "");
  if (["film.jaimeosvaldo.com", "live.jaimeosvaldo.com"].includes(host)) return "film";
  if (host === "dev.jaimeosvaldo.com") return "dev";
  if (host === "art.jaimeosvaldo.com") return "art";
  return null;
}

export function getPathSiteKey(pathname = "/") {
  if (/^\/dev(?:\/|$)/.test(pathname) || ["/software", "/projects", "/dsp-dictionary"].includes(pathname)) return "dev";
  if (/^\/art(?:\/|$)/.test(pathname) || pathname === "/about") return "art";
  return "film";
}

export function getCurrentSiteKey(pathname = "/", hostname = "") {
  return pathname === "/" ? getHostedSiteKey(hostname) || "film" : getPathSiteKey(pathname);
}

export function getCurrentSite(pathname = "/", hostname = "") {
  return sectionSites[getCurrentSiteKey(pathname, hostname)];
}

export function getSiteRoute(siteKey, localPath = "/", hostname = browserHostname()) {
  const key = ["live", "gateway"].includes(siteKey) ? "film" : siteKey;
  const local = (localPath.startsWith("/") ? localPath : `/${localPath}`).replace(/\/+$/, "") || "/";
  let route;
  if (key === "film") {
    route = local === "/samples" ? "/#portfolio-films"
      : local === "/companies" ? "/#recent-clients"
      : siteKey === "live" ? "/#live-credits" : "/";
  } else if (key === "dev") {
    route = local === "/projects" ? "/dev#projects"
      : local === "/" ? "/dev" : `/dev${local}`;
  } else {
    route = "/art";
  }
  const hosted = getHostedSiteKey(hostname);
  return hosted && hosted !== key ? `${siteMetadata.url}${route}` : route;
}

function pageLink(siteKey) {
  const to = getSiteRoute(siteKey);
  const label = sectionSites[siteKey].label;
  const icon = siteKey === "dev" ? "software" : siteKey === "art" ? "home" : "portfolio";
  return to.startsWith("https:")
    ? { label, type: "external", href: to, target: "_self", icon }
    : { label, type: "route", to, icon };
}

export function getNavigationForSite(siteKey, pathname = "/") {
  return [...["film", "dev", "art"].map(pageLink), { label: "Contact", type: "route", to: "/contact", icon: "contact" }];
}

export function getFooterQuickLinks() {
  return getNavigationForSite();
}

export function getSiteSwitchLinks(currentSiteKey) {
  return getNavigationForSite().filter((link) => link.label !== sectionSites[currentSiteKey]?.label);
}

// Kept for legacy imports; the homepage now displays the work itself.
export const gatewayCards = [
  { siteKey: "film", title: "Work" },
  { siteKey: "dev", title: "Dev" },
  { siteKey: "art", title: "Animation" },
];
