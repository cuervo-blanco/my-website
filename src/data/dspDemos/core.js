// Biquad coefficients follow the W3C Audio EQ Cookbook (RBJ).
// https://www.w3.org/TR/audio-eq-cookbook/
// Convolution/correlation conventions: https://www.dspguide.com/ch6/2.htm
// and https://www.dspguide.com/ch7/3.htm

const SAMPLE_RATE = 48000;
const frequencyGrid = Array.from({ length: 129 }, (_, n) => 20 * 1000 ** (n / 128));
const points = (samples) => samples.map((value, n) => [n, value]);
const hz = (value) => `${value >= 1000 ? `${(value / 1000).toFixed(1)} k` : value}Hz`;
const percent = (value) => `${Math.round(value * 100)}%`;
const signedDb = (value) => `${value > 0 ? "+" : ""}${Number(value).toFixed(1)} dB`;
const zeroLine = frequencyGrid.map((frequency) => [frequency, 0]);

function biquad(type, frequency, q = Math.SQRT1_2, gain = 0) {
  const angle = (2 * Math.PI * frequency) / SAMPLE_RATE;
  const cosine = Math.cos(angle);
  const alpha = Math.sin(angle) / (2 * q);
  if (type === "bell") {
    const a = 10 ** (gain / 40);
    return {
      b: [1 + alpha * a, -2 * cosine, 1 - alpha * a],
      a: [1 + alpha / a, -2 * cosine, 1 - alpha / a],
    };
  }
  const highPass = type === "highpass";
  const outer = (1 + (highPass ? cosine : -cosine)) / 2;
  return {
    b: [outer, (highPass ? -2 : 2) * outer, outer],
    a: [1 + alpha, -2 * cosine, 1 - alpha],
  };
}

function responseDb(coefficients, frequency) {
  const angle = (2 * Math.PI * frequency) / SAMPLE_RATE;
  const magnitudeSquared = (terms) => {
    const real = terms.reduce((sum, coefficient, n) => sum + coefficient * Math.cos(n * angle), 0);
    const imaginary = terms.reduce((sum, coefficient, n) => sum - coefficient * Math.sin(n * angle), 0);
    return real * real + imaginary * imaginary;
  };
  const magnitude = Math.sqrt(magnitudeSquared(coefficients.b) / magnitudeSquared(coefficients.a));
  return Math.max(-60, 20 * Math.log10(Math.max(1e-12, magnitude)));
}

function frequencyChart(title, description, coefficients, yDomain) {
  return {
    title,
    description,
    xLabel: "Frequency (Hz)",
    yLabel: "Gain (dB)",
    xDomain: [20, 20000],
    xScale: "log",
    xTicks: [20, 100, 1000, 10000, 20000],
    yDomain,
    lines: [
      { label: "Unchanged", points: zeroLine, style: "input", dashed: true },
      {
        label: "Filter response",
        points: frequencyGrid.map((frequency) => [frequency, responseDb(coefficients, frequency)]),
        style: "output",
      },
    ],
  };
}

