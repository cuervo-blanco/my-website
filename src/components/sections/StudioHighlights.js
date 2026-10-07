import { Link } from "react-router-dom";

function SignalDrawing() {
  return <svg className="studio-signal" viewBox="0 0 360 90" fill="none" aria-hidden="true"><path d="M0 45H30L37 32L44 59L52 17L60 73L68 30L75 54L84 42H104L112 23L120 66L128 8L136 82L145 24L152 61L159 38H183L190 31L198 62L206 16L214 73L222 32L230 49H250L258 24L266 68L274 9L282 81L290 29L298 62L306 40H360" stroke="currentColor" strokeWidth="1.5" /></svg>;
}

export default function StudioHighlights() {
  return <section className="studio-highlights studio-shell" aria-label="Selected work and resources">
    <div className="studio-highlight studio-highlight--listen">
      <div className="studio-highlight__top"><span className="studio-kicker">Film sound</span></div>
      <h2>La Obra</h2>
      <SignalDrawing />
      <p>Musique concrète and sound design from the short film.</p>
      <audio controls preload="none" aria-label="Listen to La Obra sound design"><source src="/audio-previews/OBRA_track1.mp3" type="audio/mpeg" /></audio>
    </div>
    <Link className="studio-highlight studio-highlight--code" to="/dev">
      <div className="studio-highlight__top"><span className="studio-kicker">Audio programming</span><span aria-hidden="true">↗</span></div>
      <div className="studio-code-art" aria-hidden="true"><span>in</span><i /><b>ƒ(x)</b><i /><span>out</span></div>
      <h2>DSP Dictionary</h2>
      <p>28 concepts with audio examples, controls, graphs, and formulas.</p>
      <span className="studio-highlight__link">View the dictionary <span aria-hidden="true">→</span></span>
    </Link>
    <Link className="studio-highlight studio-highlight--animation" to="/art">
      <div className="studio-highlight__top"><span className="studio-kicker">Animation</span><span aria-hidden="true">↗</span></div>
      <div className="studio-animation-preview"><img src="/media/dark-knites-poster.jpg" alt="Dark Knites animation still" width="1920" height="1080" loading="lazy" /><span aria-hidden="true">▶</span></div>
      <h2>Dark Knites</h2>
      <p>Logo animation and original sound by Jaime Osvaldo.</p>
      <span className="studio-highlight__link">Watch the animation <span aria-hidden="true">→</span></span>
    </Link>
  </section>;
}
