import React from "react";
import Title from "../common/section-title";
import Button from "../common/Button";

function Services() {
  return (
    <div id="services">
      <div id="services-header"></div>
      <Title title="SERVICES" />
      <h2>
        <div>My Service is Guaranteed Presence.</div>
      </h2>
      <div id="services-container">
        {/* Production Sound */}
        <div id="service-1" className="services-block">
          <h1>Production Sound</h1>
          <hr></hr>
          <p>
            Got a film, interview, TV project, or something else brewing? Let's
            get that sound just right. I'm here to give your visuals the
            heartbeat they deserve. We can capture those perfect audio moments
            on-site or mix things up post-production. And you know, every
            project's got its own flavor, so I'm all ears to how you want to
            work this out.
          </p>
          <Button buttonText="Learn More" buttonLink="#contact" />

          {/* Sound Design */}
        </div>
        <div id="service-2" className="services-block">
          <h1>Sound Design</h1>
          <hr></hr>
          <p>
            Sound design is where the magic happens, and trust me, I live for
            that magic. It's like cooking up the perfect dish with the right
            ingredients. From the subtle sounds that make a scene to getting rid
            of the noise we don't want – I've got it covered. Foley? ADR? Mixing
            some beats? Let's make your audience feel every beat and whisper.{" "}
          </p>
          <Button buttonText="Learn More" buttonLink="#contact" />

          {/* General Sound Tech */}
        </div>
        <div id="service-3" className="services-block">
          <h1>Live Sound Tech</h1>
          <hr></hr>
          <p>
            Live events? That's where things heat up! Theaters, concerts,
            galleries – each has its own rhythm, and I'm here to tune in.
            Setting up the sound, getting those levels on point, and ensuring
            the vibe is just right is what I do. Whether it's a salsa beat or a
            deep bass drop, let's team up and give your audience an audio
            journey they won't forget.
          </p>
          <Button buttonText="Learn More" buttonLink="#contact" />
        </div>
      </div>
      <Title title="OTHER SERVICES" />
      <div id="other-services">
        <div id="other-service-1" className="other-services-block">
          <h1>Audio Consultations</h1>
          <hr></hr>
          <p>
            Require professional audio for your project, but don't know were to
            begin? I'm here to assist.
          </p>
          <Button buttonText="Learn More" buttonLink="#contact" />
        </div>
        <div id="other-service-2" className="other-services-block">
          <h1>Online Courses</h1>
          <hr></hr>
          <p>
            Want to delve into Production Sound or Audio Programming? Schedule a
            trial lesson today!
          </p>
          <Button buttonText="Learn More" buttonLink="#contact" />
        </div>
      </div>
    </div>
  );
}

export default Services;
