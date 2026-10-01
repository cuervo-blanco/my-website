import Godzilla from "../../assets/img/Godzilla.png";
import JaimeMoon from "../../assets/img/JaimeMoon.png";
import banner from "../../assets/img/banner-npem.png";
import Button from "../common/Button";
import { heroActions, homeHeroContent } from "../../config/site";

const Hero = ({
  content = homeHeroContent,
  actions = heroActions,
  compact = false,
}) => {
  if (compact) {
    return (
      <section id="hero" className="work-hero" aria-label="Jaime Osvaldo">
        <img className="work-hero__background" src={banner} alt="" />
        <h1>Jaime Osvaldo</h1>
        <div className="work-hero__images">
          <img src={Godzilla} alt="Godzilla terrorizing a city" width="853" height="900" loading="eager" />
          <img src={JaimeMoon} alt="Jaime recording sound on the moon" width="952" height="900" loading="eager" />
        </div>
      </section>
    );
  }
  return (
    <section id="hero">
      <div id="banner-about">
        <img src={banner} alt="Starry night with animal constellations" />
      </div>
      <div id="hero-container">
        <div id="hero-title">
          <p className="hero-eyebrow">{content.eyebrow}</p>
          <h1>{content.title}</h1>
          <h2>{content.subtitle}</h2>
          <p className="hero-summary">{content.summary}</p>
          <div className="hero-actions">
            {actions.map((action) => (
              <Button
                key={action.label}
                buttonText={action.label}
                buttonLink={action.to || `#${action.sectionId}`}
              />
            ))}
          </div>
        </div>
        <div id="hero-image">
          <img
            id="hero-godzilla"
            className="hero-picture"
            src={Godzilla}
            alt="Godzilla terrorizing a city"
            loading="eager"
          />
          <img
            id="hero-jaime"
            className="hero-picture"
            src={JaimeMoon}
            alt="Jaime in the moon"
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
