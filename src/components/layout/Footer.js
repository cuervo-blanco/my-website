import { Link } from "react-router-dom";
import { siteMetadata, socialLinks } from "../../config/site";

function Footer() {
  return (
    <>
      <footer className="minimal-footer">
        <div className="minimal-footer-links">
          <a href={siteMetadata.resumePath} target="_blank" rel="noopener noreferrer">Résumé</a>
          {socialLinks.map((link) => <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>)}
          <Link to="/terms">Terms & Privacy</Link>
        </div>
        <small>© {new Date().getFullYear()} Jaime Osvaldo</small>
      </footer>
    </>
  );
}

export default Footer;
