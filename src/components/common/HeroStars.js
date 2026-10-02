import { useEffect, useRef, useState } from "react";
import { getHeroStarEngine } from "../../lib/heroStars";

export default function HeroStars() {
  const host = useRef(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!preference) return;
    const update = () => setReduceMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let container;
    const element = host.current;

    async function start() {
      const engine = await getHeroStarEngine();
      if (cancelled) return;
      container = await engine.load({
        element,
        id: "hero-stars",
        options: {
          fullScreen: { enable: false },
          fpsLimit: 24,
          detectRetina: false,
          pauseOnBlur: true,
          pauseOnOutsideViewport: true,
          particles: {
            number: { value: window.innerWidth < 600 ? 10 : 24, density: { enable: false } },
            paint: { color: { value: "#fff" } },
            shape: { type: "star" },
            size: { value: { min: 1.5, max: 3.5 } },
            opacity: {
              value: { min: 0.3, max: 0.7 },
              animation: { enable: !reduceMotion, speed: 0.1, sync: false },
            },
            move: { enable: !reduceMotion, speed: 0.15, direction: "none", outModes: { default: "out" } },
          },
        },
      });
      if (cancelled) container?.destroy();
    }

    // Decoration must never prevent visitors from opening the portfolio.
    start().catch(() => {});
    return () => { cancelled = true; container?.destroy(); };
  }, [reduceMotion]);

  return <div id="hero-stars" className="hero-stars" ref={host} aria-hidden="true" />;
}
