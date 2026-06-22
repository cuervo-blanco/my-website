import Godzilla from "../../assets/img/Godzilla.png";
import JaimeMoon from "../../assets/img/JaimeMoon.png";
import banner from "../../assets/img/banner-npem.png";
import Button from "../common/Button";

const Hero = () => {
    return (
        <section id="hero">
        <div id="banner-about">
        <img src={banner} alt="Starry night with animal constellations" />
      </div>
            <div id="hero-container">
                <div id="hero-title">
                    <h1>Jaime O. Rivera Santana</h1>
                    <h2>Sound for any time, any place, and anyone... even Godzilla.</h2>
                    <div className="hero-actions">
                      <Button buttonText="Hear the Portfolio" buttonLink="/portfolio" />
                      <Button buttonText="Start a Project" buttonLink="#contact" />
                    </div>
                </div>
                <div id="hero-image">
                    <img id="hero-godzilla" className="hero-picture" src={Godzilla} alt="Godzilla terrorizing a city" loading="eager" />
                    <img id="hero-jaime" className="hero-picture" src={JaimeMoon} alt="Jaime in the moon" loading="eager" />
                </div>   
            </div>
            
        </section>
    );
};

export default Hero;
