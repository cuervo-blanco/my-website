import { useLocation } from "react-router-dom";
import {
  getCurrentSite,
  getCurrentSiteKey,
  getFooterQuickLinks,
  getNavigationForSite,
  getSiteSwitchLinks,
} from "../config/siteSections";

export default function useSectionSite() {
  const location = useLocation();
  const hostname = typeof window !== "undefined" ? window.location.hostname : "";
  const siteKey = getCurrentSiteKey(location.pathname, hostname);

  return {
    site: getCurrentSite(location.pathname, hostname),
    siteKey,
    navigation: getNavigationForSite(siteKey, location.pathname),
    footerQuickLinks: getFooterQuickLinks(siteKey),
    siteSwitchLinks: getSiteSwitchLinks(siteKey),
  };
}
