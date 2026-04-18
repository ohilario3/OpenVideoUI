import type { NextRequest } from "next/server";

const OPENROUTER_KEY_HEADER = "x-openrouter-key";

export function getOpenRouterApiKey(
  request: NextRequest,
  bodyApiKey?: string | null
) {
  return bodyApiKey || request.headers.get(OPENROUTER_KEY_HEADER) || undefined;
}

export const openRouterKeyHeader = OPENROUTER_KEY_HEADER;

