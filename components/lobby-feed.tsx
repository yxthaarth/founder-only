"use client";

import { Heart, MessageCircle, Repeat2, Send } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button, Panel, Textarea } from "@/components/ui";
import { useStore } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";
import { formatTimestamp } from "@/lib/utils";

export function LobbyFeed() {
  const {
    state,
    currentUser,
    sendLobbyMessage,
    syncRealtimeMessage,
    toggleLobbyLike,
    replyToLobbyMessage,
    repostLobbyMessage,
    deleteLobbyMessage
  } =
    useStore();
  const [draft, setDraft] = useState("");
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [sharedMessageId, setSharedMessageId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

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

  const feed = useMemo(
    () =>
      [...state.lobbyMessages]
        .filter((message) => !message.replyToId)
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    [state.lobbyMessages]
  );

  const repliesByParent = useMemo(() => {
    const map = new Map<string, typeof state.lobbyMessages>();
    state.lobbyMessages
      .filter((message) => message.replyToId)
      .forEach((message) => {
        const key = message.replyToId!;
        const current = map.get(key) ?? [];
        current.push(message);
        map.set(key, current);
      });
    return map;
  }, [state.lobbyMessages]);

  const messageMap = useMemo(
    () => new Map(state.lobbyMessages.map((message) => [message.id, message])),
    [state.lobbyMessages]
  );

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4">
      <div className="space-y-4">
        <Panel className="p-5">
          <div className="flex items-start gap-4">
            <img src={currentUser.avatarUrl} alt={currentUser.name} className="h-11 w-11 rounded-full object-cover" />
            <div className="min-w-0 flex-1">
              <Textarea
                rows={4}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Share a product update, hiring note, launch, or founder thought."
                className="border-0 bg-transparent px-0 py-0 text-[15px] leading-7 focus:border-0"
              />
              <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-4">
                <p className="text-xs text-zinc-500">This is your global startup feed.</p>
                <Button
                  onClick={async () => {
                    if (!draft.trim()) return;
                    const message = sendLobbyMessage(draft.trim());
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
                  Post
                </Button>
              </div>
            </div>
          </div>
        </Panel>

        <div className="space-y-4">
          {feed.map((message) => {
            const author = state.profiles.find((profile) => profile.id === message.userId);
            if (!author) return null;
            const liked = message.likedBy.includes(currentUser.id);
            const memberOfStartup = state.startups.find((startup) => startup.members.includes(author.id));
            const replies = (repliesByParent.get(message.id) ?? []).sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
            const repostedMessage = message.repostOfId ? messageMap.get(message.repostOfId) : null;
            const repostedAuthor = repostedMessage
              ? state.profiles.find((profile) => profile.id === repostedMessage.userId)
              : null;

            return (
              <Panel key={message.id} className="p-5">
                <div className="flex items-start gap-4">
                  <img src={author.avatarUrl} alt={author.name} className="h-11 w-11 rounded-full object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm text-white">{author.name}</p>
                      <span className="text-xs uppercase tracking-[0.12em] text-zinc-500">
                        {memberOfStartup?.name ?? author.role}
                      </span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-xs text-zinc-500">{formatTimestamp(message.createdAt)}</span>
                      {message.userId === currentUser.id ? (
                        <>
                          <span className="text-zinc-600">•</span>
                          <button
                            onClick={() => {
                              if (confirmDeleteId === message.id) {
                                deleteLobbyMessage(message.id);
                                setConfirmDeleteId(null);
                                return;
                              }
                              setConfirmDeleteId(message.id);
                            }}
                            className="text-xs text-zinc-500 transition hover:text-white"
                          >
                            {confirmDeleteId === message.id ? "Confirm Delete" : "Delete"}
                          </button>
                        </>
                      ) : null}
                    </div>
                    {message.repostOfId && repostedMessage && repostedAuthor ? (
                      <div className="mt-3 rounded-2xl border border-line bg-zinc-950 p-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm text-white">{repostedAuthor.name}</p>
                          <span className="text-zinc-600">•</span>
                          <span className="text-xs text-zinc-500">{formatTimestamp(repostedMessage.createdAt)}</span>
                        </div>
                        <p className="mt-2 whitespace-pre-line text-sm leading-7 text-zinc-300">{repostedMessage.body}</p>
                      </div>
                    ) : null}
                    {message.body ? <p className="mt-3 whitespace-pre-line text-sm leading-7 text-zinc-200">{message.body}</p> : null}
                    <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-zinc-500">
                      <button
                        onClick={() => setReplyingToId((current) => (current === message.id ? null : message.id))}
                        className="inline-flex items-center gap-2 transition hover:text-white"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>{replies.length ? replies.length : "Reply"}</span>
                      </button>
                      <button
                        onClick={async () => {
                          const repost = repostLobbyMessage(message.id);
                          if (!repost) return;
                          const supabase = createClient();
                          if (supabase) {
                            await supabase.channel("global-lobby").send({
                              type: "broadcast",
                              event: "message",
                              payload: repost
                            });
                          }
                        }}
                        className="inline-flex items-center gap-2 transition hover:text-white"
                      >
                        <Repeat2 className="h-4 w-4" />
                        <span>Repost</span>
                      </button>
                      <button
                        onClick={() => toggleLobbyLike(message.id)}
                        className={`inline-flex items-center gap-2 transition ${liked ? "text-white" : "hover:text-white"}`}
                      >
                        <Heart className="h-4 w-4" />
                        <span>{message.likedBy.length || "Like"}</span>
                      </button>
                      <button
                        onClick={async () => {
                          const shareUrl = `${window.location.origin}/lobby?post=${message.id}`;
                          if (navigator.share) {
                            try {
                              await navigator.share({ url: shareUrl, title: "Xlr8ter Post" });
                            } catch {}
                          } else {
                            try {
                              await navigator.clipboard.writeText(shareUrl);
                              setSharedMessageId(message.id);
                              window.setTimeout(() => setSharedMessageId((current) => (current === message.id ? null : current)), 1500);
                            } catch {}
                          }
                        }}
                        className="inline-flex items-center gap-2 transition hover:text-white"
                      >
                        <Send className="h-4 w-4" />
                        <span>{sharedMessageId === message.id ? "Copied" : "Share"}</span>
                      </button>
                    </div>
                    {replyingToId === message.id ? (
                      <div className="mt-4 flex gap-3 rounded-2xl border border-line bg-zinc-950 p-4">
                        <Textarea
                          rows={3}
                          value={replyDrafts[message.id] ?? ""}
                          onChange={(event) =>
                            setReplyDrafts((current) => ({ ...current, [message.id]: event.target.value }))
                          }
                          placeholder="Write a reply..."
                        />
                        <Button
                          onClick={async () => {
                            const body = replyDrafts[message.id] ?? "";
                            if (!body.trim()) return;
                            const reply = replyToLobbyMessage({ messageId: message.id, body: body.trim() });
                            if (!reply) return;
                            const supabase = createClient();
                            if (supabase) {
                              await supabase.channel("global-lobby").send({
                                type: "broadcast",
                                event: "message",
                                payload: reply
                              });
                            }
                            setReplyDrafts((current) => ({ ...current, [message.id]: "" }));
                            setReplyingToId(null);
                          }}
                        >
                          Reply
                        </Button>
                      </div>
                    ) : null}
                    {replies.length ? (
                      <div className="mt-4 space-y-3 border-t border-line pt-4">
                        {replies.map((reply) => {
                          const replyAuthor = state.profiles.find((profile) => profile.id === reply.userId);
                          if (!replyAuthor) return null;
                          return (
                            <div key={reply.id} className="flex items-start gap-3">
                              <img src={replyAuthor.avatarUrl} alt={replyAuthor.name} className="h-8 w-8 rounded-full object-cover" />
                              <div className="min-w-0 flex-1 rounded-2xl border border-line bg-zinc-950 px-4 py-3">
                                <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                                  <span>{replyAuthor.name}</span>
                                  <span>•</span>
                                  <span>{formatTimestamp(reply.createdAt)}</span>
                                </div>
                                <p className="mt-2 whitespace-pre-line text-sm text-zinc-300">{reply.body}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                </div>
              </Panel>
            );
          })}
        </div>
      </div>
    </div>
  );
}
