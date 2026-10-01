import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { scrollToElementById, scrollToTop } from "../lib/scroll";

function getNavigationHref(item) {
  if (!item) {
    return "/";
  }

  if (item.type === "external") {
    return item.href;
  }

  if (item.type === "section") {
    return `${item.to}#${item.sectionId}`;
  }

  return item.to;
}

export default function useSiteNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const getItemHref = useCallback((item) => getNavigationHref(item), []);

  const navigateToItem = useCallback(
    (item) => {
      if (!item) {
        return;
      }

      if (item.type === "external") {
        window.open(item.href, item.target || "_self", "noopener,noreferrer");
        return;
      }

      const href = getNavigationHref(item);

      if (item.type === "route") {
        if (location.pathname === item.to && !location.hash) {
          scrollToTop("smooth");
          return;
        }

        navigate(href);
        scrollToTop();
        return;
      }

      const targetHash = `#${item.sectionId}`;

      if (location.pathname === item.to) {
        if (location.hash !== targetHash) {
          navigate(href);
        }

        scrollToElementById(item.sectionId);
        return;
      }

      navigate(href);
    },
    [location.hash, location.pathname, navigate]
  );

  const handleNavigationClick = useCallback(
    (event, item) => {
      if (!item) {
        return;
      }

      if (item.type === "external") {
        return;
      }

      const targetHash = item.type === "section" ? `#${item.sectionId}` : "";

      if (item.type === "route") {
        if (location.pathname === item.to && !location.hash) {
          event.preventDefault();
          scrollToTop("smooth");
        }

        return;
      }

      if (location.pathname === item.to) {
        event.preventDefault();

        if (location.hash !== targetHash) {
          navigate(getNavigationHref(item));
        }

        scrollToElementById(item.sectionId);
      }
    },
    [location.hash, location.pathname, navigate]
  );

  return {
    getItemHref,
    handleNavigationClick,
    navigateToItem,
    scrollToTop,
  };
}
