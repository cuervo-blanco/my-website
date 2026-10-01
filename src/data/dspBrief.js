// Compact public copy; the original essays remain in dspDictionary.js and the content archive.
export const dspConceptGroups = [
  { title: "Foundations", topics: [{ id: "digital-audio", title: "Digital Audio" }] },
  { title: "Core Operations", topics: [
    { id: "gain", title: "Gain" }, { id: "delay", title: "Delay" },
    { id: "panning", title: "Panning" }, { id: "filter", title: "Filter" },
    { id: "eq", title: "EQ" }, { id: "reverb", title: "Reverb" },
    { id: "convolution", title: "Convolution" }, { id: "cross-correlation", title: "Cross-Correlation" },
  ] },
  { title: "Dynamics", topics: [
    { id: "compression", title: "Compression" }, { id: "limiting", title: "Limiting" },
    { id: "noise-gate", title: "Noise Gate" }, { id: "expansion", title: "Expansion" },
    { id: "multiband-compression", title: "Multiband Compression" }, { id: "de-essing", title: "De-Essing" },
  ] },
  { title: "Nonlinear Color", topics: [
    { id: "saturation", title: "Saturation" }, { id: "distortion", title: "Distortion" },
    { id: "aliasing", title: "Aliasing" }, { id: "oversampling", title: "Oversampling" },
  ] },
  { title: "Modulation and Space", topics: [
    { id: "lfo", title: "LFO" }, { id: "modulation-effects", title: "Modulation Effects" },
    { id: "chorus", title: "Chorus" }, { id: "flanger", title: "Flanger" },
    { id: "phaser", title: "Phaser" }, { id: "time-based-effects", title: "Time-Based Effects" },
    { id: "spatial-effects", title: "Spatial Effects" },
  ] },
  { title: "Signal Flow", topics: [
    { id: "mixing", title: "Mixing" }, { id: "conclusion", title: "Signal Chain" },
  ] },
];

const firstMetric = (_, model) => model.readout.split(" · ")[0].replace(/\.$/, "");

