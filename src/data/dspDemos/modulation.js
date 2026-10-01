// Small, deterministic models for the dictionary's interactive diagrams.
// Variable-delay and all-pass models follow Julius O. Smith's
// Physical Audio Signal Processing:
// https://www.dsprelated.com/freebooks/pasp/Time_Varying_Delay_Effects.html
// https://www.dsprelated.com/freebooks/pasp/Phasing_First_Order_Allpass_Filters.html
const TAU = 2 * Math.PI;
const POINT_COUNT = 129;
const SAMPLE_RATE = 48000;
const points = (start, end, valueAt) => Array.from({ length: POINT_COUNT }, (_, index) => {
  const x = start + (end - start) * index / (POINT_COUNT - 1);
  return [x, valueAt(x)];
});
const percent = (value) => `${Math.round(value * 100)}%`;
const hz = (value) => `${Number(value).toFixed(1)} Hz`;
const seconds = (value) => `${Number(value).toFixed(2)} s`;
const milliseconds = (value) => `${Number(value).toFixed(1)} ms`;
const numberControl = (key, label, min, max, step, defaultValue, format) => ({
  key, label, min, max, step, defaultValue, format,
});
const line = (label, plottedPoints, style, dashed = false) => ({
  label, points: plottedPoints, style, dashed,
});

function delayChart({ center, depth, rate, time, duration }) {
  const delayAt = (t) => center + depth * Math.sin(TAU * rate * t);
  return {
    title: 'The LFO moves the delay',
    description: `Delay time follows a ${rate.toFixed(2)} Hz sine wave. The dot marks the selected time.`,
    xLabel: 'Time (s)', yLabel: 'Delay (ms)',
    xDomain: [0, duration], yDomain: center === 20 ? [10, 30] : [0, 5],
    lines: [line('Delay time', points(0, duration, delayAt), 'output')],
    markers: [{ label: 'Selected time', points: [[time, delayAt(time)]], style: 'secondary' }],
  };
}

function lowPassResponse(frequency, cutoff) {
  const a = Math.exp(-TAU * cutoff / SAMPLE_RATE);
  const omega = TAU * frequency / SAMPLE_RATE;
  const real = 1 - a * Math.cos(omega);
  const imaginary = a * Math.sin(omega);
  const denominator = real * real + imaginary * imaginary;
  return {
    magnitude: (1 - a) / Math.sqrt(denominator),
    phase: -Math.atan2(imaginary, real),
  };
}

function allPassResponse(frequency, corner, stages) {
  const tangent = Math.tan(Math.PI * corner / SAMPLE_RATE);
  const a = (tangent - 1) / (tangent + 1);
  const omega = TAU * frequency / SAMPLE_RATE;
  const cosine = Math.cos(omega);
  const sine = Math.sin(omega);
  const numeratorReal = a + cosine;
  const numeratorImaginary = -sine;
  const denominatorReal = 1 + a * cosine;
  const denominatorImaginary = -a * sine;
  const denominator = denominatorReal ** 2 + denominatorImaginary ** 2;
  const real = (numeratorReal * denominatorReal + numeratorImaginary * denominatorImaginary) / denominator;
  const imaginary = (numeratorImaginary * denominatorReal - numeratorReal * denominatorImaginary) / denominator;
  return {
    magnitude: Math.hypot(real, imaginary) ** stages,
    phase: Math.atan2(imaginary, real) * stages,
  };
}

