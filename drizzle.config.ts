import type { Config } from "drizzle-kit";

const config: Config = {
  out: "./drizzle",
  schema: "./packages/database/src/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgresql://studio:studio@localhost:5432/studio"
  }
};

export default config;

