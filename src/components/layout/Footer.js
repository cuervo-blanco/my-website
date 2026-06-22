import { Link } from "react-router-dom";
import {
  footerQuickLinks,
  legalLinks,
} from "../../config/site";
import useSiteNavigation from "../../hooks/useSiteNavigation";
import SocialLinks from "../common/SocialLinks";

function Footer() {
  const { getItemHref, handleNavigationClick } = useSiteNavigation();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="social-media">
          <h4>Follow Me</h4>
          <SocialLinks />
        </div>

        <div className="quick-links">
          <h4>Quick Links</h4>
          {footerQuickLinks.map((link) => (
            <Link
              key={link.label}
              to={getItemHref(link)}
              onClick={(event) => handleNavigationClick(event, link)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="legal">
          {legalLinks.map((link) => (
            <Link
              key={link.label}
              to={getItemHref(link)}
              onClick={(event) => handleNavigationClick(event, link)}
            >
              {link.label}
            </Link>
          ))}
          <p>&copy; {new Date().getFullYear()} Jaime Osvaldo</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
