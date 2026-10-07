import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useSiteNavigation from "../../hooks/useSiteNavigation";
import useSectionSite from "../../hooks/useSectionSite";
import "../../assets/styles/navigation-refresh.css";

function Menu() {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const { getItemHref, handleNavigationClick } = useSiteNavigation();
  const { navigation } = useSectionSite();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setIsExpanded(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIsExpanded(false);
  }, [location.hash, location.pathname]);

  useEffect(() => {
    if (!isExpanded) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    mobileMenuRef.current?.querySelector("a")?.focus();
    return () => { document.body.style.overflow = previousOverflow; };
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
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  const renderNavigationLink = (item, mobile = false) => {
    const href = getItemHref(item);
    const isContact = item.label === "Contact";
    const isCurrent = item.type === "route" && location.pathname === item.to;
    const props = {
      className: `studio-nav__link${isContact ? " studio-nav__link--contact" : ""}`,
      "aria-current": isCurrent ? "page" : undefined,
      tabIndex: isExpanded && !mobile ? -1 : undefined,
    };
    const label = isContact && !mobile ? "Let's talk" : item.label;
    const content = <><span>{label}</span>{isContact && <span className="studio-nav__arrow" aria-hidden="true">↗</span>}</>;

    if (item.type === "external") {
      return <a {...props} href={href} target={item.target} rel={item.rel} onClick={() => setIsExpanded(false)}>{content}</a>;
    }
    return (
      <Link {...props} to={href} onClick={(event) => {
        handleNavigationClick(event, item);
        setIsExpanded(false);
      }}>{content}</Link>
    );
  };

  return (
    <header className={`studio-header${isExpanded ? " studio-header--expanded" : ""}`} onKeyDown={handleMenuKeyDown}>
      <div className="studio-header__inner">
        <Link className="studio-wordmark" to="/" aria-label="Jaime Osvaldo home" tabIndex={isExpanded ? -1 : undefined} onClick={() => setIsExpanded(false)}>
          <img src="/dragon-icon.svg" alt="" width="38" height="38" />
          <span>JAIME<span>OSVALDO</span></span>
        </Link>

        <nav className="studio-nav" aria-label="Primary">
          <ul>{navigation.map((item) => <li key={item.label}>{renderNavigationLink(item)}</li>)}</ul>
        </nav>

        <button
          type="button"
          className="studio-menu-toggle"
          ref={toggleRef}
          onClick={() => setIsExpanded((current) => !current)}
          aria-expanded={isExpanded}
          aria-controls="studio-mobile-menu"
          aria-label={isExpanded ? "Close menu" : "Open menu"}
        >
          <span>{isExpanded ? "Close" : "Menu"}</span>
          <span className="studio-menu-toggle__icon" aria-hidden="true"><i /><i /></span>
        </button>
      </div>

      {isExpanded && (
        <div id="studio-mobile-menu" className="studio-mobile-menu" ref={mobileMenuRef}>
          <p className="studio-mobile-menu__label">Explore</p>
          <nav aria-label="Mobile">
            <ul>{navigation.map((item) => <li key={item.label}>{renderNavigationLink(item, true)}</li>)}</ul>
          </nav>
          <p className="studio-mobile-menu__note">Sound · Software · Animation</p>
        </div>
      )}
    </header>
  );
}

export default Menu;
