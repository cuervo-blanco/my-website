const TAU = 2 * Math.PI;
const points = (fn, min = 0, max = 1, count = 129) => Array.from({ length: count }, (_, index) => {
  const x = min + (max - min) * index / (count - 1);
  return [x, fn(x)];
});
const clamp = (value, min, max) => Math.max(min, Math.min(value, max));
const khz = (value) => `${Number((value / 1000).toFixed(2))} kHz`;
// Signed fold preserves phase for sine waves; cosine is even in frequency.
export const foldedFrequency = (frequency, sampleRate) => ((frequency + sampleRate / 2) % sampleRate + sampleRate) % sampleRate - sampleRate / 2;
export function quantizeSample(value, bits) {
  const scale = 2 ** (bits - 1);
  return clamp(Math.round(value * scale), -scale, scale - 1) / scale;
}

const sampleRates = { key: "sampleRate", label: "Sample rate", defaultValue: 16000, options: [
  { value: 8000, label: "8 kHz" }, { value: 16000, label: "16 kHz" }, { value: 48000, label: "48 kHz" },
] };
const waveformChart = (title, description, lines, markers = []) => ({
  title, description, xLabel: "Time (ms)", yLabel: "Amplitude", xDomain: [0, 1], yDomain: [-1, 1],
  lines, markers,
});