export const dspBrief = {
  "digital-audio": {
    sentence: "Sample rate sets time resolution, while bit depth sets amplitude resolution.",
    note: "Signed fixed-point PCM samples; a playback converter reconstructs a continuous waveform.",
  },
  gain: {
    sentence: "Gain multiplies every sample, changing amplitude while preserving frequency.",
  },
  delay: {
    sentence: "A delay repeats a stored signal later, with feedback controlling how long the echoes last.",
    note: "Short teaching grid; delay in seconds = samples ÷ sample rate.",
    readout: ({ delay, feedback }) => `Echo spacing: ${delay} samples · First echo: ${feedback.toFixed(2)}× · Next: ${(feedback ** 2).toFixed(2)}×`,
  },
  panning: {
    sentence: "Panning distributes a mono signal between the left and right channels.",
    note: "Equal-power gains preserve channel power; room and speaker placement also affect loudness.",
  },
  filter: {
    sentence: "A filter passes some frequencies and attenuates others.",
    note: "48 kHz Butterworth biquad, Q = 1/√2; plot floor −60 dB.",
    readout: (_, model) => `At cutoff: ${model.charts[0].markers[0].points[0][1].toFixed(2)} dB`,
  },
  eq: {
    sentence: "EQ boosts or cuts a frequency band, with Q setting its width.",
    note: "One 48 kHz peaking biquad, using the Audio EQ Cookbook coefficients.",
    readout: (_, model) => `Center gain: ${model.charts[0].markers[0].points[0][1].toFixed(2)} dB`,
  },
  reverb: {
    sentence: "Reverb extends a sound with reflections that decay over time.",
    note: "Synthetic early taps and an exponential tail on a 20 ms grid; not a measured room.",
    readout: ({ decay, predelay }) => `−60 dB after ${decay.toFixed(1)} s · Pre-delay: ${predelay} ms`,
  },
  convolution: {
    sentence: "Convolution applies an impulse response to every input sample.",
    note: "Direct discrete convolution; zero padding keeps the display length fixed.",
    readout: ({ kernel, width }) => kernel === "echo"
      ? `Echo gain: 0.50× · Echo spacing: ${width} samples`
      : `Average length: ${width} samples · Sum of weights: 1.00`,
  },
  "cross-correlation": {
    sentence: "Cross-correlation finds the time shift where two signals match best.",
    note: "This convention gives a peak at −D for a delay of D; normalization uses full signal energies with zero padding.",
    readout: (_, model) => {
      const [lag, similarity] = model.charts[1].markers[0].points[0];
      return `Peak lag: ${lag} samples · Similarity: ${similarity.toFixed(2)}`;
    },
  },
  compression: {
    sentence: "Compression reduces level differences above a threshold.",
    note: "Hard knee and steady-state gain, without makeup gain, attack or release.",
  },
  limiting: {
    sentence: "A limiter reduces gain to keep peaks below a ceiling.",
    note: "Ideal steady-tone peak detection; no changing gain, lookahead or intersample peak detection.",
  },
  "noise-gate": {
    sentence: "A noise gate attenuates a signal when its level falls below a threshold.",
    note: "Synthetic measured envelopes and instant switching; no attack, hold, release or hysteresis.",
  },
  expansion: {
    sentence: "Downward expansion makes quiet passages quieter below a threshold.",
    note: "Hard knee, with no gain smoothing or attenuation limit; upward expansion behaves differently.",
  },
  "multiband-compression": {
    sentence: "Multiband compression controls the dynamics of separate frequency bands.",
    note: "Three ideal synthetic band envelopes; real processors need crossovers, detectors and gain smoothing, and sum audio rather than dB envelopes.",
    readout: firstMetric,
  },
  "de-essing": {
    sentence: "De-essing reduces excessive high-frequency sibilance.",
    note: "Synthetic split-band model, fixed at 6 kHz, without gain smoothing; broadband de-essing reduces the whole voice.",
    readout: firstMetric,
  },
  saturation: {
    sentence: "Saturation rounds waveform peaks and adds harmonics.",
    note: "Normalized tanh waveshaper; anti-alias filtering is omitted.",
  },
  distortion: {
    sentence: "Hard clipping flattens waveform peaks and adds harmonics.",
    note: "Instantaneous sample clipping; anti-alias filtering is omitted.",
  },
  aliasing: {
    sentence: "Frequencies above half the sample rate fold into lower frequencies when sampled.",
    note: "Unfiltered cosine sampling; the exact Nyquist boundary has phase-dependent ambiguity, so distinguishable frequencies must be strictly below it.",
  },
  oversampling: {
    sentence: "Oversampling raises the processing rate before filtering and returning to the output rate.",
    note: "Analytic cubic waveshaper and ideal filters; 2× handles its single extra harmonic, while real processors may need more and still alias.",
  },
  lfo: {
    sentence: "An LFO is a slow oscillation that moves a parameter over time.",
    note: "A control signal, usually not sent directly to the speakers.",
  },
  "modulation-effects": {
    sentence: "Modulation uses one signal to move a parameter of another.",
    note: "Tremolo with a 5 Hz carrier for visibility; audio carriers are normally faster.",
  },
  chorus: {
    sentence: "Chorus blends a signal with a delayed copy whose timing keeps changing.",
    note: "One voice, frozen at the selected time; continuous delay changes also shift pitch, while extra voices and stereo add complexity.",
  },
  flanger: {
    sentence: "Flanging mixes a short, changing delay with the original to create moving comb notches.",
    note: "0.5 Hz delay sweep, frozen at the selected time; plot floor −40 dB.",
  },
  phaser: {
    sentence: "A phaser mixes phase-shifted copies with the original to create moving notches.",
    note: "Static 48 kHz all-pass stages; moving the corner previews the sweep normally driven by an LFO.",
    readout: (_, model) => model.readout.split(" · ").slice(0, 2).join(" · "),
  },
  "time-based-effects": {
    sentence: "Time-based effects use stored audio to create echoes and tails.",
    note: "One feedback delay line with eight impulse repeats; a full reverb uses many interacting paths.",
  },
  "spatial-effects": {
    sentence: "Spatial processing changes the level and timing differences between the ears.",
    note: "Equal-power stereo gains and a time shift; head, ear and room filtering are omitted.",
  },
  mixing: {
    sentence: "Mixing adds weighted signals, whose phases can reinforce or cancel.",
    note: "Two 200 Hz tones without automatic clipping; real mixes have frequency-dependent cancellation.",
    readout: firstMetric,
  },
  conclusion: {
    sentence: "A signal chain combines simple operations, with each output feeding the next input.",
    note: "48 kHz one-pole low-pass; waveforms show steady-state tones after the startup transient.",
  },
};
