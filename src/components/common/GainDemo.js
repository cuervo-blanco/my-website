import { useId, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const samples = Array.from({ length: 97 }, (_, index) => {
  const time = index / 96;
  return { x: 24 + time * 512, value: Math.sin(time * Math.PI * 4) * 0.42 };
});

function waveformPath(gain) {
  return samples
    .map(({ x, value }, index) =>
      `${index === 0 ? "M" : "L"}${x.toFixed(2)},${(100 - value * gain * 88).toFixed(2)}`
    )
    .join(" ");
}

function GainDemo({ headingLevel = 2, compact = false, title = "Gain", description = "Gain multiplies every sample, changing amplitude while preserving frequency." }) {
  const [gain, setGain] = useState(1);
  const id = useId();
  const reduceMotion = useReducedMotion();
  const Heading = `h${headingLevel}`;
  const decibels = gain === 0 ? "−∞" : (20 * Math.log10(gain)).toFixed(2);
  const gainLabel = `${gain.toFixed(1)}× / ${gain > 1 ? "+" : ""}${decibels} dB`;

  return (
    <figure className={`dsp-gain-demo${compact ? " dsp-demo-compact" : ""}`} data-dsp-concept="gain" aria-labelledby={`${id}-title`}>
      <figcaption>
        <Heading id={`${id}-title`}>{title}</Heading>
        <p>{description}</p>
      </figcaption>

      <div className="dsp-demo-legend" aria-hidden="true">
        <span className="dsp-demo-input-key">Input</span>
        <span className="dsp-demo-output-key">Output</span>
      </div>
      <svg
        className="dsp-demo-waveform"
        viewBox="0 0 560 210"
        role="img"
        aria-labelledby={`${id}-chart-title ${id}-chart-description`}
      >
        <title id={`${id}-chart-title`}>Input and output waveform comparison</title>
        <desc id={`${id}-chart-description`}>
          A sine wave multiplied by {gain.toFixed(1)}. Its output peak amplitude
          is {(0.42 * gain).toFixed(2)}, compared with an input peak of 0.42.
          Horizontal position represents time; vertical position represents
          amplitude.
        </desc>
        <path className="dsp-demo-grid" d="M24 12H536 M24 56H536 M24 100H536 M24 144H536 M24 188H536" />
        <path className="dsp-demo-axis" d="M24 12V188 M24 100H536" />
        <text className="dsp-demo-axis-label" x="5" y="17">1</text>
        <text className="dsp-demo-axis-label" x="5" y="104">0</text>
        <text className="dsp-demo-axis-label" x="0" y="190">−1</text>
        <text className="dsp-demo-axis-label" x="493" y="207">Time →</text>
        <path className="dsp-demo-input" d={waveformPath(1)} />
        <motion.path
          className="dsp-demo-output"
          initial={false}
          animate={{ d: waveformPath(gain) }}
          transition={{ duration: reduceMotion ? 0 : 0.2, ease: "easeOut" }}
        />
      </svg>

      <div className="dsp-demo-control">
        <label htmlFor={`${id}-gain`}>Gain multiplier</label>
        <output htmlFor={`${id}-gain`}>{gainLabel}</output>
        <input
          id={`${id}-gain`}
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={gain}
          aria-valuetext={gainLabel}
          onChange={(event) => setGain(Number(event.target.value))}
        />
      </div>
      <p className="dsp-demo-equation">y[n] = {gain.toFixed(1)} × x[n]</p>
    </figure>
  );
}

export default GainDemo;
