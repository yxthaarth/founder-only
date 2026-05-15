import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const cookieStore = await cookies();
  const authenticated = cookieStore.get("fo_auth")?.value;
  const onboardingStatus = cookieStore.get("fo_onboarding_status")?.value;

  if (authenticated !== "1") {
    redirect("/login");
  }

  if (onboardingStatus !== "complete") {
    redirect("/onboarding");
  }

  redirect("/lobby");
}