export const nonlinearDemos = {
  "digital-audio": {
    title: "Digital audio, made visible",
    description: "Change the sample rate to place more dots in time. Change the bit depth to give each dot more possible amplitude values.",
    controls: [sampleRates, { key: "bits", label: "Bit depth", min: 2, max: 16, step: 1, defaultValue: 4, format: (value) => `${value} bits` }],
    compute: ({ sampleRate, bits }) => {
      const signal = (ms) => 0.8 * Math.sin(TAU * ms);
      const sampled = Array.from({ length: sampleRate / 1000 + 1 }, (_, n) => [n * 1000 / sampleRate, quantizeSample(signal(n * 1000 / sampleRate), bits)]);
      const rmsError = Math.sqrt(sampled.reduce((sum, [time, value]) => sum + (value - signal(time)) ** 2, 0) / sampled.length);
      return {
        charts: [waveformChart("Sampling and quantization", `A 1 kHz sine wave sampled at ${khz(sampleRate)} with ${bits}-bit signed quantization. Dots mark discrete sample values.`, [
          { label: "Continuous signal", points: points(signal), style: "input", dashed: true },
        ], [{ label: "Quantized samples", points: sampled, style: "output", stems: true }])],
        readout: `${sampleRate / 1000} sample intervals per millisecond · ${(2 ** bits).toLocaleString("en-US")} amplitude codes · RMS quantization error ${rmsError.toFixed(4)}`,
        equation: `t[n] = n / ${sampleRate}; step = 2 / ${2 ** bits}`,
        note: "Dots show stored samples, including both ends of the view. This illustrates signed fixed-point PCM; a playback converter reconstructs a continuous waveform from the samples.",
      };
    },
  },
  saturation: {
    title: "Saturation, made visible",
    description: "Turn up the drive to round the peaks, then blend the shaped waveform with the original using the mix control.",
    controls: [
      { key: "drive", label: "Drive", min: 1, max: 8, step: 0.25, defaultValue: 2, format: (value) => `${value.toFixed(2)}×` },
      { key: "mix", label: "Wet mix", min: 0, max: 1, step: 0.05, defaultValue: 1, format: (value) => `${Math.round(value * 100)}%` },
    ],
    compute: ({ drive, mix }) => {
      const shape = (x) => (1 - mix) * x + mix * Math.tanh(drive * x) / Math.tanh(drive);
      return {
        charts: [waveformChart("Soft clipping", "The input sine wave develops rounded, broader peaks as drive increases.", [
          { label: "Input", points: points((t) => 0.8 * Math.sin(TAU * 2 * t)), style: "input", dashed: true },
          { label: "Output", points: points((t) => shape(0.8 * Math.sin(TAU * 2 * t))), style: "output" },
        ])],
        readout: `A 0.80 input peak becomes ${shape(0.8).toFixed(2)} · ${Math.round(mix * 100)}% wet`,
        equation: `y = ${(1 - mix).toFixed(2)}x + ${mix.toFixed(2)} tanh(${drive.toFixed(2)}x) / tanh(${drive.toFixed(2)})`,
        note: "A normalized tanh waveshaper, matching the example below. The changing shape creates harmonics; this time-domain view does not model anti-alias filtering.",
      };
    },
  },
  distortion: {
    title: "Distortion, made visible",
    description: "Push the signal into a hard clipper. Drive increases the level before clipping; the ceiling sets where the peaks become flat.",
    controls: [
      { key: "drive", label: "Drive", min: 1, max: 5, step: 0.1, defaultValue: 2, format: (value) => `${value.toFixed(1)}×` },
      { key: "ceiling", label: "Clipping ceiling", min: 0.2, max: 1, step: 0.05, defaultValue: 0.7, format: (value) => `±${value.toFixed(2)}` },
    ],
    compute: ({ drive, ceiling }) => ({
      charts: [waveformChart("Hard clipping", `The driven waveform is clipped at positive and negative ${ceiling.toFixed(2)} amplitude.`, [
        { label: "Input", points: points((t) => 0.8 * Math.sin(TAU * 2 * t)), style: "input", dashed: true },
        { label: "Output", points: points((t) => clamp(drive * 0.8 * Math.sin(TAU * 2 * t), -ceiling, ceiling)), style: "output" },
        { label: "Ceiling", points: [[0, ceiling], [1, ceiling]], style: "secondary", dashed: true },
        { label: "Ceiling", points: [[0, -ceiling], [1, -ceiling]], style: "secondary", dashed: true },
      ])],
      readout: `Driven peak ${(0.8 * drive).toFixed(2)} · output limited to ±${ceiling.toFixed(2)}`,
      equation: `y = clamp(${drive.toFixed(1)}x, −${ceiling.toFixed(2)}, ${ceiling.toFixed(2)})`,
      note: "An instantaneous hard clipper reshapes individual samples. Its flat peaks create harmonics; anti-alias filtering is outside this illustration.",
    }),
  },
  aliasing: {
    title: "Aliasing, made visible",
    description: "Raise the tone above half the sample rate. A different, lower-frequency wave then fits exactly the same sample dots.",
    controls: [sampleRates, { key: "frequency", label: "Tone frequency", min: 500, max: 30000, step: 250, defaultValue: 12000, format: khz }],
    compute: ({ sampleRate, frequency }) => {
      const observed = Math.abs(foldedFrequency(frequency, sampleRate));
      const signal = (t) => 0.75 * Math.cos(TAU * frequency * t / 1000);
      const sampled = Array.from({ length: sampleRate / 1000 + 1 }, (_, n) => [n * 1000 / sampleRate, signal(n * 1000 / sampleRate)]);
      return {
        charts: [waveformChart("Different waves, identical samples", `A ${khz(frequency)} cosine and its ${khz(observed)} folded counterpart pass through the same sample values at ${khz(sampleRate)}.`, [
          { label: "Original tone", points: points(signal, 0, 1, 513), style: "input", dashed: true },
          { label: "Observed tone", points: points((t) => 0.75 * Math.cos(TAU * observed * t / 1000), 0, 1, 513), style: "output" },
        ], [{ label: "Samples", points: sampled, style: "secondary" }])],
        readout: `Nyquist limit ${khz(sampleRate / 2)} · observed ${khz(observed)}${frequency > sampleRate / 2 ? " · aliasing" : " · below or at Nyquist"}`,
        equation: `f_alias = |fold(${frequency}, ${sampleRate})| = ${observed} Hz`,
        note: "This demonstrates unfiltered cosine sampling. Frequencies strictly below Nyquist can be distinguished; the exact boundary has phase-dependent ambiguity. Anti-alias filters remove out-of-band content before sampling.",
      };
    },
  },
  oversampling: {
    title: "Oversampling, made visible",
    description: "A cubic waveshaper creates a third harmonic. Process at a higher sample rate, then low-pass filter before returning to 16 kHz to keep that harmonic from folding into the output.",
    controls: [
      { key: "factor", label: "Oversampling factor", defaultValue: 1, options: [1, 2, 4, 8].map((value) => ({ value, label: `${value}×` })) },
      { key: "frequency", label: "Input tone", min: 1000, max: 7000, step: 250, defaultValue: 3000, format: khz },
    ],
    compute: ({ factor, frequency }) => {
      const baseRate = 16000;
      const internalRate = factor * baseRate;
      const harmonic = frequency * 3;
      const internalFold = foldedFrequency(harmonic, internalRate);
      // Analytic cubic model: sin(wt) − 0.3 sin³(wt) = 0.775 sin(wt) + 0.075 sin(3wt).
      // Ideal reconstruction → cubic → ideal low-pass at base Nyquist → decimation.
      // https://developer.mozilla.org/en-US/docs/Web/API/WaveShaperNode/oversample
      // https://docs.scipy.org/doc/scipy/reference/generated/scipy.signal.resample_poly.html
      const survivesFilter = Math.abs(internalFold) < baseRate / 2;
      const fundamental = (t) => 0.775 * Math.sin(TAU * frequency * t / 1000);
      const component = (t, f) => 0.075 * Math.sin(TAU * f * t / 1000);
      const baseline = (t) => fundamental(t) + component(t, foldedFrequency(harmonic, baseRate));
      const output = (t) => fundamental(t) + (survivesFilter ? component(t, foldedFrequency(internalFold, baseRate)) : 0);
      const harmonicStatus = survivesFilter
        ? harmonic < baseRate / 2 ? `third harmonic retained at ${khz(harmonic)}` : `third harmonic aliases to ${khz(Math.abs(foldedFrequency(internalFold, baseRate)))}`
        : `third harmonic removed before downsampling`;
      return {
        charts: [waveformChart("Output at the original sample rate", `The 1× output is compared with ${factor}× oversampling and an ideal low-pass filter. ${harmonicStatus}.`, [
          { label: "1× output", points: points(baseline), style: "input", dashed: true },
          { label: `${factor}× output`, points: points(output), style: "output" },
          { label: "Fundamental", points: points(fundamental), style: "secondary", dashed: true },
        ])],
        readout: `Internal rate ${khz(internalRate)} · generated harmonic ${khz(harmonic)} · ${harmonicStatus}`,
        equation: "shape(x) = x − 0.3x³; process → low-pass → downsample",
        note: "An analytic cubic model with ideal filters. It generates only one extra harmonic, so 2× is sufficient for these tones. Real waveshapers and finite filters can need higher factors and still leave some aliasing.",
      };
    },
  },
};
