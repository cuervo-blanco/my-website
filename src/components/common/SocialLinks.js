import { socialLinks } from "../../config/site";
import SiteIcon from "./SiteIcon";

function SocialLinks({ className = "", iconOnly = false }) {
  return socialLinks.map((link) => (
    <a
      key={link.label}
      className={className}
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={link.label}
    >
      <SiteIcon name={link.icon} />
      {!iconOnly && <span>{link.label}</span>}
      {iconOnly && <span className="sr-only">{link.label}</span>}
    </a>
  ));
}

export default SocialLinks;
