export type RuntimeEnv = {
  appName: string;
  nodeEnv: string;
  databaseUrl: string;
  redisUrl: string;
  assetStorageDir: string;
  openRouterApiKey: string;
  openRouterBaseUrl: string;
  openRouterHttpReferer: string;
  openRouterTitle: string;
};

export function readRuntimeEnv(source: NodeJS.ProcessEnv = process.env): RuntimeEnv {
  return {
    appName: source.APP_NAME || "Creative AI Studio",
    nodeEnv: source.NODE_ENV || "development",
    databaseUrl: source.DATABASE_URL || "",
    redisUrl: source.REDIS_URL || "",
    assetStorageDir: source.ASSET_STORAGE_DIR || ".data/assets",
    openRouterApiKey: source.OPENROUTER_API_KEY || "",
    openRouterBaseUrl: source.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
    openRouterHttpReferer: source.OPENROUTER_HTTP_REFERER || "",
    openRouterTitle: source.OPENROUTER_TITLE || "Creative AI Studio"
  };
}
