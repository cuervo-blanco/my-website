import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useSiteNavigation from "../../hooks/useSiteNavigation";
import useSectionSite from "../../hooks/useSectionSite";
import SiteIcon from "./SiteIcon";

function Menu() {
  const [showHeader, setShowHeader] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const lastScrollTopRef = useRef(0);
  const { getItemHref, handleNavigationClick } = useSiteNavigation();
  const { navigation } = useSectionSite();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsExpanded(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleScroll = useCallback(() => {
    if (window.innerWidth <= 768) {
      setShowHeader(true);
      return;
    }

    if (isExpanded) {
      setShowHeader(true);
      return;
    }

    const currentScrollTop =
      window.pageYOffset || document.documentElement.scrollTop;

    if (currentScrollTop <= 32) {
      setShowHeader(true);
      lastScrollTopRef.current = 0;
      return;
    }

    if (currentScrollTop < lastScrollTopRef.current) {
      setShowHeader(true);
    } else if (currentScrollTop - lastScrollTopRef.current > 12) {
      setShowHeader(false);
    }

    lastScrollTopRef.current = currentScrollTop <= 0 ? 0 : currentScrollTop;
  }, [isExpanded]);

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    setIsExpanded(false);
  }, [location.hash, location.pathname]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (isExpanded) document.body.style.overflow = "hidden";
    if (isExpanded) mobileMenuRef.current?.querySelector("a")?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isExpanded]);

  const handleMenuKeyDown = (event) => {
    if (!isExpanded) return;
    if (event.key === "Escape") {
      setIsExpanded(false);
      toggleRef.current?.focus();
    }
    if (event.key === "Tab") {
      const controls = [toggleRef.current, ...mobileMenuRef.current.querySelectorAll("a")];
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  };

  const handleNavigation = (event, item) => {
    handleNavigationClick(event, item);
    setIsExpanded(false);
  };

  const renderNavigationLink = (item) => {
    if (item.type === "external") {
      return (
        <a
          className="menu-link"
          href={getItemHref(item)}
          target={item.target}
          rel={item.rel}
          onClick={() => setIsExpanded(false)}
        >
          <span>{item.label}</span>
        </a>
      );
    }

    return (
      <Link
        className="menu-link"
        to={getItemHref(item)}
        onClick={(event) => handleNavigation(event, item)}
      >
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <header id="menu" onKeyDown={handleMenuKeyDown} className={`header ${showHeader ? "" : "hide"} ${isExpanded ? "menu-open" : ""}`}>
      <div id="menu-container" className={isExpanded ? "is-expanded" : ""}>
        <nav aria-label="Primary">
          <ul className="menu-list">
            {navigation.map((item) => (
              <li key={item.label}>
                {renderNavigationLink(item)}
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          ref={toggleRef}
          onClick={() => setIsExpanded((currentValue) => !currentValue)}
          id="menu-bars"
          aria-expanded={isExpanded}
          aria-controls="hidden-menu"
          aria-label={isExpanded ? "Close menu" : "Open menu"}
        >
          {isExpanded ? <span aria-hidden="true">×</span> : <SiteIcon name="menu" />}
        </button>

        {isExpanded && (
          <div id="hidden-menu" ref={mobileMenuRef}>
            <nav aria-label="Mobile">
              <ul>
                {navigation.map((item) => <li key={item.label}>{renderNavigationLink(item)}</li>)}
              </ul>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Menu;