export const coreDemos = {
  delay: {
    title: "Delay",
    description: "Move the repeats farther apart, then feed more of each repeat back into the delay.",
    controls: [
      { key: "delay", label: "Delay", min: 4, max: 24, step: 1, defaultValue: 14, format: (value) => `${value} samples` },
      { key: "feedback", label: "Feedback", min: 0, max: 0.85, step: 0.05, defaultValue: 0.55, format: percent },
    ],
    compute({ delay, feedback }) {
      const input = Array.from({ length: 129 }, (_, n) => (n === 8 ? 1 : 0));
      const output = [];
      for (let n = 0; n < input.length; n += 1) {
        output[n] = input[n] + (n >= delay ? feedback * output[n - delay] : 0);
      }
      return {
        charts: [{
          title: "An impulse and its echoes",
          description: "Each repeat is separated by the delay and multiplied by the feedback gain again.",
          xLabel: "Sample", yLabel: "Amplitude", xDomain: [0, 128], yDomain: [0, 1.1],
          lines: [
            { label: "Original impulse", points: points(input), style: "input", dashed: true },
            { label: "Impulse + echoes", points: points(output), style: "output" },
          ],
        }],
        readout: feedback === 0
          ? "Feedback is zero: only the original impulse remains."
          : `First repeat: sample ${8 + delay} at ${percent(feedback)} amplitude. The next repeats are ${percent(feedback ** 2)} and ${percent(feedback ** 3)}.`,
        equation: "y[n] = x[n] + feedback × y[n − D]",
        note: "A short sample grid makes the repeats visible. In an audio processor, delay in seconds is D divided by the sample rate.",
      };
    },
  },
  panning: {
    title: "Panning",
    description: "Move the sound between two channels and watch an equal-power pan curve distribute its gain.",
    controls: [{
      key: "pan", label: "Pan", min: -1, max: 1, step: 0.05, defaultValue: 0,
      format: (value) => value === 0 ? "Center" : `${Math.round(Math.abs(value) * 100)}% ${value < 0 ? "left" : "right"}`,
    }],
    compute({ pan }) {
      const angle = ((pan + 1) * Math.PI) / 4;
      const left = Math.cos(angle);
      const right = Math.sin(angle);
      const input = Array.from({ length: 97 }, (_, n) => [n / 48, Math.sin((2 * Math.PI * n) / 48)]);
      return {
        charts: [
          { title: "Left channel", gain: left, style: "output" },
          { title: "Right channel", gain: right, style: "secondary" },
        ].map(({ title, gain, style }) => ({
          title, description: `${title} carries the same waveform at ${percent(gain)} gain.`,
          xLabel: "Time (cycles)", yLabel: "Amplitude", xDomain: [0, 2], yDomain: [-1.1, 1.1],
          lines: [
            { label: "Mono input", points: input, style: "input", dashed: true },
            { label: title, points: input.map(([time, value]) => [time, gain * value]), style },
          ],
        })),
        readout: `Left gain ${left.toFixed(3)} · Right gain ${right.toFixed(3)} · L² + R² = ${(left * left + right * right).toFixed(2)}.`,
        equation: "θ = (pan + 1) × π / 4; L = cos(θ) × x; R = sin(θ) × x",
        note: "This pan law preserves the sum of the two channel powers. Acoustic loudness also depends on the speakers and room.",
      };
    },
  },
  filter: {
    title: "Filter",
    description: "Choose which side of the spectrum passes through, then move the cutoff frequency.",
    controls: [
      { key: "type", label: "Filter type", defaultValue: "lowpass", options: [{ value: "lowpass", label: "Low-pass" }, { value: "highpass", label: "High-pass" }] },
      { key: "cutoff", label: "Cutoff", min: 100, max: 10000, step: 100, defaultValue: 1800, format: hz },
    ],
    compute({ type, cutoff }) {
      const coefficients = biquad(type, cutoff);
      const chart = frequencyChart("What passes through?", "A lower line means more attenuation at that frequency.", coefficients, [-60, 3]);
      chart.markers = [{ label: "Cutoff", points: [[cutoff, responseDb(coefficients, cutoff)]], style: "secondary" }];
      return {
        charts: [chart],
        readout: `${type === "lowpass" ? "Low" : "High"}-pass at ${hz(cutoff)}: ${responseDb(coefficients, cutoff).toFixed(2)} dB at the cutoff.`,
        equation: "H(z) = (b₀ + b₁z⁻¹ + b₂z⁻²) / (a₀ + a₁z⁻¹ + a₂z⁻²)",
        note: "Second-order Butterworth biquad at 48 kHz, Q = 1/√2. Attenuation below −60 dB is clipped in the plot.",
      };
    },
  },
  eq: {
    title: "EQ",
    description: "Boost or cut one band, move its center, and use Q to make it narrower or wider.",
    controls: [
      { key: "frequency", label: "Center frequency", min: 100, max: 8000, step: 100, defaultValue: 1000, format: hz },
      { key: "gain", label: "Band gain", min: -12, max: 12, step: 0.5, defaultValue: 6, format: signedDb },
      { key: "q", label: "Q", min: 0.3, max: 6, step: 0.1, defaultValue: 1, format: (value) => Number(value).toFixed(1) },
    ],
    compute({ frequency, gain, q }) {
      const coefficients = biquad("bell", frequency, q, gain);
      const chart = frequencyChart("A bell-shaped EQ band", "Higher Q concentrates the gain change into a narrower frequency band.", coefficients, [-15, 15]);
      chart.yTicks = [-12, 0, 12];
      chart.markers = [{ label: "Band center", points: [[frequency, responseDb(coefficients, frequency)]], style: "secondary" }];
      return {
        charts: [chart],
        readout: `${signedDb(gain)} at ${hz(frequency)}, Q ${q.toFixed(1)}.${gain === 0 ? " Zero gain leaves the response flat." : ""}`,
        equation: "A = 10^(gain / 40); α = sin(2πf₀ / Fs) / (2Q)",
        note: "One peaking biquad band at 48 kHz, calculated with the Audio EQ Cookbook coefficients.",
      };
    },
  },
  reverb: {
    title: "Reverb",
    description: "Lengthen the reflection tail, delay its start, or blend more of it with the dry impulse.",
    controls: [
      { key: "decay", label: "Decay (T60)", min: 0.2, max: 2.4, step: 0.1, defaultValue: 1.2, format: (value) => `${Number(value).toFixed(1)} s` },
      { key: "predelay", label: "Pre-delay", min: 0, max: 120, step: 20, defaultValue: 40, format: (value) => `${value} ms` },
      { key: "mix", label: "Wet mix", min: 0, max: 1, step: 0.05, defaultValue: 0.65, format: percent },
    ],
    compute({ decay, predelay, mix }) {
      const input = [];
      const reflections = [];
      const envelope = [];
      const start = predelay / 1000;
      for (let n = 0; n < 129; n += 1) {
        const time = n * 0.02;
        const relativeTime = time - start;
        const afterStart = relativeTime >= -1e-9;
        const relativeSample = Math.round(relativeTime / 0.02);
        const tailEnvelope = afterStart ? 10 ** ((-3 * Math.max(0, relativeTime)) / decay) : 0;
        const earlyTap = ({ 0: 0.85, 2: -0.65, 4: 0.55 })[relativeSample];
        const texture = relativeSample < 5
          ? (earlyTap ?? 0)
          : 0.6 * Math.sin(relativeSample * 7.31) * Math.cos(relativeSample * 2.17);
        const dry = n === 0 ? 1 : 0;
        input.push([time, dry]);
        reflections.push([time, (1 - mix) * dry + mix * tailEnvelope * texture]);
        envelope.push([time, mix * tailEnvelope]);
      }
      return {
        charts: [{
          title: "From a short impulse to a decaying tail",
          description: "The envelope marks the maximum late-tail amplitude; the changing signs represent reflections.",
          xLabel: "Time (s)", yLabel: "Amplitude", xDomain: [0, 2.56], yDomain: [-1, 1.1],
          lines: [
            { label: "Dry impulse", points: input, style: "input", dashed: true },
            { label: "Dry + reflections", points: reflections, style: "output" },
            { label: "Wet decay envelope", points: envelope, style: "secondary", dashed: true },
          ],
        }],
        readout: `The decay envelope falls by 60 dB in ${decay.toFixed(1)} s after the ${predelay} ms pre-delay. Wet mix: ${percent(mix)}.`,
        equation: "envelope(t) = 10^(−3t / T60); output = (1 − mix) × dry + mix × reflections",
        note: "Synthetic impulse response with early taps and an exponential late tail on a 20 ms illustration grid; this is not a measured room.",
      };
    },
  },
  convolution: {
    title: "Convolution",
    description: "Change the impulse response and watch it reshape every sample of the input.",
    controls: [
      { key: "kernel", label: "Impulse response", defaultValue: "average", options: [{ value: "average", label: "Moving average" }, { value: "echo", label: "Two-tap echo" }] },
      { key: "width", label: "Length / echo spacing", min: 1, max: 12, step: 1, defaultValue: 6, format: (value) => `${value} samples` },
    ],
    compute({ kernel, width }) {
      const input = Array.from({ length: 33 }, (_, n) => (n >= 4 && n <= 10 ? 1 : n >= 17 && n <= 23 ? -0.65 : 0));
      const impulse = Array.from({ length: 17 }, (_, n) => kernel === "echo"
        ? (n === 0 ? 1 : n === width ? 0.5 : 0)
        : (n < width ? 1 / width : 0));
      const output = Array(input.length + impulse.length - 1).fill(0);
      for (let n = 0; n < input.length; n += 1) {
        for (let k = 0; k < impulse.length; k += 1) output[n + k] += input[n] * impulse[k];
      }
      return {
        charts: [{
          title: "The impulse response h[n]",
          description: kernel === "echo" ? "A direct tap and a quieter delayed tap." : "Equal weights average the current sample with earlier samples.",
          xLabel: "Sample", yLabel: "Weight", xDomain: [0, 16], yDomain: [0, 1.1],
          lines: [{ label: "Impulse response", points: points(impulse), style: "secondary" }],
        }, {
          title: "The convolution output",
          description: "Each input sample adds a scaled, shifted copy of the impulse response to this result.",
          xLabel: "Sample", yLabel: "Amplitude", xDomain: [0, 48], yDomain: [-1.1, 1.6],
          lines: [
            { label: "Input", points: points([...input, ...Array(16).fill(0)]), style: "input", dashed: true },
            { label: "Convolved output", points: points(output), style: "output" },
          ],
        }],
        readout: kernel === "echo"
          ? `Each sample adds a 50% copy ${width} samples later.`
          : width === 1 ? "A one-sample unit impulse leaves the input unchanged." : `Each output sample averages ${width} input samples. The kernel weights add up to 1.`,
        equation: "y[n] = Σ x[k] × h[n − k]",
        note: "A small, direct discrete convolution. Zero padding keeps the plot length fixed when the kernel changes.",
      };
    },
  },
  "cross-correlation": {
    title: "Cross-Correlation",
    description: "Delay a copy of the signal and add noise, then find the lag where the signals match best.",
    controls: [
      { key: "delay", label: "Signal B delay", min: 0, max: 16, step: 1, defaultValue: 8, format: (value) => `${value} samples` },
      { key: "noise", label: "Noise level", min: 0, max: 0.6, step: 0.05, defaultValue: 0.1, format: percent },
    ],
    compute({ delay, noise }) {
      const shape = [0.15, 0.3, 0.6, 1, 0.2, -0.75, -0.45, -0.1, 0.25, 0.1];
      const input = Array.from({ length: 65 }, (_, n) => shape[n - 16] ?? 0);
      const second = input.map((_, n) => (input[n - delay] ?? 0) + noise * Math.sin(n * 12.9898 + 0.78) * Math.cos(n * 4.1414));
      const energy = (signal) => signal.reduce((sum, sample) => sum + sample * sample, 0);
      const normalization = Math.sqrt(energy(input) * energy(second));
      const correlation = Array.from({ length: 49 }, (_, index) => {
        const lag = index - 24;
        const sum = input.reduce((total, sample, n) => total + sample * (second[n - lag] ?? 0), 0);
        return [lag, sum / normalization];
      });
      const peak = correlation.reduce((best, point) => point[1] > best[1] ? point : best);
      return {
        charts: [{
          title: "Two versions of one signal",
          description: "Signal B contains a delayed copy of A plus deterministic noise.",
          xLabel: "Sample", yLabel: "Amplitude", xDomain: [0, 64], yDomain: [-1.6, 1.6],
          lines: [
            { label: "Signal A", points: points(input), style: "input", dashed: true },
            { label: "Signal B", points: points(second), style: "secondary" },
          ],
        }, {
          title: "Where do they line up?",
          description: "The peak identifies the shift that aligns B with A.",
          xLabel: "Alignment lag (samples)", yLabel: "Normalized correlation", xDomain: [-24, 24], yDomain: [-1.05, 1.05],
          lines: [{ label: "Correlation", points: correlation, style: "output" }],
          markers: [{ label: "Best match", points: [peak], style: "secondary" }],
        }],
        readout: `B is delayed by ${delay} samples. Best match: lag ${peak[0]}, similarity ${peak[1].toFixed(2)}.`,
        equation: "Rxy[k] = Σ x[n] × y[n − k] / √(Σx² × Σy²)",
        note: "With this lag convention, a delay of D samples produces a peak at −D. Normalization uses the full signal energies; missing samples are zero.",
      };
    },
  },
};
