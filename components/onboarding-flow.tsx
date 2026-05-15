"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input, Label, PageTransition, Panel, Textarea } from "@/components/ui";
import { ONBOARDING_PATH, skillOptions } from "@/lib/constants";
import { useStore } from "@/lib/store";

export function OnboardingFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentUser, state, updateDraft, setDraftStep, completeBuilderOnboarding, completeFounderOnboarding } =
    useStore();
  const draft = state.onboardingDrafts[currentUser.id];
  const step = Number(searchParams.get("step") ?? draft?.step ?? 1) as 1 | 2 | 3;

  useEffect(() => {
    if (currentUser.onboarding_status === "complete") {
      router.replace("/lobby");
      return;
    }

    const next = new URLSearchParams(searchParams.toString());
    next.set("step", String(draft?.step ?? 1));
    router.replace(`${ONBOARDING_PATH}?${next.toString()}`);
  }, [currentUser.onboarding_status, draft?.step, router, searchParams]);

  if (!draft) return null;

  const founderStepOneValid = draft.founder.name.trim() && draft.founder.vision.trim();
  const founderStepTwoValid = draft.founder.github_url.trim() && draft.founder.demo_url.trim();
  const builderValid = draft.builder.bio.trim() && draft.builder.skills.length > 0;

  return (
    <PageTransition>
      <main className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-10">
        <Panel className="w-full p-8">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">Onboarding</p>
            <h1 className="mt-2 text-2xl font-medium text-white">Choose a path and complete setup.</h1>
          </div>

          {!draft.path ? (
            <div className="grid gap-4 md:grid-cols-2">
              <button
                className="rounded-[4px] border border-line bg-zinc-950 p-5 text-left transition hover:bg-surface"
                onClick={() => updateDraft({ path: "founder", step: 1 })}
              >
                <p className="text-sm text-white">I am a Founder</p>
                <p className="mt-2 text-sm text-zinc-500">Project submission, queue review, verified founder tools.</p>
              </button>
              <button
                className="rounded-[4px] border border-line bg-zinc-950 p-5 text-left transition hover:bg-surface"
                onClick={() => updateDraft({ path: "builder", step: 1 })}
              >
                <p className="text-sm text-white">I am a Builder</p>
                <p className="mt-2 text-sm text-zinc-500">Skill-based profile, lobby access, founder discovery.</p>
              </button>
            </div>
          ) : null}

          {draft.path === "founder" ? (
            <div className="space-y-6">
              <div className="font-mono text-xs text-zinc-500">Step {draft.step} of 3</div>

              {step === 1 ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Project Name</Label>
                    <Input
                      value={draft.founder.name}
                      onChange={(event) => updateDraft({ founder: { name: event.target.value } })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Vision</Label>
                    <Textarea
                      rows={6}
                      value={draft.founder.vision}
                      onChange={(event) => updateDraft({ founder: { vision: event.target.value } })}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={() => {
                        if (!founderStepOneValid) return;
                        setDraftStep(2);
                        router.replace("/onboarding?step=2");
                      }}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              ) : null}

              {step === 2 ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>GitHub URL</Label>
                    <Input
                      value={draft.founder.github_url}
                      onChange={(event) => updateDraft({ founder: { github_url: event.target.value } })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Demo URL</Label>
                    <Input
                      value={draft.founder.demo_url}
                      onChange={(event) => updateDraft({ founder: { demo_url: event.target.value } })}
                    />
                  </div>
                  <div className="flex justify-between">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setDraftStep(1);
                        router.replace("/onboarding?step=1");
                      }}
                    >
                      Back
                    </Button>
                    <Button
                      onClick={() => {
                        if (!founderStepTwoValid) return;
                        setDraftStep(3);
                        router.replace("/onboarding?step=3");
                      }}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              ) : null}

              {step === 3 ? (
                <div className="space-y-4">
                  <Panel className="bg-zinc-950 p-4">
                    <p className="text-sm text-white">{draft.founder.name}</p>
                    <p className="mt-2 text-sm text-zinc-400">{draft.founder.vision}</p>
                    <p className="mt-3 font-mono text-xs text-zinc-500">{draft.founder.github_url}</p>
                    <p className="mt-1 font-mono text-xs text-zinc-500">{draft.founder.demo_url}</p>
                  </Panel>
                  <div className="flex justify-between">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setDraftStep(2);
                        router.replace("/onboarding?step=2");
                      }}
                    >
                      Back
                    </Button>
                    <Button onClick={() => completeFounderOnboarding(draft.founder)}>Submit</Button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {draft.path === "builder" ? (
            <div className="space-y-6">
              <div className="font-mono text-xs text-zinc-500">Step 1 of 1</div>
              <div className="space-y-2">
                <Label>Skills</Label>
                <div className="flex flex-wrap gap-2">
                  {skillOptions.map((skill) => {
                    const active = draft.builder.skills.includes(skill);
                    return (
                      <button
                        key={skill}
                        className={`rounded-[4px] border px-3 py-2 text-sm transition ${
                          active
                            ? "border-zinc-500 bg-surface text-white"
                            : "border-line bg-zinc-950 text-zinc-400 hover:text-white"
                        }`}
                        onClick={() =>
                          updateDraft({
                            builder: {
                              skills: active
                                ? draft.builder.skills.filter((item) => item !== skill)
                                : [...draft.builder.skills, skill]
                            }
                          })
                        }
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea
                  rows={6}
                  value={draft.builder.bio}
                  onChange={(event) => updateDraft({ builder: { bio: event.target.value } })}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={() => builderValid && completeBuilderOnboarding(draft.builder)}>Complete</Button>
              </div>
            </div>
          ) : null}
        </Panel>
      </main>
    </PageTransition>
  );
}
