import { Link, useLocation } from "react-router-dom";
import { siteMetadata, socialLinks } from "../../config/site";
import useSectionSite from "../../hooks/useSectionSite";
import useSiteNavigation from "../../hooks/useSiteNavigation";
import "../../assets/styles/navigation-refresh.css";

function Footer() {
  const { navigation } = useSectionSite();
  const { getItemHref, handleNavigationClick } = useSiteNavigation();
  const { pathname } = useLocation();

  return (
    <footer className="studio-footer">
      <div className="studio-footer__inner">
        {pathname !== "/contact" ? <div className="studio-footer__contact">
          <div>
            <h2>Contact</h2>
          </div>
          <Link className="studio-footer__cta" to="/contact">Get in touch <span aria-hidden="true">↗</span></Link>
        </div> : null}

        <div className="studio-footer__directory">
          <div className="studio-footer__identity">
            <p className="studio-footer__name">Jaime Osvaldo<span>{siteMetadata.location}</span></p>
            <p>Film and theater sound, audio programming, and animation.</p>
          </div>
          <nav aria-label="Footer" className="studio-footer__links">
            <p className="studio-footer__eyebrow">Pages</p>
            {navigation.filter((item) => item.label !== "Contact").map((item) => item.type === "external"
              ? <a key={item.label} href={getItemHref(item)} target={item.target} rel={item.rel}>{item.label}</a>
              : <Link key={item.label} to={getItemHref(item)} onClick={(event) => handleNavigationClick(event, item)}>{item.label}</Link>)}
          </nav>
          <div className="studio-footer__links">
            <p className="studio-footer__eyebrow">Links</p>
            {socialLinks.map((link) => <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">{link.label} <span aria-hidden="true">↗</span></a>)}
            <a href={siteMetadata.resumePath} target="_blank" rel="noopener noreferrer">Résumé</a>
          </div>
        </div>

        <div className="studio-footer__bottom">
          <small>© {new Date().getFullYear()} Jaime Osvaldo</small>
          <a className="studio-footer__classic" href="/classic/">Visit the original site <span aria-hidden="true">↗</span></a>
          <Link to="/terms">Terms & Privacy</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
