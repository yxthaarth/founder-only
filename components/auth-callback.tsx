"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageTransition } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import { useStore } from "@/lib/store";

export function AuthCallbackScreen() {
  const router = useRouter();
  const { state, hydrateGoogleUser } = useStore();

  useEffect(() => {
    async function resolveUser() {
      const supabase = createClient();
      if (supabase) {
        await supabase.auth.getSession();
      }

      const raw = window.localStorage.getItem("xlr8ter-google-user");
      const fallback = { email: "founder@xlr8ter.dev", name: "Iris Vale" };
      const googleUser = raw ? JSON.parse(raw) : fallback;

      const existing = state.profiles.find((profile) => profile.email === googleUser.email);
      if (!existing) {
        hydrateGoogleUser(googleUser);
        router.replace("/onboarding");
        return;
      }

      if (existing.onboarding_status !== "complete") {
        router.replace("/onboarding");
        return;
      }

      router.replace("/lobby");
    }

    resolveUser();
  }, [hydrateGoogleUser, router, state.profiles]);

  return (
    <PageTransition>
      <main className="flex min-h-screen items-center justify-center px-4">
        <p className="text-sm text-zinc-500">Completing sign-in…</p>
      </main>
    </PageTransition>
  );
}
