import { redirect } from "next/navigation";
import { OnboardingFlow } from "@/components/onboarding-flow";
import { getSession } from "@/lib/session";

export default async function SignInPage() {
  const session = await getSession();

  if (session) {
    redirect("/");
  }

  return <OnboardingFlow />;
}
