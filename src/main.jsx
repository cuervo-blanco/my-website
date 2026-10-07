import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import { getHostedSiteKey } from "./config/siteSections";
import "./App.css";
import "./index.css";
import "./assets/styles/styles.scss";
import "./assets/styles/minimal-site.css";
import "./assets/styles/readable-site.css";
import "./assets/styles/studio.css";

const container = document.getElementById("root");
const isHostedSectionSite = Boolean(getHostedSiteKey(window.location.hostname));
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// The static build currently prerenders main-domain routes. Section subdomains
// select different content by hostname, so mount them on the client until the
// deployment provides matching host-specific HTML.
if (container?.hasChildNodes() && !isHostedSectionSite) {
  hydrateRoot(container, app);
} else if (container) {
  createRoot(container).render(app);
}
