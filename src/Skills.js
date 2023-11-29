import React from "react";
import Title from "./section-title";
import LogoScroller from "./LogoScroller";
import ImageGallery from './ImageGallery';

//Images
import image1 from "./img/image1.jpg";
import image2 from "./img/image2.jpg";
import image3 from "./img/image3.jpg";
import image4 from "./img/image4.jpg";
import image5 from "./img/image5.jpg";
import image6 from "./img/image6.jpg";
import image7 from "./img/image7.jpg";
import image8 from "./img/image8.jpg";
import image9 from "./img/image9.jpg";
import image10 from "./img/image10.jpg";
import image11 from "./img/image11.jpg";
import image12 from "./img/image12.jpg";
import image13 from "./img/image13.jpg";
import image14 from "./img/image14.jpg";
import image15 from "./img/image15.jpg";
import image16 from "./img/image16.jpg";
import image17 from "./img/image17.jpg";
import image18 from "./img/image18.jpg";

function Skills() {
  const images = [
    { src: image2, alt: 'A picture of Jaime 1' },
    { src: image16, alt: 'A picture of Jaime 2' },
    { src: image9, alt: 'A picture of Jaime 3' },
    { src: image4, alt: 'A picture of Jaime 4' },
    { src: image5, alt: 'A picture of Jaime 5' },
    { src: image6, alt: 'A picture of Jaime 6' },
    { src: image7, alt: 'A picture of Jaime 7' },
    { src: image8, alt: 'A picture of Jaime 8' },
    { src: image1, alt: 'A picture of Jaime 9' },
    { src: image10, alt: 'A picture of Jaime 10' },
    { src: image11, alt: 'A picture of Jaime 11' },
    { src: image12, alt: 'A picture of Jaime 12' },
    { src: image13, alt: 'A picture of Jaime 13' },
    { src: image14, alt: 'A picture of Jaime 14' },
    { src: image15, alt: 'A picture of Jaime 15' },
    { src: image3, alt: 'A picture of Jaime 16' },
    { src: image17, alt: 'A picture of Jaime 17' },
    { src: image18, alt: 'A picture of Jaime 18' }
    // ... more images
  ];
  return (
    <div id="skills-section">
    <div><ImageGallery images={images} /></div>
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
