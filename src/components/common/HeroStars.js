import { useEffect, useRef, useState } from "react";
import { getHeroStarEngine } from "../../lib/heroStars";

const paletteTokens = ["mint", "lilac", "pink", "gold", "green", "orange"];

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
    const styles = getComputedStyle(document.documentElement);
    const colors = paletteTokens.map((name) => styles.getPropertyValue(`--constellation-${name}`).trim());

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
            number: { value: window.innerWidth < 600 ? 12 : 26, density: { enable: false } },
            color: { value: colors },
            shape: { type: "star" },
            size: { value: { min: 1.5, max: 4 } },
            opacity: {
              value: { min: 0.2, max: 0.65 },
              animation: { enable: !reduceMotion, speed: 0.15, sync: false },
            },
            move: { enable: !reduceMotion, speed: 0.12, direction: "none", outModes: { default: "out" } },
          },
        },
      });
      if (cancelled) container?.destroy();
    }

    // The original constellation artwork remains visible if the effect cannot load.
    start().catch(() => {});
    return () => { cancelled = true; container?.destroy(); };
  }, [reduceMotion]);

  return <div id="hero-stars" className="hero-stars" ref={host} aria-hidden="true" />;
}
