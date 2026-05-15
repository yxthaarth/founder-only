"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Button, Input, Panel, Stat } from "@/components/ui";
import { useStore } from "@/lib/store";

export function ProfileSurface() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    state,
    currentUser,
    currentStartup,
    requestConnection,
    openDirectMessageThread
  } = useStore();
  const viewedUserId = searchParams.get("user") ?? currentUser.id;
  const viewedUser = state.profiles.find((profile) => profile.id === viewedUserId) ?? currentUser;
  const viewedStartup = state.startups.find((startup) => startup.founder_id === viewedUser.id);
  const [peopleSearch, setPeopleSearch] = useState("");

  const connection = state.connections.find(
    (item) =>
      (item.sender_id === currentUser.id && item.receiver_id === viewedUser.id) ||
      (item.sender_id === viewedUser.id && item.receiver_id === currentUser.id)
  );
  const sharedStartup = state.startups.some(
    (startup) => startup.members.includes(currentUser.id) && startup.members.includes(viewedUser.id)
  );
  const canMessage = viewedUser.id !== currentUser.id && (connection?.status === "accepted" || sharedStartup);
  const pendingRequest = viewedUser.id !== currentUser.id && connection?.status === "pending";

  const searchableProfiles = useMemo(() => {
    const query = peopleSearch.trim().toLowerCase();
    return state.profiles
      .filter((profile) => profile.id !== currentUser.id && profile.role !== "admin")
      .filter((profile) => {
        if (!query) return true;
        return (
          profile.name.toLowerCase().includes(query) ||
          profile.email.toLowerCase().includes(query) ||
          profile.id.toLowerCase().includes(query)
        );
      });
  }, [currentUser.id, peopleSearch, state.profiles]);

  const networkProfiles = useMemo(
    () =>
      state.connections
        .filter(
          (connection) =>
            connection.status === "accepted" &&
            (connection.sender_id === currentUser.id || connection.receiver_id === currentUser.id)
        )
        .map((connection) =>
          state.profiles.find((profile) =>
            profile.id === (connection.sender_id === currentUser.id ? connection.receiver_id : connection.sender_id)
          )
        )
        .filter(Boolean),
    [currentUser.id, state.connections, state.profiles]
  );

  const openDm = (userId: string) => {
    const threadId = openDirectMessageThread(userId);
    if (!threadId) return;
    router.push(`/dms?thread=${threadId}`);
  };

  return (
    <div className="space-y-4">
      <Panel className="overflow-hidden">
        <div className="relative h-36 w-full overflow-hidden">
          <img src={viewedUser.bannerUrl} alt={viewedUser.name} className="h-full w-full object-cover opacity-55" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/35 to-[#18181b]" />
        </div>
        <div className="px-6 pb-6 pt-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-end gap-4">
              <img
                src={viewedUser.avatarUrl}
                alt={viewedUser.name}
                className="h-24 w-24 rounded-full border-4 border-[#18181b] bg-zinc-900 object-cover"
              />
              <div className="pb-2">
                <h2 className="text-2xl font-semibold text-white">{viewedUser.name}</h2>
                <p className="mt-1 text-sm text-zinc-500">Role: {viewedUser.role}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 pb-2">
              <div className="flex gap-6">
                <Stat label="Status" value={viewedUser.is_verified ? "Verified" : "Unverified"} />
                <Stat label="Skills" value={viewedUser.skills.length} />
              </div>
              {viewedUser.id !== currentUser.id ? (
                <>
                  {canMessage ? (
                    <Button variant="secondary" onClick={() => openDm(viewedUser.id)}>
                      Message
                    </Button>
                  ) : null}
                  {!canMessage && !pendingRequest ? (
                    <>
                      <Button variant="secondary" onClick={() => requestConnection(viewedUser.id, "network")}>
                        Add to Network
                      </Button>
                      <Button variant="ghost" onClick={() => requestConnection(viewedUser.id, "message")}>
                        Message Request
                      </Button>
                    </>
                  ) : null}
                  {pendingRequest ? <span className="text-sm text-zinc-500">Request Pending</span> : null}
                </>
              ) : null}
            </div>
          </div>
        </div>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Panel className="p-6">
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">Bio</p>
              <p className="mt-3 text-sm leading-6 text-zinc-300">{viewedUser.bio || "No bio added yet."}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">Education</p>
              <div className="mt-3 space-y-2">
                {viewedUser.education.length > 0 ? (
                  viewedUser.education.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 rounded-2xl border border-line bg-zinc-950 px-4 py-3">
                      <img src={item.logoUrl} alt={item.school} className="h-10 w-10 rounded-lg object-cover" />
                      <div>
                        <p className="text-sm text-white">{item.school}</p>
                        <p className="text-sm text-zinc-500">{item.detail}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-zinc-500">Not added yet.</p>
                )}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">Experience</p>
              <div className="mt-3 space-y-2">
                {viewedUser.experience.length > 0 ? (
                  viewedUser.experience.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 rounded-2xl border border-line bg-zinc-950 px-4 py-3"
                    >
                      <img src={item.logoUrl} alt={item.company} className="mt-0.5 h-10 w-10 rounded-lg object-cover" />
                      <div>
                        <p className="text-sm text-white">{item.role}</p>
                        <p className="mt-1 text-sm text-zinc-400">{item.company}</p>
                        <p className="mt-1 text-sm leading-6 text-zinc-500">{item.summary}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-zinc-500">Not added yet.</p>
                )}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">Skills</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {viewedUser.skills.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="rounded-full border border-line bg-zinc-950 px-3 py-1 text-sm text-zinc-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Panel>

        <div className="space-y-4">
          {viewedUser.role === "founder" && viewedStartup ? (
            <Panel className="p-6">
              <p className="text-sm font-medium text-white">Project Card</p>
              <div className="mt-4 rounded-2xl border border-line bg-zinc-950 p-4">
                <p className="text-lg font-semibold text-white">{viewedStartup.name}</p>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{viewedStartup.pitch}</p>
              </div>
            </Panel>
          ) : null}

          <Panel className="p-6">
            <p className="text-sm font-medium text-white">Search People</p>
            <div className="mt-4">
              <Input
                value={peopleSearch}
                onChange={(event) => setPeopleSearch(event.target.value)}
                placeholder="Search by name, email, or user id"
              />
            </div>
            <div className="mt-4 space-y-3">
              {searchableProfiles.slice(0, 8).map((profile) => {
                const profileStartup = state.startups.find((startup) => startup.founder_id === profile.id);
                return (
                  <div key={profile.id} className="rounded-2xl border border-line bg-zinc-950 p-4">
                    <div className="flex items-start gap-3">
                      <img src={profile.avatarUrl} alt={profile.name} className="h-10 w-10 rounded-full object-cover" />
                      <div className="min-w-0 flex-1">
                        <Link href={`/profile?user=${profile.id}`} className="text-sm text-white hover:text-zinc-300">
                          {profile.name}
                        </Link>
                        <p className="mt-1 text-xs text-zinc-500">{profile.id}</p>
                        <p className="mt-1 text-sm text-zinc-500">{profileStartup?.name ?? profile.email}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel className="p-6">
            <p className="text-sm font-medium text-white">Your Network</p>
            <div className="mt-4 space-y-3">
              {networkProfiles.length ? (
                networkProfiles.map((profile) =>
                  profile ? (
                    <div key={profile.id} className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-zinc-950 p-4">
                      <div className="flex items-center gap-3">
                        <img src={profile.avatarUrl} alt={profile.name} className="h-10 w-10 rounded-full object-cover" />
                        <div>
                          <Link href={`/profile?user=${profile.id}`} className="text-sm text-white hover:text-zinc-300">
                            {profile.name}
                          </Link>
                          <p className="mt-1 text-sm text-zinc-500">{profile.id}</p>
                        </div>
                      </div>
                      <Button variant="secondary" onClick={() => openDm(profile.id)}>
                        Message
                      </Button>
                    </div>
                  ) : null
                )
              ) : (
                <div className="rounded-2xl border border-line bg-zinc-950 p-4 text-sm text-zinc-500">
                  No network connections yet.
                </div>
              )}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
