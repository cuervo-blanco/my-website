import { describe, expect, it } from 'vitest';
import { modulationDemos } from './modulation';

const defaults = (demo) => Object.fromEntries(demo.controls.map((control) => [control.key, control.defaultValue]));
const compute = (id, overrides = {}) => modulationDemos[id].compute({ ...defaults(modulationDemos[id]), ...overrides });
const values = (plottedLine) => plottedLine.points.map((point) => point[1]);

describe('modulation and signal-flow demo models', () => {
  it('keeps finite, bounded coordinates and fixed line counts across control extremes', () => {
    for (const demo of Object.values(modulationDemos)) {
      const initial = defaults(demo);
      const expected = demo.compute(initial);
      const combinations = [initial, ...['min', 'max'].map((extreme) => Object.fromEntries(demo.controls.map((control) => [
        control.key, control.options ? control.options[extreme === 'min' ? 0 : control.options.length - 1].value : control[extreme],
      ])))];
      for (const control of demo.controls) {
        const extremes = control.options ? control.options.map((option) => option.value) : [control.min, control.max];
        for (const value of extremes) combinations.push({ ...initial, [control.key]: value });
      }
      for (const combination of combinations) {
        const result = demo.compute(combination);
        expect(result.charts).toHaveLength(expected.charts.length);
        result.charts.forEach((chart, chartIndex) => {
          chart.lines.forEach((plottedLine, lineIndex) => {
            expect(plottedLine.points).toHaveLength(expected.charts[chartIndex].lines[lineIndex].points.length);
            expect(plottedLine.points.length).toBeLessThanOrEqual(129);
            for (const [x, y] of plottedLine.points) {
              expect(Number.isFinite(x) && Number.isFinite(y)).toBe(true);
              expect(x).toBeGreaterThanOrEqual(chart.xDomain[0] - 1e-10);
              expect(x).toBeLessThanOrEqual(chart.xDomain[1] + 1e-10);
              expect(y).toBeGreaterThanOrEqual(chart.yDomain[0] - 1e-10);
              expect(y).toBeLessThanOrEqual(chart.yDomain[1] + 1e-10);
            }
          });
        });
      }
    }
  });

  it('maps LFO rate to time and depth to peak control value', () => {
    const signal = compute('lfo', { rate: 0.5, depth: 0.8 }).charts[0].lines[0].points;
    expect(signal.find(([time]) => time === 0.5)[1]).toBeCloseTo(0.8, 12);
    expect(signal.find(([time]) => time === 1.5)[1]).toBeCloseTo(-0.8, 12);
    expect(values(compute('lfo', { depth: 0 }).charts[0].lines[0]).every((value) => value === 0)).toBe(true);
  });

  it('leaves the signal unchanged at zero modulation depth', () => {
    const chart = compute('modulation-effects', { depth: 0 }).charts[1];
    expect(chart.lines[1].points).toEqual(chart.lines[0].points);
    const envelope = values(compute('modulation-effects', { depth: 1 }).charts[0].lines[0]);
    expect(Math.min(...envelope)).toBeCloseTo(0, 12);
    expect(Math.max(...envelope)).toBeCloseTo(1, 12);
  });

  it('creates chorus cancellation from the actual selected delay', () => {
    const result = compute('chorus', { depth: 0 });
    expect(values(result.charts[0].lines[0]).every((delay) => delay === 20)).toBe(true);
    const response = result.charts[1].lines[1].points;
    expect(response.find(([frequency]) => frequency === 0)[1]).toBeCloseTo(1, 12);
    expect(response.find(([frequency]) => frequency === 25)[1]).toBeCloseTo(0, 12);
    expect(response.find(([frequency]) => frequency === 50)[1]).toBeCloseTo(1, 12);
  });

  it('puts flanger notches at half-cycle delay cancellation and raises peaks with feedback', () => {
    const dryFeedback = compute('flanger', { depth: 1.5, time: 0.5, feedback: 0 }).charts[1].lines[1].points;
    const withFeedback = compute('flanger', { depth: 1.5, time: 0.5, feedback: 0.5 }).charts[1].lines[1].points;
    // Selected delay is 4 ms: the first cancellation is 1 / (2D) = 125 Hz.
    expect(dryFeedback.find(([frequency]) => frequency === 125)[1]).toBe(-40);
    expect(withFeedback[0][1] - dryFeedback[0][1]).toBeCloseTo(20 * Math.log10(2), 12);
  });

  it('keeps all-pass magnitude at unity and creates notches only when dry and wet mix', () => {
    const mixed = compute('phaser', { mix: 0.5 });
    values(mixed.charts[0].lines[0]).forEach((magnitude) => expect(magnitude).toBeCloseTo(1, 10));
    expect(Math.min(...values(mixed.charts[0].lines[1]))).toBeLessThan(0.1);
    for (const mix of [0, 1]) {
      values(compute('phaser', { mix }).charts[0].lines[1]).forEach((magnitude) => expect(magnitude).toBeCloseTo(1, 10));
    }
    const phases = values(mixed.charts[1].lines[1]);
    expect(phases[0]).toBeCloseTo(0, 12);
    for (let index = 1; index < phases.length; index += 1) expect(phases[index]).toBeLessThanOrEqual(phases[index - 1]);
  });

  it('spaces echo impulses by delay and decays each successive echo by feedback', () => {
    const echoes = compute('time-based-effects', { delay: 300, feedback: 0.6, wet: 0.75 }).charts[0].markers[0].points;
    expect(echoes[0]).toEqual([400, 0.75]);
    echoes.slice(1).forEach(([time, amplitude], index) => {
      expect(time - echoes[index][0]).toBe(300);
      expect(amplitude).toBeCloseTo(echoes[index][1] * 0.6, 12);
    });
    const noFeedback = compute('time-based-effects', { feedback: 0 }).charts[0].markers[0].points;
    expect(noFeedback[0][1]).toBe(0.75);
    expect(noFeedback.slice(1).every(([, amplitude]) => amplitude === 0)).toBe(true);
  });

  it('applies channel delay independently from equal-power level distribution', () => {
    const centered = compute('spatial-effects', { pan: 0, delay: 0.5 }).charts[0].lines;
    // Plot spacing is 0.0625 ms, so a 0.5 ms delay is precisely eight points.
    const left = centered[0].points;
    const right = centered[1].points;
    left.slice(0, -8).forEach(([, amplitude], index) => expect(right[index + 8][1]).toBeCloseTo(amplitude, 12));
    expect(Math.max(...values(compute('spatial-effects', { pan: 1 }).charts[0].lines[0]).map(Math.abs))).toBeLessThan(1e-14);
    expect(values(compute('spatial-effects', { pan: -1 }).charts[0].lines[1]).every((amplitude) => amplitude === 0)).toBe(true);
  });

  it('sums weighted signals and cancels matching signals of opposite phase', () => {
    const sum = compute('mixing', { phase: 180, gainA: 1, gainB: 1 }).charts[0].lines;
    expect(Math.max(...values(sum[2]).map(Math.abs))).toBeLessThan(1e-14);
    const inPhase = compute('mixing', { phase: 0, gainA: 0.5, gainB: 1 }).charts[0].lines;
    inPhase[2].points.forEach(([, amplitude], index) => {
      expect(amplitude).toBeCloseTo(inPhase[0].points[index][1] + inPhase[1].points[index][1], 12);
    });
  });

  it('applies gain linearly around a low-pass that attenuates higher frequencies', () => {
    const unity = compute('conclusion', { gain: 1, cutoff: 350 });
    const doubled = compute('conclusion', { gain: 2, cutoff: 350 });
    doubled.charts[0].lines[2].points.forEach(([, amplitude], index) => expect(amplitude).toBeCloseTo(2 * unity.charts[0].lines[2].points[index][1], 12));
    expect(values(compute('conclusion', { gain: 0 }).charts[0].lines[2]).every((amplitude) => amplitude === 0)).toBe(true);
    const response = values(unity.charts[1].lines[1]);
    expect(response[0]).toBeCloseTo(1, 12);
    for (let index = 1; index < response.length; index += 1) expect(response[index]).toBeLessThan(response[index - 1]);
    expect(compute('conclusion', { cutoff: 1500 }).charts[1].lines[1].points[64][1]).toBeGreaterThan(unity.charts[1].lines[1].points[64][1]);
  });
});
