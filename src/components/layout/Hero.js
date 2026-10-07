import Godzilla from "../../assets/img/Godzilla.png";
import JaimeMoon from "../../assets/img/JaimeMoon.png";
import banner from "../../assets/img/banner-npem.png";
import Button from "../common/Button";
import WorkDestinations from "../common/WorkDestinations";
import { heroActions, homeHeroContent } from "../../config/site";
import { Link } from "react-router-dom";

const Hero = ({
  content = homeHeroContent,
  actions = heroActions,
  compact = false,
}) => {
  if (compact) {
    return (
      <section id="hero" className="studio-hero" aria-label="Jaime Osvaldo">
        <div className="hero-constellations" aria-hidden="true">
          <img src={banner} alt="" />
        </div>
        <div className="studio-hero__topline">
          <p><span className="studio-status-dot" /> New York, NY</p>
          <p>Sound / Software / Animation</p>
        </div>
        <div className="studio-hero__grid">
          <div className="studio-hero__copy">
            <h1>Jaime <span>Osvaldo</span></h1>
            <h2>Sound for film<br />and theatre.</h2>
            <p className="studio-hero__intro">Selected work in production sound, post-production, live audio, software development, and animation.</p>
            <div className="studio-hero__actions">
              <Link className="studio-button" to="/#credits">Film credits <span aria-hidden="true">↘</span></Link>
              <Link className="studio-text-link" to="/#portfolio-films">Audio samples <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
          <figure className="studio-hero__art">
            <div className="studio-hero__orbit" aria-hidden="true" />
            <span className="studio-hero__asterisk" aria-hidden="true">✳</span>
            <div className="studio-hero__image studio-hero__image--godzilla">
              <img src={Godzilla} alt="Godzilla terrorizing a city" width="853" height="900" loading="eager" fetchpriority="high" />
              <span>01 / Godzilla</span>
            </div>
            <div className="studio-hero__image studio-hero__image--jaime">
              <img src={JaimeMoon} alt="Jaime recording sound on the moon" width="952" height="900" loading="eager" />
              <span>02 / Jaime Osvaldo</span>
            </div>
            <figcaption>Godzilla and Jaime.</figcaption>
            <span className="studio-hero__coordinate" aria-hidden="true">40°42′ N · 74°00′ W</span>
          </figure>
        </div>
        <div className="studio-hero__bottom"><span className="studio-kicker">Areas of work</span><WorkDestinations /></div>
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
