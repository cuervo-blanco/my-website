// Educational level-domain models, checked against the Ableton and FabFilter manuals:
// https://www.ableton.com/en/manual/live-audio-effect-reference/
// https://www.fabfilter.com/help/pro-mb/using/basicbandcontrols
// https://www.fabfilter.com/help/pro-l/using/advancedsettings
// https://www.fabfilter.com/help/ffprods-manual.pdf
const POINT_COUNT = 129;
const db = (value) => `${value.toFixed(1)} dB`;
const ratioLabel = (value) => `${value.toFixed(1)}:1`;
const amplitude = (levelDb) => 10 ** (levelDb / 20);
const points = (fn, min = 0, max = 1) =>
  Array.from({ length: POINT_COUNT }, (_, index) => {
    const x = min + ((max - min) * index) / (POINT_COUNT - 1);
    return [x, fn(x, index)];
  });
const compress = (level, threshold, ratio) =>
  level <= threshold ? level : threshold + (level - threshold) / ratio;
const expandDownward = (level, threshold, ratio) =>
  level >= threshold ? level : threshold + (level - threshold) * ratio;
const horizontal = (level, min, max) => [[min, level], [max, level]];
const gaussian = (time, center, width) => Math.exp(-(((time - center) / width) ** 2));
const thresholdControl = (defaultValue = -24, min = -48, max = -6) => ({
  key: "threshold", label: "Threshold", min, max, step: 1, defaultValue, format: db,
});
const ratioControl = (defaultValue = 4, max = 12) => ({
  key: "ratio", label: "Ratio", min: 1, max, step: 0.5, defaultValue, format: ratioLabel,
});

const bandInfo = {
  low: { label: "Low band · below 250 Hz", style: "input" },
  mid: { label: "Mid band · 250 Hz–4 kHz", style: "secondary" },
  high: { label: "High band · above 4 kHz", style: "output" },
};
const bandEnvelope = (band, time) => {
  if (band === "low") return -38 + 26 * gaussian(time, 0.26, 0.13) + 21 * gaussian(time, 0.76, 0.14);
  if (band === "mid") return -35 + 19 * gaussian(time, 0.48, 0.19) + 14 * gaussian(time, 0.85, 0.08);
  return -49 + 29 * gaussian(time, 0.31, 0.04) + 32 * gaussian(time, 0.70, 0.045);
};
const timeChart = (title, description, lines, yDomain = [-60, 0]) => ({
  title, description, xLabel: "Time (ms)", yLabel: "Envelope level (dBFS)",
  xDomain: [0, 1000], yDomain, lines,
});

