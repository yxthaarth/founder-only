"use client";

import { useEffect, useState } from "react";
import { Button, Input, Panel } from "@/components/ui";
import { useStore } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";
import { formatTimestamp } from "@/lib/utils";

export function LobbyFeed() {
  const { state, currentUser, sendLobbyMessage, syncRealtimeMessage } = useStore();
  const [draft, setDraft] = useState("");

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    const channel = supabase.channel("global-lobby");
    channel.on("broadcast", { event: "message" }, ({ payload }) => {
      syncRealtimeMessage(payload as never);
    });
    channel.subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [syncRealtimeMessage]);

  return (
    <Panel className="flex min-h-[560px] flex-col">
      <div className="border-b border-line px-5 py-4">
        <h2 className="text-sm font-medium text-white">Global Lobby</h2>
      </div>
      <div className="thin-scrollbar flex-1 space-y-2 overflow-y-auto px-5 py-4 font-mono text-sm">
        {state.lobbyMessages.map((message) => {
          const author = state.profiles.find((profile) => profile.id === message.userId);
          if (!author) return null;

          return (
            <div key={message.id} className="text-zinc-300">
              <span className="text-zinc-500">{formatTimestamp(message.createdAt)}</span>
              <span className="mx-2 text-zinc-600">|</span>
              <span className="text-white">{author.name}</span>
              <span className="text-zinc-500">:</span>
              <span className="ml-2">{message.body}</span>
            </div>
          );
        })}
      </div>
      <div className="flex gap-3 border-t border-line px-5 py-4">
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="State the project, traction, or ask."
        />
        <Button
          onClick={async () => {
            if (!draft.trim()) return;
            const message = sendLobbyMessage(draft);
            const supabase = createClient();
            if (supabase) {
              await supabase.channel("global-lobby").send({
                type: "broadcast",
                event: "message",
                payload: message
              });
            }
            setDraft("");
          }}
        >
          Send
        </Button>
      </div>
    </Panel>
  );
}
