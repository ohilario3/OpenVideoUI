import { ensureStarterWorkspace, upsertUser } from "./queries";

async function main() {
  const email = process.env.SEED_USER_EMAIL || "operator@example.com";
  const name = process.env.SEED_USER_NAME || "Studio Operator";

  const user = await upsertUser({ email, name });
  await ensureStarterWorkspace(user.id);

  console.log(`[seed] ready for ${user.email}`);
}

main().catch((error) => {
  console.error("[seed] failed", error);
  process.exitCode = 1;
});
