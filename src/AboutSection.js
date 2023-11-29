import React from "react";
import jaimeOsvaldo002 from "./img/jaime-osvaldo-002.png";
import rice from "./img/rice7.png";
import PictureRow from "./PictureRow";
//import Title from './section-title';
import aboutBackground from "./img/about-background.png";
import jaimeLogo from "./img/Logo Jaime.png";
import shortStoryLong from "./img/picture-row-background.png";

// import jaimeOsvaldo006 from './img/jaime-osvaldo-006.jpeg';

const AboutSection = () => {
  return (
    <div id="about-section">
      <hr></hr>
      
      <img
        id="luna-logo"
        src={jaimeLogo}
        alt="Jaime's ant and sun logo, made by Lucía Castro <3"
      />
      <hr id="about-link"></hr>
      <div id="about-container">
        <div id="about-background">
          <img
            src={aboutBackground}
            alt="Background of constellations of a Lion, Bird and Squirrel"
          ></img>
        </div>
        <div id="about-text">
          <div id="about-paragraph">
            <div id="paragraph">
              <div id="sections">
                <div id="section-1">
                  <div id="who-am-i" className="intro-text">
                    WHO AM I?
                  </div>
                  <br />
                  Long story short...
                  <br />
                  <br />
                  <div id="about-poem">
                    <div id="poem-text">
                      Born.
                      <br />
                      <br />
                      Discover sound. Discover tech. Discover cinema.
                      <br />
                      <br /> Think cinema. Use tech. Make Sound.
                    </div>
                  </div>
                  <br />
                  <br />
                  After 5 Years (1825 rice bowls) and an Audiovisual
                  Communications degree, plus 3 more years (1095 rice bowls) and
                  an Audiovisual Sound Prod. & Design degree, here I am. A
                  self-taught audio nerd knee-deep in the world of
                  <div className="intro-text">SOUND FOR FILM & TV.</div>
                </div>
                <div id="section-2">
                  <div id="jaime-about-1">
                    <img
                      src={jaimeOsvaldo002}
                      alt="Jaime Osvaldo smiling at the camera"
                    />
                  </div>
                  Got questions about 1’s and 0’s? Need to know how to sit an
                  elephant for a shoot? I'm your guy. My job? Making sure every
                  sound fits, every line is clear, and all equipment is
                  calibrated for the next shot. It's about crafting that
                  <div className="intro-text">DESIGN & PRODUCTION</div>
                  where Hearing and Seeing unite - the everyday grind and
                  dedication of the team behind the scenes. I'm part of that.{" "}
                  <br />
                  請隨時聯繫我，練習中文會很好。
                </div>
              </div>
            </div>
          </div>
          <div id="images">
            <img
              id="jaime-about"
              src={jaimeOsvaldo002}
              alt="Jaime Osvaldo smiling at the camera"
            />
          </div>
        </div>
      </div>
      <div id="rice-bowl">
        <div id="quote-about">
          <h2>
            “I felt once more how simple and frugal a thing is happiness: the
            gentle hum of the Ocean's soundscape, a timeless Sennheiser
            microphone, a bowl of warm rice, the sound of laughter. Nothing
            else.”
          </h2>
          <p>Nikos Kazantzakis (if he was a sound guy)</p>
        </div>
        <img src={rice} alt="Rice bowl" />
      </div>
      <div id="map">
        <h1>Currently based in...</h1>

        <iframe
          title="myMap"
          src="https://snazzymaps.com/embed/547564"
          width="100%"
          height="600px"
        ></iframe>
        <p>
          Available to travel to any corner of the United States, throughout the
          Americas and the entire Globe...
        </p>
      </div>

      <PictureRow />

      <div id="conclusion-paragraph">
        <div id="short-story-background">
          <img
            src={shortStoryLong}
            alt="Background of constellations of a frog and a bird"
          ></img>
        </div>
        <h2>Short story long</h2>
        <hr />

        <p>
          I live in Queens, New York. I was raised in Jayuya, Puerto Rico. I
          graduated from a B.A. in Audiovisual Communications around 2018 from
          the UPR and I spent 3 Years in Cuba preparing myself as a Sound
          Professional for Film and Television. I've done almost everything in
          the Sound World, from Boom Operating to designing custom Audio
          Effects, but I have also had experience in the Camera, Production and
          Art departments. Which means that my capacitities are well-rounded and
          well-prepared for anything, because spontaneity is the nature of a
          movie set... On the other hand, I am a worker just like any other and
          I enjoy coming back home at the end of the day and being able to
          prepare me some nice food 🍚 🍕 🥑 Because when I'm not doing sound I
          love to cook, code websites (like this one) and enjoy music.{" "}
        </p>
      </div>
    </div>
  );
};

export default AboutSection;
