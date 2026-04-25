import { describe, expect, it } from "vitest";

import {
  buildResultFocusHeading,
  getRenderSelectionComposerHydration,
  getRenderSelectionComposerPresentation,
  getResultFocusComposerState,
  getResultFocusNote,
  getResultProcessSummary,
  getVariationComposerState
} from "./studio-result-focus.helpers";

describe("studio result focus composer helpers", () => {
  it("collapses the composer and clears the prompt when result focus opens", () => {
    expect(getResultFocusComposerState()).toEqual({
      presentation: "collapsed",
      promptValue: ""
    });
  });

  it("restores an editable draft when a variation is requested", () => {
    expect(getVariationComposerState("A slow tracking shot through a neon alley")).toEqual({
      presentation: "expanded",
      promptValue: "A slow tracking shot through a neon alley"
    });
  });

  it("skips prompt hydration when selecting a completed render", () => {
    expect(getRenderSelectionComposerPresentation("completed")).toBe("collapsed");
    expect(getRenderSelectionComposerHydration("completed")).toBe("skip");
  });

  it("rehydrates the composer for unfinished or failed renders", () => {
    expect(getRenderSelectionComposerPresentation("processing")).toBe("expanded");
    expect(getRenderSelectionComposerHydration("processing")).toBe("rehydrate");
    expect(getRenderSelectionComposerPresentation("failed")).toBe("expanded");
    expect(getRenderSelectionComposerHydration("failed")).toBe("rehydrate");
  });

  it("prefers a distinct stored title for the result heading", () => {
    expect(
      buildResultFocusHeading(
        "image",
        "Molten court portrait",
        "A regal anime portrait inside a gilded throne room with glowing horns"
      )
    ).toBe("Molten court portrait");
  });

  it("collapses prompt-like titles back into a compact heading", () => {
    expect(
      buildResultFocusHeading(
        "video",
        "At the base of the throne, a silver-white haired elf girl sits on the ground.",
        "At the base of the throne a silver white haired elf girl sits on the ground with round glasses and a golden thorn crown."
      )
    ).toBe("At the base of the throne...");
  });

  it("keeps a generated title even when it shares the prompt opening", () => {
    expect(
      buildResultFocusHeading(
        "video",
        "At the base of throne room",
        "At the base of the throne a silver white haired elf girl sits on the ground with round glasses and a golden thorn crown."
      )
    ).toBe("At the base of throne room");
  });

  it("returns polished note and process copy for the result rail", () => {
    expect(getResultFocusNote("video")).toBe("Ready to review, export, or turn into a new variation.");
    expect(getResultProcessSummary(1)).toBe("1 lifecycle update");
    expect(getResultProcessSummary(4)).toBe("4 lifecycle updates");
  });
});