export const dynamicsDemos = {
  compression: {
    title: "Bend the level curve",
    description: "Lower the threshold or raise the ratio. Only levels above the threshold are reduced.",
    controls: [
      thresholdControl(), ratioControl(),
      { key: "inputLevel", label: "Input level", min: -60, max: 0, step: 1, defaultValue: -12, format: db },
    ],
    compute({ threshold = -24, ratio = 4, inputLevel = -12 } = {}) {
      const outputLevel = compress(inputLevel, threshold, ratio);
      const inputPeak = amplitude(inputLevel);
      const outputPeak = amplitude(outputLevel);
      const gainReduction = inputLevel - outputLevel;
      return {
        charts: [
          {
            title: "Input level becomes output level",
            description: "The dotted diagonal is unity gain. The dot shows your selected input level.",
            xLabel: "Input level (dBFS)", yLabel: "Output level (dBFS)",
            xDomain: [-60, 0], yDomain: [-60, 0],
            lines: [
              { label: "Unity gain", points: points((x) => x, -60, 0), style: "input", dashed: true },
              { label: "Compressed level", points: points((x) => compress(x, threshold, ratio), -60, 0), style: "output" },
            ],
            markers: [{ label: "Selected input", points: [[inputLevel, outputLevel]], style: "output" }],
          },
          {
            title: "Apply that gain to the waveform",
            description: "A constant-level tone keeps its shape while its amplitude changes.",
            xLabel: "Time (ms)", yLabel: "Amplitude",
            xDomain: [0, 20], yDomain: [-Math.max(0.05, inputPeak * 1.15), Math.max(0.05, inputPeak * 1.15)],
            lines: [
              { label: "Input", points: points((time) => inputPeak * Math.sin((time / 20) * Math.PI * 8), 0, 20), style: "input" },
              { label: "Compressed", points: points((time) => outputPeak * Math.sin((time / 20) * Math.PI * 8), 0, 20), style: "output" },
            ],
          },
        ],
        readout: `${db(inputLevel)} in → ${db(outputLevel)} out · ${db(gainReduction)} gain reduction`,
        equation: `Above ${db(threshold)}: output dB = threshold + (input dB − threshold) / ${ratio.toFixed(1)}`,
        note: "This is a hard-knee, steady-state compressor with no makeup gain. Attack and release determine how quickly a real compressor approaches this curve.",
      };
    },
  },
  limiting: {
    title: "Keep the peaks under a ceiling",
    description: "Raise the input peak, then lower the ceiling. The limiter turns the tone down before it exceeds that ceiling.",
    controls: [
      { key: "ceiling", label: "Output ceiling", min: -18, max: 0, step: 1, defaultValue: -6, format: db },
      { key: "inputPeak", label: "Input peak", min: -30, max: 6, step: 1, defaultValue: 0, format: db },
    ],
    compute({ ceiling = -6, inputPeak = 0 } = {}) {
      const sourcePeak = amplitude(inputPeak);
      const ceilingPeak = amplitude(ceiling);
      const gain = Math.min(1, ceilingPeak / sourcePeak);
      const outputPeak = Math.min(inputPeak, ceiling);
      const source = points((time) => sourcePeak * Math.sin((time / 20) * Math.PI * 8), 0, 20);
      return {
        charts: [{
          title: "Gain reduction preserves the tone's shape",
          description: "Compare the limited waveform with sample clipping, which flattens the peaks.",
          xLabel: "Time (ms)", yLabel: "Amplitude",
          xDomain: [0, 20], yDomain: [-Math.max(0.1, sourcePeak * 1.15), Math.max(0.1, sourcePeak * 1.15)],
          lines: [
            { label: "Input", points: source, style: "input" },
            { label: "Ideal limiter", points: source.map(([x, y]) => [x, y * gain]), style: "output" },
            { label: "Hard-clipping comparison", points: source.map(([x, y]) => [x, Math.max(-ceilingPeak, Math.min(y, ceilingPeak))]), style: "secondary", dashed: true },
          ],
        }],
        readout: `Output peak ${db(outputPeak)} · ${db(inputPeak - outputPeak)} gain reduction · gain ×${gain.toFixed(3)}`,
        equation: "gain = min(1, ceiling amplitude / detected peak amplitude); y[n] = gain × x[n]",
        note: "This ideal example knows the peak of a steady tone and uses one gain value. Real limiters use a detector, lookahead and changing gain; true-peak limiting also accounts for peaks between samples.",
      };
    },
  },
  "noise-gate": {
    title: "Open for the sound, close for the gaps",
    description: "Move the threshold through two sound envelopes. Set how far the gain drops while the gate is closed.",
    controls: [
      thresholdControl(-35, -55, -15),
      { key: "attenuation", label: "Closed attenuation", min: 0, max: 60, step: 1, defaultValue: 36, format: db },
    ],
    compute({ threshold = -35, attenuation = 36 } = {}) {
      const envelope = points((time) => -58 + 40 * gaussian(time / 1000, 0.25, 0.10) + 44 * gaussian(time / 1000, 0.72, 0.12), 0, 1000);
      const gain = envelope.map(([time, level]) => [time, level >= threshold ? 0 : -attenuation]);
      const gated = envelope.map(([time, level], index) => [time, level + gain[index][1]]);
      const actualOpenCount = envelope.filter(([, level]) => level >= threshold).length;
      return {
        charts: [
          timeChart("The envelope decides when to open", "The gate compares an envelope with the threshold, rather than testing each waveform zero crossing.", [
            { label: "Input envelope", points: envelope, style: "input" },
            { label: "Gated envelope", points: gated, style: "output" },
            { label: "Threshold", points: horizontal(threshold, 0, 1000), style: "secondary", dashed: true },
          ], [-120, 0]),
          {
            title: "The resulting gain control",
            description: "Open means unity gain; closed means the chosen attenuation.",
            xLabel: "Time (ms)", yLabel: "Gain (dB)", xDomain: [0, 1000], yDomain: [-60, 3],
            lines: [{ label: "Gate gain", points: gain, style: "output" }],
          },
        ],
        readout: `Gate open for ${Math.round((actualOpenCount / envelope.length) * 100)}% of this example · closed gain ${db(-attenuation)}`,
        equation: `gain dB = 0 if envelope ≥ ${db(threshold)}, otherwise ${db(-attenuation)}`,
        note: "The supplied curve represents an already measured envelope. This instant-switch example omits attack, hold, release and hysteresis, which make real gates transition smoothly.",
      };
    },
  },
  expansion: {
    title: "Make quiet passages quieter",
    description: "This downward expander stretches the level differences below its threshold, while louder material passes unchanged.",
    controls: [
      thresholdControl(), ratioControl(2, 4),
      { key: "inputLevel", label: "Input level", min: -60, max: 0, step: 1, defaultValue: -36, format: db },
    ],
    compute({ threshold = -24, ratio = 2, inputLevel = -36 } = {}) {
      const outputLevel = expandDownward(inputLevel, threshold, ratio);
      const floor = Math.min(-72, Math.floor(expandDownward(-60, threshold, ratio) / 12) * 12);
      return {
        charts: [{
          title: "Downward expansion transfer curve",
          description: "Below the threshold, each 1 dB drop in input produces a larger drop in output.",
          xLabel: "Input level (dBFS)", yLabel: "Output level (dBFS)", xDomain: [-60, 0], yDomain: [floor, 0],
          lines: [
            { label: "Unity gain", points: points((x) => x, -60, 0), style: "input", dashed: true },
            { label: "Downward expansion", points: points((x) => expandDownward(x, threshold, ratio), -60, 0), style: "output" },
          ],
          markers: [{ label: "Selected input", points: [[inputLevel, outputLevel]], style: "output" }],
        }],
        readout: `${db(inputLevel)} in → ${db(outputLevel)} out · ${db(inputLevel - outputLevel)} attenuation`,
        equation: `Below ${db(threshold)}: output dB = threshold + (input dB − threshold) × ${ratio.toFixed(1)}`,
        note: "This is downward expansion with a hard knee and no attenuation limit. Upward expansion instead increases levels above a threshold. Real expanders also smooth their gain over time.",
      };
    },
  },
  "multiband-compression": {
    title: "Control one frequency band at a time",
    description: "Choose a band, then compress its envelope. The other two bands retain their own levels.",
    controls: [
      { key: "band", label: "Band to compress", defaultValue: "low", options: [
        { value: "low", label: "Low · below 250 Hz" },
        { value: "mid", label: "Mid · 250 Hz–4 kHz" },
        { value: "high", label: "High · above 4 kHz" },
      ] },
      thresholdControl(), ratioControl(),
    ],
    compute({ band = "low", threshold = -24, ratio = 4 } = {}) {
      const selectedBand = Object.hasOwn(bandInfo, band) ? band : "low";
      const inputs = Object.fromEntries(Object.keys(bandInfo).map((key) => [key, points((time) => bandEnvelope(key, time / 1000), 0, 1000)]));
      const outputs = Object.fromEntries(Object.keys(bandInfo).map((key) => [key, inputs[key].map(([time, level]) => [time, key === selectedBand ? compress(level, threshold, ratio) : level])]));
      const peakReduction = Math.max(...inputs[selectedBand].map(([, level], index) => level - outputs[selectedBand][index][1]));
      return {
        charts: [
          timeChart(`Selected ${selectedBand} band`, "Compression starts only where this band's envelope exceeds the threshold.", [
            { label: "Selected band before", points: inputs[selectedBand], style: "input" },
            { label: "Selected band after", points: outputs[selectedBand], style: "output" },
            { label: "Threshold", points: horizontal(threshold, 0, 1000), style: "secondary", dashed: true },
          ]),
          timeChart("Three independent band envelopes", "Only the selected band's output changes with these settings.", Object.keys(bandInfo).map((key) => ({
            label: bandInfo[key].label, points: outputs[key], style: bandInfo[key].style,
          }))),
        ],
        readout: `${selectedBand[0].toUpperCase() + selectedBand.slice(1)} band: up to ${db(peakReduction)} gain reduction · other bands unchanged`,
        equation: "selected band output dB = threshold + (band input dB − threshold) / ratio, above threshold",
        note: "These are synthetic envelopes for three ideal frequency bands, with steady-state compression. A real processor uses crossover filters, separate detectors and gain smoothing before summing the audio bands; envelope dB values are not added together.",
      };
    },
  },
  "de-essing": {
    title: "Turn down the sibilant bursts",
    description: "Increase the high-band bursts, then set a threshold and ratio to control them while keeping the lower voice band intact.",
    controls: [
      thresholdControl(-24, -45, -10), ratioControl(6),
      { key: "sibilance", label: "Sibilant burst strength", min: 0, max: 100, step: 1, defaultValue: 85, format: (value) => `${value.toFixed(0)}%` },
    ],
    compute({ threshold = -24, ratio = 6, sibilance = 85 } = {}) {
      const high = points((time) => -50 + (sibilance / 100) * 38 * (gaussian(time / 1000, 0.25, 0.035) + gaussian(time / 1000, 0.703125, 0.04)), 0, 1000);
      const output = high.map(([time, level]) => [time, compress(level, threshold, ratio)]);
      const body = points((time) => -28 + 14 * gaussian(time / 1000, 0.30, 0.20) + 13 * gaussian(time / 1000, 0.74, 0.17), 0, 1000);
      const reduction = Math.max(...high.map(([, level], index) => level - output[index][1]));
      return {
        charts: [
          timeChart("The high-frequency detector", "Only the high-band envelope above the threshold triggers gain reduction.", [
            { label: "Sibilant band before", points: high, style: "input" },
            { label: "Sibilant band after", points: output, style: "output" },
            { label: "Threshold", points: horizontal(threshold, 0, 1000), style: "secondary", dashed: true },
          ]),
          timeChart("Split-band processing preserves the voice body", "The lower voice envelope remains unchanged while the high-band bursts are reduced.", [
            { label: "Voice body · below 6 kHz, unchanged", points: body, style: "secondary" },
            { label: "Sibilant band · above 6 kHz, processed", points: output, style: "output" },
          ]),
        ],
        readout: `Up to ${db(reduction)} high-band gain reduction · lower voice band unchanged`,
        equation: "high-band gain dB = compressed high-band envelope dB − original high-band envelope dB",
        note: "This synthetic, split-band example uses a fixed 6 kHz split and steady-state compression. Real de-essers filter their detector and smooth the gain; broadband de-essing applies that detected reduction to the whole voice instead.",
      };
    },
  },
};
