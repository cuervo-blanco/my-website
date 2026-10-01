import { Link } from "react-router-dom";
import useSiteNavigation from "../../hooks/useSiteNavigation";

function Button({ buttonText, buttonLink }) {
  const { getItemHref, handleNavigationClick } = useSiteNavigation();
  const navigationItem = buttonLink.startsWith("/")
    ? {
        type: "route",
        to: buttonLink,
      }
    : {
        type: "section",
        to: "/",
        sectionId: buttonLink.replace("#", ""),
      };

  return (
    <div className="button-cta">
      <Link
        to={getItemHref(navigationItem)}
        onClick={(event) => handleNavigationClick(event, navigationItem)}
      >
        <span>{buttonText}</span>
        <span className="greater-than" aria-hidden="true">
          <span>&gt;</span>
        </span>
      </Link>
    </div>
  );
}

export default Button;
