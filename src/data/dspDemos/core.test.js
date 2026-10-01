import { describe, expect, test } from "vitest";
import { coreDemos } from "./core";

const defaults = (demo) => Object.fromEntries(demo.controls.map((control) => [control.key, control.defaultValue]));
const energy = (line) => line.points.reduce((sum, [, amplitude]) => sum + amplitude ** 2, 0);
const sum = (line) => line.points.reduce((total, [, amplitude]) => total + amplitude, 0);

describe("Core DSP illustrations", () => {
  test("every control endpoint produces finite chart data with consistent animation paths", () => {
    for (const demo of Object.values(coreDemos)) {
      const choices = demo.controls.map((control) => control.options
        ? control.options.map((option) => option.value)
        : [control.min, control.defaultValue, control.max]);
      const combinations = choices.reduce((sets, values, index) => sets.flatMap((set) => values.map((value) => ({ ...set, [demo.controls[index].key]: value }))), [{}]);
      const initial = demo.compute(defaults(demo));
      for (const values of combinations) {
        const result = demo.compute(values);
        result.charts.forEach((chart, chartIndex) => {
          chart.lines.forEach((line, lineIndex) => {
            expect(line.points.length).toBe(initial.charts[chartIndex].lines[lineIndex].points.length);
            expect(line.points.length).toBeLessThanOrEqual(129);
            line.points.forEach((point) => point.forEach((value) => expect(Number.isFinite(value)).toBe(true)));
          });
        });
      }
    }
  });

  test("feedback delay places repeats at exact sample intervals and decays geometrically", () => {
    const result = coreDemos.delay.compute({ delay: 9, feedback: 0.6 });
    const output = result.charts[0].lines[1].points.map(([, value]) => value);
    expect(output[8]).toBe(1);
    expect(output[17]).toBeCloseTo(0.6, 10);
    expect(output[26]).toBeCloseTo(0.36, 10);
    expect(output[35]).toBeCloseTo(0.216, 10);
    expect(output[18]).toBe(0);
    const dry = coreDemos.delay.compute({ delay: 9, feedback: 0 }).charts[0].lines;
    expect(dry[1].points).toEqual(dry[0].points);
  });

  test("equal-power panning preserves total channel energy, including the endpoints", () => {
    for (const pan of [-1, -0.4, 0, 0.6, 1]) {
      const charts = coreDemos.panning.compute({ pan }).charts;
      expect(energy(charts[0].lines[1]) + energy(charts[1].lines[1])).toBeCloseTo(energy(charts[0].lines[0]), 10);
    }
    const left = coreDemos.panning.compute({ pan: -1 }).charts;
    expect(energy(left[0].lines[1])).toBeCloseTo(energy(left[0].lines[0]), 10);
    expect(energy(left[1].lines[1])).toBeCloseTo(0, 10);
  });

  test("Butterworth low/high-pass filters have the expected cutoff and opposite stopbands", () => {
    for (const cutoff of [100, 1800, 10000]) {
      const low = coreDemos.filter.compute({ type: "lowpass", cutoff }).charts[0];
      const high = coreDemos.filter.compute({ type: "highpass", cutoff }).charts[0];
      expect(low.markers[0].points[0][1]).toBeCloseTo(-10 * Math.log10(2), 7);
      expect(high.markers[0].points[0][1]).toBeCloseTo(-10 * Math.log10(2), 7);
      const lowResponse = low.lines[1].points;
      const highResponse = high.lines[1].points;
      expect(lowResponse[0][1]).toBeGreaterThan(lowResponse.at(-1)[1]);
      expect(highResponse[0][1]).toBeLessThan(highResponse.at(-1)[1]);
    }
  });

  test("a bell EQ is flat at zero gain and reciprocal boosts/cuts cancel in dB", () => {
    const zero = coreDemos.eq.compute({ frequency: 2000, gain: 0, q: 2 }).charts[0];
    zero.lines[1].points.forEach(([, gain]) => expect(gain).toBeCloseTo(0, 8));
    const boost = coreDemos.eq.compute({ frequency: 2000, gain: 9, q: 2 }).charts[0];
    const cut = coreDemos.eq.compute({ frequency: 2000, gain: -9, q: 2 }).charts[0];
    expect(boost.markers[0].points[0][1]).toBeCloseTo(9, 7);
    expect(cut.markers[0].points[0][1]).toBeCloseTo(-9, 7);
    boost.lines[1].points.forEach(([, gain], index) => expect(gain + cut.lines[1].points[index][1]).toBeCloseTo(0, 7));
  });

  test("reverb pre-delay delays the wet envelope and T60 reduces it by a factor of 1000", () => {
    const chart = coreDemos.reverb.compute({ decay: 1.2, predelay: 40, mix: 1 }).charts[0];
    const envelope = chart.lines[2].points;
    expect(envelope[0][1]).toBe(0);
    expect(envelope[1][1]).toBe(0);
    expect(envelope[2][1]).toBeCloseTo(1, 10);
    expect(envelope[62][1]).toBeCloseTo(0.001, 10);
    const dry = coreDemos.reverb.compute({ decay: 1.2, predelay: 40, mix: 0 }).charts[0].lines;
    expect(dry[1].points).toEqual(dry[0].points);
  });

  test("convolution has identity, normalized-average, and delayed-copy behavior", () => {
    const identity = coreDemos.convolution.compute({ kernel: "average", width: 1 }).charts[1].lines;
    expect(identity[1].points).toEqual(identity[0].points);
    const average = coreDemos.convolution.compute({ kernel: "average", width: 8 }).charts;
    expect(sum(average[0].lines[0])).toBeCloseTo(1, 10);
    expect(sum(average[1].lines[1])).toBeCloseTo(sum(average[1].lines[0]), 10);
    const echo = coreDemos.convolution.compute({ kernel: "echo", width: 7 }).charts[1].lines;
    const input = echo[0].points.map(([, value]) => value);
    echo[1].points.forEach(([n, amplitude]) => expect(amplitude).toBeCloseTo(input[n] + 0.5 * (input[n - 7] ?? 0), 10));
  });

  test("cross-correlation recovers delay and has unit similarity for an exact copy", () => {
    for (const delay of [0, 8, 16]) {
      const clean = coreDemos["cross-correlation"].compute({ delay, noise: 0 }).charts[1].markers[0].points[0];
      expect(clean[0]).toBeCloseTo(-delay, 10);
      expect(clean[1]).toBeCloseTo(1, 10);
      const noisy = coreDemos["cross-correlation"].compute({ delay, noise: 0.6 }).charts[1].markers[0].points[0];
      expect(noisy[0]).toBeCloseTo(-delay, 10);
      expect(noisy[1]).toBeLessThan(clean[1]);
    }
  });
});
