import Button from "../common/Button";
import { softwareOverviewCards } from "../../data/software";

function AudioSoftwareTools({
  ctaLink = "/dev/projects",
  ctaLabel = "See Software Work",
}) {
  return (
    <section id="audio-software-tools" aria-labelledby="audio-software-heading">
      <div className="audio-software-shell">
        <header className="audio-software-header">
          <p className="audio-software-eyebrow">Audio Software & Tools</p>
          <h2 id="audio-software-heading">Practical software for people who work with sound</h2>
          <p>
            Alongside production sound, sound design, and live/theatre work, I
            build technical tools shaped by the same day-to-day problems that
            show up in real sessions, rehearsals, and post workflows.
          </p>
        </header>

        <div className="audio-software-card-grid">
          {softwareOverviewCards.map((card) => (
            <article key={card.title} className="audio-software-card">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>

        <div className="audio-software-cta">
          <Button buttonText={ctaLabel} buttonLink={ctaLink} />
        </div>
      </div>
    </section>
  );
}

export default AudioSoftwareTools;
