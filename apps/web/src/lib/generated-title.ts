import { createOpenRouterClient } from "@openvideoui/openrouter";
import {
  buildFallbackTitle,
  buildTitleGenerationMessages,
  sanitizeGeneratedTitle
} from "@openvideoui/shared";

export const TITLE_MODEL_ID = "openrouter/free";
export const DEFAULT_TITLE_MODEL_ID = TITLE_MODEL_ID;

const TITLE_TIMEOUT_MS = 15_000;
// Higher than 24 so reasoning-style models that "think" before answering still
// have room to emit the actual title in `content`.
const TITLE_MAX_TOKENS = 200;
const TITLE_TEMPERATURE = 0.2;

export async function generateTitleFromPrompt(input: {
  apiKey: string;
  prompt: string;
  enabled?: boolean;
  fallback?: string;
  modelId?: string;
}) {
  const fallbackTitle = buildFallbackTitle(input.prompt, input.fallback);

  if (input.enabled === false) {
    return fallbackTitle;
  }

  const modelId = input.modelId || DEFAULT_TITLE_MODEL_ID;

  try {
    const client = createOpenRouterClient({
      apiKey: input.apiKey,
      timeoutMs: TITLE_TIMEOUT_MS
    });
    const response = await client.generateText({
      model: modelId,
      messages: buildTitleGenerationMessages(input.prompt),
      maxTokens: TITLE_MAX_TOKENS,
      temperature: TITLE_TEMPERATURE,
      // Reasoning models (e.g. deepseek-v4-flash) tend to spend their token
      // budget in `reasoning` and leave `content` null. Tell OpenRouter to
      // skip reasoning when supported; we only need the short title.
      reasoning: { exclude: true }
    });
    const message = response.choices[0]?.message;
    const rawContent = message?.content;
    // Fallback: if a reasoning model still returned content=null, try the
    // tail of `reasoning` (last line is usually the answer).
    const reasoningTail =
      !rawContent && typeof message?.reasoning === "string" && message.reasoning.trim()
        ? message.reasoning.trim().split(/\r?\n/).filter(Boolean).pop()
        : undefined;
    const generatedTitle = sanitizeGeneratedTitle(rawContent ?? reasoningTail);

    if (!generatedTitle) {
      console.warn(
        `[generated-title] model=${modelId} returned no usable title; using fallback. raw=`,
        rawContent
      );
      return fallbackTitle;
    }

    return generatedTitle;
  } catch (error) {
    console.warn(
      `[generated-title] model=${modelId} generation failed; using fallback.`,
      error instanceof Error ? error.message : error
    );
    return fallbackTitle;
  }
}
