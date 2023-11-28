import React from "react";
import Title from "./section-title";
import LogoScroller from "./LogoScroller";

function Skills() {
  return (
    <div id="skills-section">
      <Title title="WHAT CAN I DO?" />
      <div id="skills-container">
        <p>
          I'm very versatile when it comes to learning new tools. Heck, if it
          weren't for that curiosity that led me to read extensive manuals about
          equipment and specialized books on technology, I probably wouldn't be
          a Sound Person. My idea over the years has been to build a
          comprehensive skill set that would allow me to face any kind of
          situation. This meant learning CPR and First Aid, network-based audio,
          intercom systems, analog and digital mixers, open-source software, all
          kinds of DAWs, audio cleaning solutions, and video game-making
          software. I'm prepared for any kind of problem that presents itself,
          since after all, I am a problem solver. Technology is always new, but
          the basic building blocks remain the same, so if you don't see any of
          your favorite tools here, don't worry—I will figure it out.{" "}
        </p>
      </div>
      <LogoScroller />
    </div>
  );
}

export default Skills;
