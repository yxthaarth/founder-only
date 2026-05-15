"use client";

import { useState } from "react";
import { DmSurface } from "@/components/dm-surface";
import { GroupsSurface } from "@/components/groups-surface";
import { LobbyFeed } from "@/components/lobby-feed";
import { NotificationsPanel } from "@/components/notifications";
import { Button, Panel } from "@/components/ui";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "global", label: "Global Chat" },
  { id: "dms", label: "Private DMs" },
  { id: "groups", label: "Groups" }
] as const;

type LobbyTab = (typeof tabs)[number]["id"];

export function LobbyHub() {
  const [tab, setTab] = useState<LobbyTab>("global");

  return (
    <div className="space-y-4">
      <Panel className="p-2">
        <div className="flex flex-wrap gap-2">
          {tabs.map((item) => (
            <Button
              key={item.id}
              variant={tab === item.id ? "secondary" : "ghost"}
              className={cn("rounded-xl", tab === item.id && "bg-zinc-950")}
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </Panel>

      {tab === "global" ? (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <LobbyFeed />
          <NotificationsPanel />
        </div>
      ) : null}

      {tab === "dms" ? <DmSurface /> : null}
      {tab === "groups" ? <GroupsSurface /> : null}
    </div>
  );
}
