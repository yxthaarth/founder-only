"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button, Input, Label, Panel, Textarea } from "@/components/ui";
import { useStore } from "@/lib/store";
import { formatTimestamp } from "@/lib/utils";

export function JobsSurface({ mode }: { mode: "browse" | "manage" | "applications" }) {
  const {
    state,
    currentUser,
    addOpening,
    deleteOpening,
    applyToOpening,
    updateApplicationStatus,
    createFollowUpThread,
    setHiringAccess
  } = useStore();
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [applicationNotes, setApplicationNotes] = useState<Record<string, string>>({});
  const [confirmDeleteOpeningId, setConfirmDeleteOpeningId] = useState<string | null>(null);
  const [followUpDrafts, setFollowUpDrafts] = useState<Record<string, string>>({});

  const managedStartup = useMemo(
    () =>
      state.startups.find(
        (startup) =>
          startup.founder_id === currentUser.id ||
          (startup.members.includes(currentUser.id) && startup.hiring_manager_ids.includes(currentUser.id))
      ),
    [currentUser.id, state.startups]
  );

  const founderOwnsStartup = Boolean(managedStartup && managedStartup.founder_id === currentUser.id);
  const canManageHiring = Boolean(
    managedStartup &&
      currentUser.is_verified &&
      (founderOwnsStartup || managedStartup.hiring_manager_ids.includes(currentUser.id))
  );

  const availableOpenings = useMemo(
    () =>
      state.startups.flatMap((startup) =>
        startup.openings.map((opening) => ({
          ...opening,
          startupId: startup.id,
          startupName: startup.name
        }))
      ),
    [state.startups]
  );

  const managedApplications = useMemo(
    () =>
      managedStartup
        ? state.jobApplications
            .map((application) => {
              const opening = managedStartup.openings.find((entry) => entry.id === application.openingId);
              const applicant = state.profiles.find((profile) => profile.id === application.userId);
              return opening && applicant ? { application, opening, applicant } : null;
            })
            .filter(Boolean)
        : [],
    [managedStartup, state.jobApplications, state.profiles]
  );

  if (mode === "manage") {
    if (!canManageHiring || !managedStartup) {
      return (
        <Panel className="p-6">
          <h2 className="text-sm font-medium text-white">Manage Jobs</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-500">
            Only a founder or a founder-approved team member can create hiring posts.
          </p>
        </Panel>
      );
    }

    return (
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <Panel className="p-6">
          <h3 className="text-sm font-medium text-white">Manage Jobs</h3>
          <div className="mt-5 space-y-4">
            <div className="space-y-2">
              <Label>Role</Label>
              <Input value={title} onChange={(event) => setTitle(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Need</Label>
              <Textarea rows={6} value={detail} onChange={(event) => setDetail(event.target.value)} />
            </div>
            <Button
              onClick={() => {
                if (!title || !detail) return;
                addOpening({ title, detail });
                setTitle("");
                setDetail("");
              }}
            >
              Post Job
            </Button>
          </div>

          <div className="mt-8 space-y-3">
            {managedStartup.openings.map((opening) => (
              <div key={opening.id} className="rounded-2xl border border-line bg-zinc-950 px-4 py-4">
                <p className="text-sm text-white">{opening.title}</p>
                <p className="mt-2 whitespace-pre-line text-sm text-zinc-400">{opening.detail}</p>
                <div className="mt-4">
                  <Button
                    variant={confirmDeleteOpeningId === opening.id ? "danger" : "ghost"}
                    onClick={() => {
                      if (confirmDeleteOpeningId === opening.id) {
                        deleteOpening(opening.id);
                        setConfirmDeleteOpeningId(null);
                        return;
                      }
                      setConfirmDeleteOpeningId(opening.id);
                    }}
                  >
                    {confirmDeleteOpeningId === opening.id ? "Confirm Delete" : "Delete Job"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {founderOwnsStartup ? (
          <Panel className="p-6">
            <h4 className="text-sm font-medium text-white">Posting Access</h4>
            <div className="mt-4 space-y-3">
              {managedStartup.members
                .filter((memberId) => memberId !== managedStartup.founder_id)
                .map((memberId) => {
                  const member = state.profiles.find((profile) => profile.id === memberId);
                  if (!member) return null;
                  const enabled = managedStartup.hiring_manager_ids.includes(memberId);
                  return (
                    <div key={memberId} className="flex items-center justify-between rounded-2xl border border-line bg-zinc-950 px-4 py-3">
                      <div>
                        <p className="text-sm text-white">{member.name}</p>
                        <p className="mt-1 text-sm text-zinc-500">{member.email}</p>
                      </div>
                      <Button
                        variant={enabled ? "secondary" : "ghost"}
                        onClick={() =>
                          setHiringAccess({
                            startupId: managedStartup.id,
                            userId: memberId,
                            enabled: !enabled
                          })
                        }
                      >
                        {enabled ? "Can Post" : "Grant Access"}
                      </Button>
                    </div>
                  );
                })}
            </div>
          </Panel>
        ) : null}
      </div>
    );
  }

  if (mode === "applications") {
    if (!canManageHiring || !managedStartup) {
      return (
        <Panel className="p-6">
          <h2 className="text-sm font-medium text-white">Job Applications</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-500">
            Only a founder or an approved hiring teammate can review incoming applications.
          </p>
        </Panel>
      );
    }

    return (
      <Panel className="p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-medium text-white">Job Applications</h3>
            <p className="mt-1 text-sm text-zinc-500">Review applicants, update decisions, and continue in private when needed.</p>
          </div>
          <Link href="/dms" className="text-sm text-zinc-400 transition hover:text-white">
            Open DMs
          </Link>
        </div>

        <div className="mt-5 space-y-3">
          {managedApplications.length ? (
            managedApplications.map((item) =>
              item ? (
                <div key={item.application.id} className="rounded-2xl border border-line bg-zinc-950 p-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <img src={item.applicant.avatarUrl} alt={item.applicant.name} className="h-10 w-10 rounded-full object-cover" />
                        <div>
                          <p className="text-sm text-white">{item.applicant.name}</p>
                          <p className="mt-1 text-sm text-zinc-500">{item.opening.title}</p>
                        </div>
                      </div>
                      <p className="mt-3 text-xs text-zinc-500">{formatTimestamp(item.application.createdAt)}</p>
                    </div>
                    <span className="font-mono text-xs uppercase text-zinc-500">{item.application.status}</span>
                  </div>

                  <p className="mt-4 whitespace-pre-line text-sm leading-6 text-zinc-300">{item.application.note}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => updateApplicationStatus({ applicationId: item.application.id, status: "accepted" })}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => updateApplicationStatus({ applicationId: item.application.id, status: "rejected" })}
                    >
                      Reject
                    </Button>
                  </div>

                  <div className="mt-4 grid gap-2 md:grid-cols-[minmax(0,1fr)_auto]">
                    <Input
                      value={followUpDrafts[item.application.id] ?? ""}
                      onChange={(event) =>
                        setFollowUpDrafts((current) => ({ ...current, [item.application.id]: event.target.value }))
                      }
                      placeholder="Send a private follow-up and move this into DMs"
                    />
                    <Button
                      onClick={() => {
                        const threadId = createFollowUpThread({
                          applicationId: item.application.id,
                          openingId: item.opening.id,
                          body: followUpDrafts[item.application.id] ?? "Thanks for applying. Let's continue in private."
                        });
                        if (!threadId) return;
                        setFollowUpDrafts((current) => ({ ...current, [item.application.id]: "" }));
                      }}
                    >
                      Follow Up in DMs
                    </Button>
                  </div>
                </div>
              ) : null
            )
          ) : (
            <div className="rounded-2xl border border-line bg-zinc-950 p-4 text-sm text-zinc-500">
              No applications yet.
            </div>
          )}
        </div>
      </Panel>
    );
  }

  return (
    <Panel className="p-6">
      <div className="mb-6">
        <h2 className="text-sm font-medium text-white">Jobs</h2>
        <p className="mt-1 text-sm text-zinc-500">Active hiring posts across the network.</p>
      </div>

      <div className="space-y-4">
        {availableOpenings.map((opening) => (
          <div key={opening.id} className="rounded-2xl border border-line bg-zinc-950 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-white">{opening.title}</p>
                <p className="mt-1 text-sm text-zinc-500">{opening.startupName}</p>
                <p className="mt-3 whitespace-pre-line text-sm leading-6 text-zinc-400">{opening.detail}</p>
              </div>
            </div>
            {currentUser.role === "user" ? (
              <div className="mt-4 flex flex-col gap-3 md:flex-row">
                <Input
                  value={applicationNotes[opening.id] ?? ""}
                  onChange={(event) =>
                    setApplicationNotes((current) => ({ ...current, [opening.id]: event.target.value }))
                  }
                  placeholder="Why are you a fit?"
                />
                <Button
                  onClick={() =>
                    applyToOpening({
                      openingId: opening.id,
                      note: applicationNotes[opening.id] ?? "Interested in this role."
                    })
                  }
                >
                  Apply
                </Button>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </Panel>
  );
}
