"use client";

import { Button, Panel, Stat } from "@/components/ui";
import { useStore } from "@/lib/store";

export function FoundersDirectory() {
  const { state, currentUser, requestConnection } = useStore();
  const founders = state.profiles.filter((profile) => profile.role === "founder");

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
      <Panel className="p-5">
        <div className="mb-5">
          <h2 className="text-sm font-medium text-white">Founder Directory</h2>
          <p className="mt-1 text-sm text-zinc-500">Verified identity, active project state, and access control.</p>
        </div>
        <div className="space-y-4">
          {founders.map((founder) => {
            const startup = state.startups.find((item) => item.founder_id === founder.id);
            const connection = state.connections.find(
              (item) =>
                (item.sender_id === currentUser.id && item.receiver_id === founder.id) ||
                (item.sender_id === founder.id && item.receiver_id === currentUser.id)
            );
            const sharedGroupAccess = startup?.members.includes(currentUser.id);
            const dmOpen = connection?.status === "accepted" || sharedGroupAccess;

            return (
              <div key={founder.id} className="rounded-[4px] border border-line bg-zinc-950 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3">
                    <img
                      src={founder.avatarUrl}
                      alt={founder.name}
                      className="h-11 w-11 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm text-white">{founder.name}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.12em] text-zinc-500">
                        Identity: Founder
                      </p>
                    </div>
                  </div>
                  {connection?.status === "accepted" || sharedGroupAccess ? (
                    <span className="font-mono text-xs text-zinc-400">DM: Open</span>
                  ) : (
                    <Button variant="secondary" onClick={() => requestConnection(founder.id)}>
                      Request Access
                    </Button>
                  )}
                </div>
                <p className="mt-4 text-sm leading-6 text-zinc-400">{founder.bio}</p>
                {startup ? (
                  <div className="mt-4 rounded-[4px] border border-line bg-surface px-4 py-3">
                    <p className="text-sm text-white">{startup.name}</p>
                    <p className="mt-2 text-sm text-zinc-400">{startup.pitch}</p>
                  </div>
                ) : null}
                <div className="mt-4 flex gap-6">
                  <Stat label="Status" value={founder.is_verified ? "Verified" : "Pending"} />
                  <Stat label="DM" value={dmOpen ? "Open" : "Restricted"} />
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      <div className="space-y-4">
        <Panel className="p-4">
          <h3 className="text-sm font-medium text-white">Restriction Logic</h3>
          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Users can only message founders after a connection is accepted. Shared project membership also lifts the
            restriction.
          </p>
        </Panel>
      </div>
    </div>
  );
}
