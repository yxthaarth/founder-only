"use client";

import { useMemo, useState } from "react";
import { Button, Input, Label, Panel, Textarea } from "@/components/ui";
import { useStore } from "@/lib/store";

export function ProjectSurface() {
  const { state, currentUser, currentStartup, addOpening } = useStore();
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const isFounder = currentUser.role === "founder";
  const showVerifiedTools = currentUser.is_verified;

  const builderResults = useMemo(
    () => state.profiles.filter((profile) => profile.role === "founder"),
    [state.profiles]
  );

  if (!isFounder) {
    return (
      <Panel className="p-5">
        <h2 className="text-sm font-medium text-white">Project Search</h2>
        <p className="mt-1 text-sm text-zinc-500">Builder view of active founder projects and hiring signals.</p>
        <div className="mt-5 space-y-4">
          {builderResults.map((founder) => {
            const startup = state.startups.find((item) => item.founder_id === founder.id);
            if (!startup) return null;
            return (
              <div key={startup.id} className="rounded-[4px] border border-line bg-zinc-950 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-white">{startup.name}</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">{startup.pitch}</p>
                  </div>
                  <span className="font-mono text-xs text-zinc-500">{startup.status}</span>
                </div>
                <div className="mt-4 space-y-2">
                  {startup.openings.map((opening) => (
                    <div key={opening.id} className="rounded-[4px] border border-line bg-surface px-3 py-2">
                      <p className="text-sm text-white">{opening.title}</p>
                      <p className="mt-1 text-sm text-zinc-400">{opening.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
      <Panel className="p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-medium text-white">Project</h2>
            <p className="mt-1 text-sm text-zinc-500">Founder-owned project state, recruiting, and milestones.</p>
          </div>
          <span className="font-mono text-xs text-zinc-500">
            Status: {currentUser.is_verified ? "Verified" : "Pending"}
          </span>
        </div>

        {currentStartup ? (
          <div className="mt-5 space-y-5">
            <div className="rounded-[4px] border border-line bg-zinc-950 p-4">
              <p className="text-sm text-white">{currentStartup.name}</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{currentStartup.pitch}</p>
            </div>

            {showVerifiedTools ? (
              <>
                <div className="rounded-[4px] border border-line bg-zinc-950 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm text-white">Recruit</p>
                    <span className="font-mono text-xs text-zinc-500">Job Board</span>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label>Role</Label>
                        <Input value={title} onChange={(event) => setTitle(event.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Need</Label>
                        <Textarea rows={5} value={detail} onChange={(event) => setDetail(event.target.value)} />
                      </div>
                      <Button
                        onClick={() => {
                          if (!title || !detail) return;
                          addOpening({ title, detail });
                          setTitle("");
                          setDetail("");
                        }}
                      >
                        Post Need
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {currentStartup.openings.map((opening) => (
                        <div key={opening.id} className="rounded-[4px] border border-line bg-surface px-3 py-3">
                          <p className="text-sm text-white">{opening.title}</p>
                          <p className="mt-1 text-sm text-zinc-400">{opening.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-[4px] border border-line bg-zinc-950 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm text-white">Crowdfund</p>
                    <a
                      href={process.env.NEXT_PUBLIC_STRIPE_CONNECT_URL ?? "#"}
                      className="text-sm text-zinc-400 underline-offset-4 hover:underline"
                    >
                      Stripe Connect
                    </a>
                  </div>
                  <div className="space-y-4">
                    {currentStartup.milestones.map((milestone) => (
                      <div key={milestone.label}>
                        <div className="mb-2 flex items-center justify-between">
                          <p className="text-sm text-zinc-300">{milestone.label}</p>
                          <p className="font-mono text-xs text-zinc-500">{milestone.progress}%</p>
                        </div>
                        <div className="h-2 w-full border border-line bg-surface">
                          <div className="h-full bg-zinc-200" style={{ width: `${milestone.progress}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-[4px] border border-line bg-zinc-950 p-4 text-sm text-zinc-500">
                Verified tools remain hidden until identity verification is complete.
              </div>
            )}
          </div>
        ) : (
          <div className="mt-5 rounded-[4px] border border-line bg-zinc-950 p-4 text-sm text-zinc-500">
            No startup record found.
          </div>
        )}
      </Panel>

      <Panel className="p-4">
        <h3 className="text-sm font-medium text-white">Notifications</h3>
        <p className="mt-2 text-sm text-zinc-500">Review incoming access requests and queue updates.</p>
      </Panel>
    </div>
  );
}
