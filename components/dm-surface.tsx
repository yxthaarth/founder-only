"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button, Input, Panel } from "@/components/ui";
import { useStore } from "@/lib/store";
import { formatTimestamp } from "@/lib/utils";

export function DmSurface() {
  const { state, currentUser, sendDirectMessage } = useStore();
  const searchParams = useSearchParams();
  const initialThreadId = searchParams.get("thread");
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(initialThreadId ?? state.dmThreads[0]?.id ?? null);
  const [draft, setDraft] = useState("");

  const threads = useMemo(
    () => state.dmThreads.filter((thread) => thread.participantIds.includes(currentUser.id)),
    [currentUser.id, state.dmThreads]
  );

  const selectedThread = threads.find((thread) => thread.id === selectedThreadId) ?? threads[0];
  const messages = selectedThread
    ? state.dmMessages.filter((message) => message.threadId === selectedThread.id)
    : [];

  return (
    <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
      <Panel className="p-4">
        <h2 className="text-sm font-medium text-white">Private DMs</h2>
        <div className="mt-4 space-y-2">
          {threads.map((thread) => {
            const other = thread.participantIds
              .map((id) => state.profiles.find((profile) => profile.id === id))
              .find((profile) => profile && profile.id !== currentUser.id);
            return (
              <button
                key={thread.id}
                onClick={() => setSelectedThreadId(thread.id)}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                  selectedThread?.id === thread.id ? "border-line bg-surface" : "border-line bg-zinc-950"
                }`}
              >
                <p className="text-sm text-white">{other?.name}</p>
                <p className="mt-1 text-xs text-zinc-500">{thread.applicationId ? "Application Follow Up" : "Direct Message"}</p>
              </button>
            );
          })}
        </div>
      </Panel>

      <Panel className="flex min-h-[560px] flex-col">
        <div className="border-b border-line px-5 py-4">
          <h2 className="text-sm font-medium text-white">Conversation</h2>
        </div>
        <div className="thin-scrollbar flex-1 space-y-3 overflow-y-auto px-5 py-4">
          {messages.map((message) => {
            const author = state.profiles.find((profile) => profile.id === message.senderId);
            return (
              <div key={message.id} className="rounded-2xl border border-line bg-zinc-950 px-4 py-3">
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <span>{author?.name}</span>
                  <span>•</span>
                  <span>{formatTimestamp(message.createdAt)}</span>
                </div>
                <p className="mt-2 whitespace-pre-line text-sm text-zinc-300">{message.body}</p>
              </div>
            );
          })}
        </div>
        {selectedThread ? (
          <div className="flex gap-3 border-t border-line px-5 py-4">
            <Input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Write a private follow-up..." />
            <Button
              onClick={() => {
                if (!draft.trim()) return;
                sendDirectMessage({ threadId: selectedThread.id, body: draft });
                setDraft("");
              }}
            >
              Send
            </Button>
          </div>
        ) : null}
      </Panel>
    </div>
  );
}
