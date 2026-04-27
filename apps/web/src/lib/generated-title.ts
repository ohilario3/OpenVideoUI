import { createOpenRouterClient } from "@openvideoui/openrouter";
import {
  buildFallbackTitle,
  buildTitleGenerationMessages,
  sanitizeGeneratedTitle
} from "@openvideoui/shared";

export const TITLE_MODEL_ID = "openrouter/free";
export const DEFAULT_TITLE_MODEL_ID = TITLE_MODEL_ID;

const TITLE_TIMEOUT_MS = 10_000;
const TITLE_MAX_TOKENS = 24;
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
      temperature: TITLE_TEMPERATURE
    });
    const rawContent = response.choices[0]?.message?.content;
    const generatedTitle = sanitizeGeneratedTitle(rawContent);

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
