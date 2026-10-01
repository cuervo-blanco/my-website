import { describe, expect, test } from "vitest";
import { dynamicsDemos } from "./dynamics";

describe("dynamics learning models", () => {
  test("a 4:1 compressor leaves one quarter of the dB excess above threshold", () => {
    const result = dynamicsDemos.compression.compute({ threshold: -24, ratio: 4, inputLevel: -12 });
    expect(result.charts[0].markers[0].points[0]).toEqual([-12, -21]);
    const below = dynamicsDemos.compression.compute({ threshold: -24, ratio: 4, inputLevel: -36 });
    expect(below.charts[0].markers[0].points[0]).toEqual([-36, -36]);
    const unity = dynamicsDemos.compression.compute({ threshold: -24, ratio: 1, inputLevel: -12 });
    expect(unity.charts[0].lines[1].points).toEqual(unity.charts[0].lines[0].points);
  });

  test("an ideal limiter scales the tone uniformly while hard clipping changes its shape", () => {
    const result = dynamicsDemos.limiting.compute({ ceiling: -6, inputPeak: 0 });
    const [input, limited, clipped] = result.charts[0].lines.map((line) => line.points);
    const gain = 10 ** (-6 / 20);
    input.forEach(([, value], index) => {
      expect(limited[index][1]).toBeCloseTo(value * gain, 10);
      expect(Math.abs(limited[index][1])).toBeLessThanOrEqual(gain + 1e-12);
    });
    expect(clipped[2][1]).toBeCloseTo(input[2][1], 10);
    expect(limited[2][1]).not.toBeCloseTo(clipped[2][1], 5);
  });

  test("a limiter below its ceiling applies unity gain", () => {
    const result = dynamicsDemos.limiting.compute({ ceiling: -6, inputPeak: -12 });
    expect(result.charts[0].lines[1].points).toEqual(result.charts[0].lines[0].points);
  });

  test("gate gain follows the supplied envelope threshold and closed attenuation", () => {
    const result = dynamicsDemos["noise-gate"].compute({ threshold: -35, attenuation: 36 });
    const [input, output] = result.charts[0].lines.map((line) => line.points);
    const gains = result.charts[1].lines[0].points;
    expect(input.some(([, value]) => value >= -35)).toBe(true);
    expect(input.some(([, value]) => value < -35)).toBe(true);
    input.forEach(([time, level], index) => {
      const expectedGain = level >= -35 ? 0 : -36;
      expect(gains[index]).toEqual([time, expectedGain]);
      expect(output[index]).toEqual([time, level + expectedGain]);
    });
  });

  test("zero gate attenuation passes the signal without changing the threshold's open state", () => {
    const open = dynamicsDemos["noise-gate"].compute({ threshold: -35, attenuation: 0 });
    const attenuated = dynamicsDemos["noise-gate"].compute({ threshold: -35, attenuation: 36 });
    expect(open.charts[0].lines[1].points).toEqual(open.charts[0].lines[0].points);
    expect(open.readout.split(" · ")[0]).toEqual(attenuated.readout.split(" · ")[0]);
  });

  test("downward expansion doubles the dB deficit below threshold and leaves louder levels alone", () => {
    const below = dynamicsDemos.expansion.compute({ threshold: -24, ratio: 2, inputLevel: -36 });
    expect(below.charts[0].markers[0].points[0]).toEqual([-36, -48]);
    const above = dynamicsDemos.expansion.compute({ threshold: -24, ratio: 2, inputLevel: -12 });
    expect(above.charts[0].markers[0].points[0]).toEqual([-12, -12]);
  });

  test("multiband compression changes only the selected band's envelope", () => {
    const baseline = dynamicsDemos["multiband-compression"].compute({ band: "high", threshold: -24, ratio: 1 });
    const compressed = dynamicsDemos["multiband-compression"].compute({ band: "high", threshold: -24, ratio: 4 });
    expect(compressed.charts[1].lines[0].points).toEqual(baseline.charts[1].lines[0].points);
    expect(compressed.charts[1].lines[1].points).toEqual(baseline.charts[1].lines[1].points);
    expect(compressed.charts[1].lines[2].points).not.toEqual(baseline.charts[1].lines[2].points);
    const [input, output] = compressed.charts[0].lines.map((line) => line.points);
    input.forEach(([, level], index) => {
      expect(output[index][1]).toBeCloseTo(level <= -24 ? level : -24 + (level + 24) / 4, 10);
    });
  });

  test("split-band de-essing preserves the voice body and applies threshold compression only to sibilance", () => {
    const result = dynamicsDemos["de-essing"].compute({ threshold: -24, ratio: 6, sibilance: 100 });
    const quiet = dynamicsDemos["de-essing"].compute({ threshold: -24, ratio: 6, sibilance: 0 });
    expect(result.charts[1].lines[0].points).toEqual(quiet.charts[1].lines[0].points);
    const [input, output] = result.charts[0].lines.map((line) => line.points);
    expect(input.some(([, level]) => level > -24)).toBe(true);
    input.forEach(([, level], index) => {
      expect(output[index][1]).toBeCloseTo(level <= -24 ? level : -24 + (level + 24) / 6, 10);
    });
    expect(quiet.charts[0].lines[1].points).toEqual(quiet.charts[0].lines[0].points);
  });
});
