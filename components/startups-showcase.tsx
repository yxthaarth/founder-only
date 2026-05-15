"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Button, Panel, Stat } from "@/components/ui";
import { useStore } from "@/lib/store";

export function StartupsShowcase() {
  const { state, currentUser, requestConnection } = useStore();

  const startups = useMemo(
    () =>
      state.startups.map((startup) => {
        const founder = state.profiles.find((profile) => profile.id === startup.founder_id);
        const members = startup.members
          .map((memberId) => state.profiles.find((profile) => profile.id === memberId))
          .filter(Boolean);

        const connection = state.connections.find(
          (item) =>
            (item.sender_id === currentUser.id && item.receiver_id === startup.founder_id) ||
            (item.sender_id === startup.founder_id && item.receiver_id === currentUser.id)
        );

        return {
          startup,
          founder,
          members,
          dmOpen: connection?.status === "accepted" || startup.members.includes(currentUser.id)
        };
      }),
    [currentUser.id, state.connections, state.profiles, state.startups]
  );

  return (
    <div className="space-y-4">
      {startups.map(({ startup, founder, members, dmOpen }) => (
        <Panel key={startup.id} className="overflow-hidden">
          <div className="relative h-44 w-full overflow-hidden">
            <img src={startup.imageUrl} alt={startup.name} className="h-full w-full object-cover opacity-70" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-[#18181b]" />
          </div>
          <div className="p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
	              <div>
	                <div className="mb-4 flex items-center gap-4">
	                  {founder ? (
	                    <img src={founder.avatarUrl} alt={founder.name} className="h-14 w-14 rounded-full object-cover" />
	                  ) : null}
	                  <div>
	                    <p className="text-sm text-zinc-300">{founder?.name}</p>
	                    <p className="mt-1 text-sm text-zinc-500">{founder?.experience?.[0]?.role ?? founder?.role ?? "Member"}</p>
	                  </div>
	                </div>
              <div className="flex items-center gap-3">
                <Link href={`/startups/${startup.id}`} className="text-xl font-semibold text-white hover:text-zinc-300">
                  {startup.name}
                </Link>
                <span className="font-mono text-xs text-zinc-500">{startup.status}</span>
              </div>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400">{startup.pitch}</p>
              </div>
              {founder && !dmOpen && currentUser.id !== founder.id ? (
                <Button variant="secondary" onClick={() => requestConnection(founder.id)}>
                  Request Access
                </Button>
              ) : null}
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div className="rounded-2xl border border-line bg-zinc-950 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">Team</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {members.map((member) =>
                    member ? (
                      <div key={member.id} className="flex items-center gap-3 rounded-xl border border-line px-3 py-2">
                        <img src={member.avatarUrl} alt={member.name} className="h-9 w-9 rounded-full object-cover" />
                        <div>
                          <p className="text-sm text-white">{member.name}</p>
                          <p className="text-xs text-zinc-500">{member.role}</p>
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-line bg-zinc-950 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">Access</p>
                <div className="mt-4 flex gap-6">
                  <Stat label="DM" value={dmOpen ? "Open" : "Restricted"} />
                  <Stat label="Members" value={members.length} />
                </div>
                <div className="mt-5">
                  <Link href={`/startups/${startup.id}`}>
                    <Button variant="secondary">View Startup</Button>
                  </Link>
                </div>
                <div className="mt-3">
                  <Link href={`/crowdfund?startup=${startup.id}`}>
                    <Button variant="ghost">View Support</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Panel>
      ))}
    </div>
  );
}
