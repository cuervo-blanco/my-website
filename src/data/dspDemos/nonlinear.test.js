import { describe, expect, test } from "vitest";
import { foldedFrequency, nonlinearDemos, quantizeSample } from "./nonlinear";

const defaults = (demo) => Object.fromEntries(demo.controls.map((control) => [control.key, control.defaultValue]));

describe("sampling and nonlinear DSP models", () => {
  test("signed PCM quantization clips at its real endpoints and gains precision with bits", () => {
    expect(quantizeSample(1, 2)).toBe(0.5);
    expect(quantizeSample(-1, 2)).toBe(-1);
    expect(quantizeSample(0.4, 2)).toBe(0.5);
    expect(Math.abs(quantizeSample(0.4, 16) - 0.4)).toBeLessThan(0.00002);
    const model = nonlinearDemos["digital-audio"];
    expect(model.compute({ sampleRate: 8000, bits: 4 }).charts[0].markers[0].points).toHaveLength(9);
    expect(model.compute({ sampleRate: 48000, bits: 4 }).charts[0].markers[0].points).toHaveLength(49);
  });

  test("wet mix zero bypasses saturation and hard clipping respects the ceiling", () => {
    const saturation = nonlinearDemos.saturation.compute({ drive: 8, mix: 0 }).charts[0].lines;
    expect(saturation[1].points).toEqual(saturation[0].points);
    const clipped = nonlinearDemos.distortion.compute({ drive: 5, ceiling: 0.2 }).charts[0].lines[1].points;
    expect(Math.max(...clipped.map(([, y]) => y))).toBe(0.2);
    expect(Math.min(...clipped.map(([, y]) => y))).toBe(-0.2);
  });

  test("folded cosines agree with the source at every sampled instant", () => {
    for (const sampleRate of [8000, 16000, 48000]) {
      for (const frequency of [500, 6000, 12000, 30000]) {
        const folded = Math.abs(foldedFrequency(frequency, sampleRate));
        expect(folded).toBeLessThanOrEqual(sampleRate / 2);
        for (let n = 0; n < 32; n++) {
          expect(Math.cos(2 * Math.PI * frequency * n / sampleRate)).toBeCloseTo(Math.cos(2 * Math.PI * folded * n / sampleRate), 10);
        }
      }
    }
    expect(foldedFrequency(9000, 16000)).toBe(-7000);
  });

  test("oversampling removes the folded third harmonic while retaining in-band harmonics", () => {
    const demo = nonlinearDemos.oversampling;
    const base = demo.compute({ factor: 1, frequency: 3000 });
    expect(base.charts[0].lines[0].points).toEqual(base.charts[0].lines[1].points);
    const oversampled = demo.compute({ factor: 2, frequency: 3000 });
    expect(oversampled.charts[0].lines[1].points).toEqual(oversampled.charts[0].lines[2].points);
    expect(oversampled.charts[0].lines[0].points).not.toEqual(oversampled.charts[0].lines[1].points);
    const inBand = demo.compute({ factor: 4, frequency: 1000 });
    expect(inBand.charts[0].lines[0].points).toEqual(inBand.charts[0].lines[1].points);
  });

  test("all nonlinear control extremes produce finite chart data within their domains", () => {
    for (const demo of Object.values(nonlinearDemos)) {
      const initial = defaults(demo);
      for (const control of demo.controls) {
        const extremes = control.options ? control.options.map((option) => option.value) : [control.min, control.max];
        for (const value of extremes) {
          const model = demo.compute({ ...initial, [control.key]: value });
          expect(model.readout).not.toMatch(/NaN|Infinity/);
          for (const chart of model.charts) {
            for (const series of [...chart.lines, ...(chart.markers || [])]) {
              for (const [x, y] of series.points) {
                expect(Number.isFinite(x) && Number.isFinite(y)).toBe(true);
                expect(x).toBeGreaterThanOrEqual(chart.xDomain[0]);
                expect(x).toBeLessThanOrEqual(chart.xDomain[1]);
                expect(y).toBeGreaterThanOrEqual(chart.yDomain[0]);
                expect(y).toBeLessThanOrEqual(chart.yDomain[1]);
              }
            }
          }
        }
      }
    }
  });
});
