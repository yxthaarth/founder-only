"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Panel, PageTransition } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import { useStore } from "@/lib/store";

export function LoginScreen() {
  const router = useRouter();
  const { loginWithGoogle, isAuthenticated } = useStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/auth/callback");
    }
  }, [isAuthenticated, router]);

  return (
    <PageTransition>
      <main className="mx-auto flex min-h-screen max-w-xl items-center px-4">
        <Panel className="w-full p-8">
          <div className="space-y-3">
            <p className="text-3xl font-semibold tracking-tight text-white">Xlr8ter</p>
            <p className="text-sm leading-6 text-zinc-500">
              Sign in with Google to access the startup network, onboarding flow, project tools, and funding surfaces.
            </p>
          </div>
          <div className="mt-8">
            <Button
              className="w-full"
              onClick={async () => {
                await loginWithGoogle();
                const supabase = createClient();
                if (supabase) {
                  await supabase.auth.signInWithOAuth({
                    provider: "google",
                    options: {
                      redirectTo: `${window.location.origin}/auth/callback`
                    }
                  });
                } else {
                  router.push("/auth/callback");
                }
              }}
            >
              Continue with Google
            </Button>
          </div>
        </Panel>
      </main>
    </PageTransition>
  );
}
