import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import jaimeLogo from "../../assets/img/Logo Jaime.png";
import { mainNavigation } from "../../config/site";
import useSiteNavigation from "../../hooks/useSiteNavigation";
import SiteIcon from "./SiteIcon";
import SocialLinks from "./SocialLinks";

function Menu() {
  const [showHeader, setShowHeader] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const lastScrollTopRef = useRef(0);
  const { getItemHref, handleNavigationClick } = useSiteNavigation();
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
    document.body.style.overflow = isExpanded ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isExpanded]);

  const handleNavigation = (event, item) => {
    handleNavigationClick(event, item);
    setIsExpanded(false);
  };

  return (
    <header id="menu" className={`header ${showHeader ? "" : "hide"}`}>
      <div id="menu-container" className={isExpanded ? "is-expanded" : ""}>
        <nav aria-label="Primary">
          <ul className="menu-list">
            {mainNavigation.map((item) => (
              <li key={item.label}>
                <Link
                  className="menu-link"
                  to={getItemHref(item)}
                  onClick={(event) => handleNavigation(event, item)}
                >
                  <SiteIcon name={item.icon} />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setIsExpanded((currentValue) => !currentValue)}
          id="menu-bars"
          aria-expanded={isExpanded}
          aria-controls="hidden-menu"
          aria-label={isExpanded ? "Close menu" : "Open menu"}
        >
          <SiteIcon name="menu" />
        </button>

        {isExpanded && (
          <div id="hidden-menu">
            <ul>
              <li id="moon-logo-menu">
                <img src={jaimeLogo} alt="Jaime Osvaldo moon logo" />
              </li>
              {mainNavigation.map((item) => (
                <li key={item.label}>
                  <Link
                    className="menu-link"
                    to={getItemHref(item)}
                    onClick={(event) => handleNavigation(event, item)}
                  >
                    <SiteIcon name={item.icon} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
              <li id="social-media-menu">
                <SocialLinks iconOnly />
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}

export default Menu;
