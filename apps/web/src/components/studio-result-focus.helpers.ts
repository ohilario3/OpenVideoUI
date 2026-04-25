export type RenderStatus =
  | "queued"
  | "submitting"
  | "processing"
  | "completed"
  | "failed"
  | "canceled";

export type ResultMediaKind = "image" | "video";
export type MediaComposerPresentation = "expanded" | "collapsed";
export type RenderSelectionComposerHydration = "rehydrate" | "skip";

export type MediaComposerState = {
  presentation: MediaComposerPresentation;
  promptValue: string;
};

const RESULT_TITLE_MAX_LENGTH = 88;
const GENERATED_TITLE_MAX_LENGTH = 60;
const GENERATED_TITLE_MAX_WORDS = 6;
const RESULT_FALLBACK_TITLE: Record<ResultMediaKind, string> = {
  image: "Untitled image result",
  video: "Untitled video result"
};
const RESULT_NOTE_BY_KIND: Record<ResultMediaKind, string> = {
  image: "Ready to export or turn into a new variation.",
  video: "Ready to review, export, or turn into a new variation."
};

export function getResultFocusComposerState(): MediaComposerState {
  return {
    presentation: "collapsed",
    promptValue: ""
  };
}

export function getVariationComposerState(promptValue: string): MediaComposerState {
  return {
    presentation: "expanded",
    promptValue
  };
}

export function getRenderSelectionComposerHydration(
  renderStatus: RenderStatus
): RenderSelectionComposerHydration {
  return renderStatus === "completed" ? "skip" : "rehydrate";
}

export function getRenderSelectionComposerPresentation(
  renderStatus: RenderStatus
): MediaComposerPresentation {
  return renderStatus === "completed" ? "collapsed" : "expanded";
}

export function buildResultFocusHeading(mediaKind: ResultMediaKind, title: string, prompt: string) {
  const trimmedTitle = normalizeResultText(title);
  const trimmedPrompt = normalizeResultText(prompt);
  const normalizedFallbackTitle = trimmedPrompt
    ? normalizeResultText(buildFallbackResultTitle(trimmedPrompt, RESULT_FALLBACK_TITLE[mediaKind]))
    : "";

  if (
    trimmedTitle &&
    ((trimmedTitle !== normalizedFallbackTitle && isLikelyGeneratedTitle(trimmedTitle)) ||
      !isPromptLikeTitle(trimmedTitle, trimmedPrompt))
  ) {
    return clampResultText(trimmedTitle, RESULT_TITLE_MAX_LENGTH);
  }

  if (trimmedPrompt) {
    return buildPromptHeading(trimmedPrompt);
  }

  if (trimmedTitle) {
    return clampResultText(trimmedTitle, RESULT_TITLE_MAX_LENGTH);
  }

  return RESULT_FALLBACK_TITLE[mediaKind];
}

export function getResultFocusNote(mediaKind: ResultMediaKind) {
  return RESULT_NOTE_BY_KIND[mediaKind];
}

export function getResultProcessSummary(eventCount: number) {
  if (eventCount <= 0) {
    return "No lifecycle updates";
  }

  return `${eventCount} lifecycle update${eventCount === 1 ? "" : "s"}`;
}

function buildPromptHeading(prompt: string) {
  const leadSegment = prompt.split(/[.!?;:]/, 1)[0]?.trim() ?? prompt;
  const compactPrompt = leadSegment
    .split(" ")
    .filter(Boolean)
    .slice(0, 6)
    .join(" ");

  if (!compactPrompt) {
    return prompt;
  }

  const hasMoreContent = compactPrompt.length < prompt.length;
  return hasMoreContent ? `${compactPrompt}...` : compactPrompt;
}

function clampResultText(value: string, maxLength: number) {
  return value.length > maxLength ? `${value.slice(0, maxLength - 3).trimEnd()}...` : value;
}

function normalizeResultText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function buildFallbackResultTitle(prompt: string, fallback: string) {
  const normalizedPrompt = normalizeResultText(prompt);

  if (!normalizedPrompt) {
    return fallback;
  }

  return limitResultTitleLength(limitResultTitleWords(normalizedPrompt)) || fallback;
}

function limitResultTitleWords(value: string) {
  const words = value.split(" ").filter(Boolean);

  if (words.length <= GENERATED_TITLE_MAX_WORDS) {
    return value;
  }

  return words.slice(0, GENERATED_TITLE_MAX_WORDS).join(" ");
}

function limitResultTitleLength(value: string) {
  if (value.length <= GENERATED_TITLE_MAX_LENGTH) {
    return value;
  }

  const clipped = value.slice(0, GENERATED_TITLE_MAX_LENGTH).trim();
  const lastSpace = clipped.lastIndexOf(" ");

  if (lastSpace >= 24) {
    return clipped.slice(0, lastSpace).trim();
  }

  return clipped;
}

function isLikelyGeneratedTitle(value: string) {
  const normalizedValue = normalizeResultText(value);
  const words = normalizedValue.split(" ").filter(Boolean);

  return words.length <= GENERATED_TITLE_MAX_WORDS && normalizedValue.length <= GENERATED_TITLE_MAX_LENGTH;
}

function normalizeForComparison(value: string) {
  return normalizeResultText(value).toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function getSharedPrefixLength(left: string, right: string) {
  const limit = Math.min(left.length, right.length);
  let index = 0;

  while (index < limit && left[index] === right[index]) {
    index += 1;
  }

  return index;
}

function isPromptLikeTitle(title: string, prompt: string) {
  if (!title || !prompt) {
    return false;
  }

  const normalizedTitle = normalizeForComparison(title);
  const normalizedPrompt = normalizeForComparison(prompt);

  if (!normalizedTitle || !normalizedPrompt) {
    return false;
  }

  if (normalizedTitle === normalizedPrompt) {
    return true;
  }

  const shortestLength = Math.min(normalizedTitle.length, normalizedPrompt.length);

  if (shortestLength < 24) {
    return false;
  }

  if (
    normalizedTitle.startsWith(normalizedPrompt) ||
    normalizedPrompt.startsWith(normalizedTitle) ||
    normalizedTitle.includes(normalizedPrompt) ||
    normalizedPrompt.includes(normalizedTitle)
  ) {
    return true;
  }

  const sharedPrefixRatio = getSharedPrefixLength(normalizedTitle, normalizedPrompt) / shortestLength;
  return sharedPrefixRatio >= 0.72;
}