export const modulationDemos = {
  lfo: {
    title: 'A slow wave that moves a knob',
    description: 'Change the rate to fit more cycles into the same four seconds. Depth changes how far the control moves.',
    controls: [
      numberControl('rate', 'LFO rate', 0.1, 2, 0.1, 0.5, hz),
      numberControl('depth', 'Depth', 0, 1, 0.05, 0.75, percent),
    ],
    compute({ rate, depth }) {
      return {
        charts: [{
          title: 'LFO control signal', description: `A ${rate} Hz oscillator spans ${rate * 4} cycles in four seconds, with depth ${depth}.`,
          xLabel: 'Time (s)', yLabel: 'Control value', xDomain: [0, 4], yDomain: [-1, 1],
          lines: [line('LFO', points(0, 4, (t) => depth * Math.sin(TAU * rate * t)), 'output')],
        }],
        readout: `${(rate * 4).toFixed(1)} cycles in 4 seconds · one cycle takes ${(1 / rate).toFixed(2)} seconds.`,
        equation: `control(t) = ${depth.toFixed(2)} × sin(2π × ${rate.toFixed(1)} × t)`,
        note: 'This is a control signal. An LFO usually moves a parameter instead of going directly to the speakers.',
      };
    },
  },
  'modulation-effects': {
    title: 'One signal moves another',
    description: 'Here an LFO moves gain to make tremolo. Rate sets the rhythm; depth sets how much the signal fades.',
    controls: [
      numberControl('rate', 'Modulation rate', 0.25, 2, 0.25, 1, hz),
      numberControl('depth', 'Modulation depth', 0, 1, 0.05, 0.75, percent),
    ],
    compute({ rate, depth }) {
      const gainAt = (t) => 1 - depth / 2 + depth / 2 * Math.sin(TAU * rate * t);
      const inputAt = (t) => 0.65 * Math.sin(TAU * 5 * t);
      return {
        charts: [{
          title: 'The gain envelope', description: `Gain moves between ${(1 - depth).toFixed(2)} and 1 at ${rate} Hz.`,
          xLabel: 'Time (s)', yLabel: 'Gain (×)', xDomain: [0, 2], yDomain: [0, 1.1],
          lines: [line('Moving gain', points(0, 2, gainAt), 'secondary')],
        }, {
          title: 'The envelope multiplies the waveform', description: 'The output is the input multiplied by the moving gain at every point.',
          xLabel: 'Time (s)', yLabel: 'Amplitude', xDomain: [0, 2], yDomain: [-0.8, 0.8],
          lines: [line('Input', points(0, 2, inputAt), 'input', true), line('Output', points(0, 2, (t) => inputAt(t) * gainAt(t)), 'output')],
        }],
        readout: `Gain moves from ${(1 - depth).toFixed(2)}× to 1.00× · ${rate.toFixed(2)} swells per second.`,
        equation: 'gain(t) = 1 − depth/2 + (depth/2) × sin(2π × rate × t); y(t) = gain(t) × x(t)',
        note: 'The display uses a slow 5 Hz carrier so the multiplication is visible. Audio tremolo normally modulates a signal in the audible range.',
      };
    },
  },
  chorus: {
    title: 'A copy that keeps arriving differently',
    description: 'An LFO moves one delayed copy around 20 ms. Scrub time to see how mixing that copy with the original changes the response.',
    controls: [
      numberControl('depth', 'Delay movement', 0, 8, 0.5, 5, milliseconds),
      numberControl('rate', 'LFO rate', 0.1, 2, 0.1, 0.5, hz),
      numberControl('time', 'Scrub time', 0, 4, 0.025, 0.5, seconds),
    ],
    compute({ depth, rate, time }) {
      const delay = 20 + depth * Math.sin(TAU * rate * time);
      const magnitudeAt = (frequency) => {
        const phase = TAU * frequency * delay / 1000;
        return Math.hypot(0.5 + 0.5 * Math.cos(phase), 0.5 * Math.sin(phase));
      };
      return {
        charts: [delayChart({ center: 20, depth, rate, time, duration: 4 }), {
          title: 'The blend at this instant', description: `Equal dry and wet signals are mixed with the delay frozen at ${delay.toFixed(2)} ms.`,
          xLabel: 'Frequency (Hz)', yLabel: 'Magnitude (×)', xDomain: [0, 400], yDomain: [0, 1.1],
          lines: [line('Dry', points(0, 400, () => 1), 'input', true), line('Dry + delayed copy', points(0, 400, magnitudeAt), 'output')],
        }],
        readout: `At ${time.toFixed(2)} s: ${delay.toFixed(2)} ms delay · first cancellation at ${(500 / delay).toFixed(1)} Hz.`,
        equation: 'D(t) = 20 ms + depth × sin(2π × rate × t); y(t) = 0.5x(t) + 0.5x(t − D(t))',
        note: 'One chorus voice, with a frozen response at the selected time. A continuously changing delay also changes pitch; multiple voices and stereo widening add more complexity.',
      };
    },
  },
  flanger: {
    title: 'Short delays make a moving comb',
    description: 'Scrub a two-second LFO sweep. A short delay moves the comb teeth; feedback strengthens the peaks.',
    controls: [
      numberControl('depth', 'Delay movement', 0, 2, 0.1, 1.5, milliseconds),
      numberControl('feedback', 'Feedback', 0, 0.75, 0.05, 0.3, percent),
      numberControl('time', 'Scrub time', 0, 2, 0.025, 0.5, seconds),
    ],
    compute({ depth, feedback, time }) {
      const delay = 2.5 + depth * Math.sin(TAU * 0.5 * time);
      const gainDbAt = (frequency) => {
        const phase = TAU * frequency * delay / 1000;
        const numerator = Math.hypot(1 + Math.cos(phase), Math.sin(phase));
        const denominator = Math.hypot(1 - feedback * Math.cos(phase), feedback * Math.sin(phase));
        return Math.max(-40, 20 * Math.log10(Math.max(1e-12, numerator / denominator)));
      };
      return {
        charts: [delayChart({ center: 2.5, depth, rate: 0.5, time, duration: 2 }), {
          title: 'A frozen comb response', description: `Frequency response for the selected ${delay.toFixed(2)} ms delay with ${percent(feedback)} feedback.`,
          xLabel: 'Frequency (Hz)', yLabel: 'Gain (dB)', xDomain: [0, 2000], yDomain: [-40, 20],
          lines: [line('Dry', points(0, 2000, () => 0), 'input', true), line('Flanger', points(0, 2000, gainDbAt), 'output')],
        }],
        readout: `Delay: ${delay.toFixed(2)} ms · first notch: ${(500 / delay).toFixed(0)} Hz · notch spacing: ${(1000 / delay).toFixed(0)} Hz.`,
        equation: 'y[n] = x[n] + x[n − D] + feedback × y[n − D]',
        note: 'The delay sweeps at 0.5 Hz. This chart freezes its response at the scrubbed time; gain below −40 dB is drawn at the chart floor.',
      };
    },
  },
  phaser: {
    title: 'Phase changes first; notches come from the mix',
    description: 'Sweep the all-pass corner and mix it with the original. The all-pass branch keeps its magnitude; the blend creates cancellation.',
    controls: [
      numberControl('corner', 'All-pass corner', 150, 2000, 50, 500, (value) => `${value} Hz`),
      numberControl('mix', 'Wet mix', 0, 1, 0.05, 0.5, percent),
      { key: 'stages', label: 'All-pass stages', defaultValue: 4, options: [{ value: 2, label: '2 stages' }, { value: 4, label: '4 stages' }, { value: 6, label: '6 stages' }] },
    ],
    compute({ corner, mix, stages }) {
      const stageCount = Number(stages);
      const responseAt = (frequency) => allPassResponse(frequency, corner, stageCount);
      const blendAt = (frequency) => {
        const response = responseAt(frequency);
        return Math.hypot(1 - mix + mix * response.magnitude * Math.cos(response.phase), mix * response.magnitude * Math.sin(response.phase));
      };
      return {
        charts: [{
          title: 'All-pass magnitude and mixed magnitude', description: 'The all-pass branch remains at unity gain; only its mixture with the dry branch creates notches.',
          xLabel: 'Frequency (Hz)', yLabel: 'Magnitude (×)', xDomain: [0, 6000], yDomain: [0, 1.1],
          lines: [line('All-pass alone', points(0, 6000, (f) => responseAt(f).magnitude), 'secondary', true), line('Dry/wet blend', points(0, 6000, blendAt), 'output')],
        }, {
          title: 'The all-pass chain changes phase', description: `The unwrapped phase of ${stageCount} first-order digital all-pass stages at a 48 kHz sample rate.`,
          xLabel: 'Frequency (Hz)', yLabel: 'Phase (degrees)', xDomain: [0, 6000], yDomain: [-1080, 0],
          lines: [line('Dry phase', points(0, 6000, () => 0), 'input', true), line('All-pass phase', points(0, 6000, (f) => responseAt(f).phase * 180 / Math.PI), 'output')],
        }],
        readout: `${stageCount} all-pass stages · corner: ${corner} Hz · equal dry/wet gives the deepest cancellation.`,
        equation: 'A(z) = (a + z⁻¹)/(1 + a z⁻¹); H(z) = (1 − mix) + mix × A(z)^stages',
        note: 'A static 48 kHz digital all-pass model. A phaser sweeps these filter coefficients over time, often with an LFO; move the corner control to explore that sweep.',
      };
    },
  },
  'time-based-effects': {
    title: 'Memory turns one impulse into repeats',
    description: 'Move the delay to space out echoes. Wet level sets the first repeat; feedback decides how much survives into the next one.',
    controls: [
      numberControl('delay', 'Delay time', 125, 400, 25, 250, (value) => `${value} ms`),
      numberControl('feedback', 'Feedback', 0, 0.85, 0.05, 0.6, percent),
      numberControl('wet', 'First echo level', 0, 1, 0.05, 0.75, percent),
    ],
    compute({ delay, feedback, wet }) {
      const impulseTime = 100;
      const echoes = Array.from({ length: 9 }, (_, index) => [impulseTime + index * delay, index === 0 ? 1 : wet * feedback ** (index - 1)]);
      const stems = [[0, 0], ...echoes.flatMap(([t, level]) => [[t, 0], [t, level], [t, 0]]), [3500, 0]];
      return {
        charts: [{
          title: 'The impulse response of an echo', description: `A single impulse at 100 ms produces eight echoes spaced ${delay} ms apart. Each repeat retains ${percent(feedback)} of the previous echo.`,
          xLabel: 'Time (ms)', yLabel: 'Impulse amplitude', xDomain: [0, 3500], yDomain: [0, 1.1],
          lines: [line('Input impulse', [[0, 0], [impulseTime, 0], [impulseTime, 1], [impulseTime, 0], [3500, 0]], 'input', true), line('Output impulses', stems, 'output')],
          markers: [{ label: 'Echo peaks', points: echoes.slice(1), style: 'output' }],
        }],
        readout: `First echo: ${delay} ms later at ${wet.toFixed(2)}× · second echo: ${(wet * feedback).toFixed(2)}× · third: ${(wet * feedback * feedback).toFixed(2)}×.`,
        equation: 'echo[n] = x[n − D] + feedback × echo[n − D]; y[n] = x[n] + wet × echo[n]',
        note: 'Impulse amplitudes are drawn as stems, with eight repeats shown. This is one feedback delay line; a full reverb uses many interacting paths.',
      };
    },
  },
  'spatial-effects': {
    title: 'Two ears can receive different information',
    description: 'Move level toward either side, then delay the right channel. A short synthetic burst makes both differences visible.',
    controls: [
      numberControl('pan', 'Level position', -1, 1, 0.05, 0, (value) => value === 0 ? 'Center' : `${Math.round(Math.abs(value) * 100)}% ${value < 0 ? 'left' : 'right'}`),
      numberControl('delay', 'Right-channel delay', 0, 1, 0.05, 0.5, milliseconds),
      numberControl('frequency', 'Burst frequency', 200, 1000, 100, 500, (value) => `${value} Hz`),
    ],
    compute({ pan, delay, frequency }) {
      const angle = (pan + 1) * Math.PI / 4;
      const left = Math.cos(angle);
      const right = Math.sin(angle);
      const burstAt = (ms) => 0.8 * Math.sin(TAU * frequency * ms / 1000) * Math.exp(-(((ms - 3) / 1.1) ** 2));
      return {
        charts: [{
          title: 'Left and right channel waveforms', description: `Left gain is ${left.toFixed(2)} and right gain is ${right.toFixed(2)}. The right signal arrives ${delay.toFixed(2)} ms later.`,
          xLabel: 'Time (ms)', yLabel: 'Amplitude', xDomain: [0, 8], yDomain: [-0.9, 0.9],
          lines: [line('Left channel', points(0, 8, (ms) => left * burstAt(ms)), 'input'), line('Right channel', points(0, 8, (ms) => right * burstAt(ms - delay)), 'output')],
        }],
        readout: `Left: ${left.toFixed(2)}× · right: ${right.toFixed(2)}× · right arrives ${delay.toFixed(2)} ms later.`,
        equation: 'L(t) = cos(θ) × x(t); R(t) = sin(θ) × x(t − D); θ = (pan + 1)π/4',
        note: 'A stereo level/time example using equal-power gains. It does not model head and ear filtering or a room, which binaural processing also needs.',
      };
    },
  },
  mixing: {
    title: 'The output is the sum',
    description: 'Adjust two faders and the phase between two matching tones. Equal levels can reinforce or cancel each other.',
    controls: [
      numberControl('gainA', 'Signal A gain', 0, 1.5, 0.05, 0.75, (value) => `${value.toFixed(2)}×`),
      numberControl('gainB', 'Signal B gain', 0, 1.5, 0.05, 0.75, (value) => `${value.toFixed(2)}×`),
      numberControl('phase', 'Signal B phase', 0, 180, 5, 90, (value) => `${value}°`),
    ],
    compute({ gainA, gainB, phase }) {
      const radians = phase * Math.PI / 180;
      const aAt = (ms) => 0.6 * gainA * Math.sin(TAU * 200 * ms / 1000);
      const bAt = (ms) => 0.6 * gainB * Math.sin(TAU * 200 * ms / 1000 + radians);
      const amplitude = 0.6 * Math.sqrt(Math.max(0, gainA ** 2 + gainB ** 2 + 2 * gainA * gainB * Math.cos(radians)));
      return {
        charts: [{
          title: 'Two weighted signals and their sum', description: `Two 200 Hz tones combine with ${phase} degrees of phase difference. Output peak amplitude is ${amplitude.toFixed(3)}.`,
          xLabel: 'Time (ms)', yLabel: 'Amplitude', xDomain: [0, 20], yDomain: [-2, 2],
          lines: [line('Signal A × gain', points(0, 20, aAt), 'input', true), line('Signal B × gain', points(0, 20, bAt), 'secondary', true), line('Sum', points(0, 20, (ms) => aAt(ms) + bAt(ms)), 'output')],
        }],
        readout: `Sum peak: ${amplitude.toFixed(3)} · equal gains at 180° cancel; at 0° they add.`,
        equation: `y(t) = ${gainA.toFixed(2)} × xA(t) + ${gainB.toFixed(2)} × xB(t)`,
        note: 'Both example tones are 200 Hz. Real mixes contain many frequencies; phase cancellation can vary across that spectrum. The sum has no automatic clipping.',
      };
    },
  },
  conclusion: {
    title: 'Build a little signal chain',
    description: 'Gain multiplies the input, then a low-pass smooths it. Move both controls to see simple operations working together.',
    controls: [
      numberControl('gain', 'Gain', 0, 2, 0.05, 1, (value) => `${value.toFixed(2)}×`),
      numberControl('cutoff', 'Low-pass cutoff', 100, 2000, 50, 350, (value) => `${value} Hz`),
    ],
    compute({ gain, cutoff }) {
      const low = lowPassResponse(100, cutoff);
      const high = lowPassResponse(800, cutoff);
      const inputAt = (ms) => 0.36 * Math.sin(TAU * 100 * ms / 1000) + 0.2 * Math.sin(TAU * 800 * ms / 1000);
      const outputAt = (ms) => gain * (0.36 * low.magnitude * Math.sin(TAU * 100 * ms / 1000 + low.phase) + 0.2 * high.magnitude * Math.sin(TAU * 800 * ms / 1000 + high.phase));
      return {
        charts: [{
          title: 'Input → gain → low-pass', description: 'The input contains 100 Hz and 800 Hz tones. The intermediate line shows gain alone, and the output includes filtering.',
          xLabel: 'Time (ms)', yLabel: 'Amplitude', xDomain: [0, 10], yDomain: [-1.2, 1.2],
          lines: [line('Input', points(0, 10, inputAt), 'input', true), line('After gain', points(0, 10, (ms) => gain * inputAt(ms)), 'secondary', true), line('After low-pass', points(0, 10, outputAt), 'output')],
        }, {
          title: 'The response of the whole chain', description: 'Gain scales the low-pass response at every frequency.',
          xLabel: 'Frequency (Hz)', yLabel: 'Magnitude (×)', xDomain: [0, 2400], yDomain: [0, 2.1],
          lines: [line('Gain alone', points(0, 2400, () => gain), 'secondary', true), line('Gain + low-pass', points(0, 2400, (f) => gain * lowPassResponse(f, cutoff).magnitude), 'output')],
        }],
        readout: `100 Hz leaves at ${(gain * low.magnitude).toFixed(2)}× · 800 Hz leaves at ${(gain * high.magnitude).toFixed(2)}×.`,
        equation: 'u[n] = gain × x[n]; y[n] = (1 − a)u[n] + a·y[n − 1]; a = exp(−2π × cutoff / 48000)',
        note: 'A one-pole digital low-pass at 48 kHz. The waveform shows its steady-state response to two synthetic tones, after the startup transient.',
      };
    },
  },
};
