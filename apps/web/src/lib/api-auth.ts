import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function requireSession() {
  const session = await getSession();

  if (!session) {
    return {
      session: null,
      unauthorized: NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    };
  }

  return {
    session,
    unauthorized: null
  };
}

