import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import DspConceptDemo from "./DspConceptDemo";
import { dspDemos, defaultDemoValues } from "../../data/dspDemos";
import { dspDictionarySections, dspDictionaryTopicGroups } from "../../data/dspDictionary";

describe("interactive dictionary demos", () => {
  test("provides a working model for every foundation and every topic besides the existing Gain demo", () => {
    const ids = [...dspDictionarySections, ...dspDictionaryTopicGroups.flatMap((group) => group.topics)].map((item) => item.id).filter((id) => id !== "gain");
    expect(Object.keys(dspDemos).sort()).toEqual(ids.sort());
    for (const id of ids) {
      const demo = dspDemos[id];
      expect(demo.controls.length).toBeGreaterThan(0);
      expect(demo.compute(defaultDemoValues(demo)).charts.length).toBeGreaterThan(0);
    }
  });

  test("changing a numeric control updates the lesson and Reset restores it", () => {
    render(<DspConceptDemo topicId="distortion" />);
    const ceiling = screen.getByRole("slider", { name: "Clipping ceiling" });
    fireEvent.change(ceiling, { target: { value: "0.2" } });
    expect(ceiling).toHaveAttribute("aria-valuetext", "±0.20");
    expect(screen.getByText(/output limited to ±0.20/)).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Reset" }));
    expect(ceiling).toHaveValue("0.7");
    expect(screen.getByText(/output limited to ±0.70/)).toBeVisible();
  });

  test("numeric select options recompute sampling and remain independent of another demo", () => {
    const { container } = render(<><DspConceptDemo topicId="digital-audio" /><DspConceptDemo topicId="aliasing" /></>);
    const cards = container.querySelectorAll("figure");
    fireEvent.change(within(cards[0]).getByRole("combobox", { name: "Sample rate" }), { target: { value: "48000" } });
    expect(within(cards[0]).getByText(/48 sample intervals per millisecond/)).toBeVisible();
    expect(within(cards[1]).getByRole("combobox", { name: "Sample rate" })).toHaveValue("16000");
    const ids = Array.from(container.querySelectorAll("[id]"), (element) => element.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

});
