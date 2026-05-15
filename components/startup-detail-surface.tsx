"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button, Panel, Stat } from "@/components/ui";
import { useStore } from "@/lib/store";
import { formatTimestamp } from "@/lib/utils";

export function StartupDetailSurface({ startupId }: { startupId: string }) {
  const { state, currentUser, requestConnection, addStartupComment } = useStore();
  const startup = state.startups.find((entry) => entry.id === startupId);
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});

  if (!startup) {
    return (
      <Panel className="p-6">
        <p className="text-sm text-zinc-500">Startup not found.</p>
      </Panel>
    );
  }

  const founder = state.profiles.find((profile) => profile.id === startup.founder_id);
  const members = startup.members
    .map((memberId) => state.profiles.find((profile) => profile.id === memberId))
    .filter(Boolean);
  const campaign = state.funding_campaigns.find((entry) => entry.startup_id === startup.id);
  const connection = state.connections.find(
    (item) =>
      (item.sender_id === currentUser.id && item.receiver_id === startup.founder_id) ||
      (item.sender_id === startup.founder_id && item.receiver_id === currentUser.id)
  );
  const dmOpen = connection?.status === "accepted" || startup.members.includes(currentUser.id);
  const startupPosts = useMemo(
    () =>
      state.startupPosts
        .filter((post) => post.startupId === startup.id)
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    [startup.id, state.startupPosts]
  );

  return (
    <div className="space-y-4">
      <Panel className="overflow-hidden">
        <div className="relative h-52 w-full overflow-hidden">
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
              <h2 className="text-2xl font-semibold text-white">{startup.name}</h2>
              <span className="font-mono text-xs text-zinc-500">{startup.status}</span>
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-400">{startup.pitch}</p>
            </div>
            {founder && !dmOpen && founder.id !== currentUser.id ? (
              <Button variant="secondary" onClick={() => requestConnection(founder.id)}>
                Request Access
              </Button>
            ) : null}
          </div>
        </div>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Panel className="p-6">
          <h3 className="text-sm font-medium text-white">Team</h3>
          <div className="mt-4 space-y-3">
            {members.map((member) =>
              member ? (
                <div key={member.id} className="rounded-2xl border border-line bg-zinc-950 p-4">
                  <div className="flex items-start gap-3">
                    <img src={member.avatarUrl} alt={member.name} className="h-12 w-12 rounded-full object-cover" />
                    <div className="flex-1">
                      <p className="text-sm text-white">{member.name}</p>
                      <p className="mt-1 text-sm text-zinc-500">{member.experience?.[0]?.role ?? member.role}</p>
                      <p className="mt-1 text-sm text-zinc-500">{member.experience?.[0]?.company ?? member.email}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {member.skills.map((skill) => (
                      <span key={skill} className="rounded-full border border-line px-3 py-1 text-xs text-zinc-400">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null
            )}
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel className="p-5">
            <h3 className="text-sm font-medium text-white">Founder</h3>
            <div className="mt-3 flex items-start gap-3">
              {founder ? <img src={founder.avatarUrl} alt={founder.name} className="h-12 w-12 rounded-full object-cover" /> : null}
              <div>
                <p className="text-sm text-white">{founder?.name}</p>
                <p className="mt-2 text-sm leading-6 text-zinc-500">{founder?.bio}</p>
              </div>
            </div>
            <div className="mt-4 flex gap-6">
              <Stat label="DM" value={dmOpen ? "Open" : "Restricted"} />
              <Stat label="Team" value={members.length} />
            </div>
          </Panel>
          {campaign ? (
            <Panel className="p-5">
              <h3 className="text-sm font-medium text-white">Support</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-500">{campaign.milestone}</p>
              <div className="mt-4">
                <Link href={`/crowdfund?startup=${startup.id}`}>
                  <Button variant="secondary">Open Campaign</Button>
                </Link>
              </div>
            </Panel>
          ) : null}
        </div>
      </div>

      <Panel className="p-6">
        <h3 className="text-sm font-medium text-white">Updates</h3>
        <div className="mt-4 space-y-4">
          {startupPosts.length ? (
            startupPosts.map((post) => {
              const author = state.profiles.find((profile) => profile.id === post.authorId);
              const comments = state.startupComments.filter((comment) => comment.postId === post.id);
              return (
                <div key={post.id} className="rounded-2xl border border-line bg-zinc-950 p-4">
                  <div className="flex items-start gap-3">
                    {author ? <img src={author.avatarUrl} alt={author.name} className="h-10 w-10 rounded-full object-cover" /> : null}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm text-white">{post.title}</p>
                        <span className="text-xs text-zinc-600">•</span>
                        <span className="text-xs text-zinc-500">{author?.name}</span>
                        <span className="text-xs text-zinc-500">{formatTimestamp(post.createdAt)}</span>
                      </div>
                      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-zinc-300">{post.body}</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3 border-t border-line pt-4">
                    {comments.map((comment) => {
                      const commenter = state.profiles.find((profile) => profile.id === comment.userId);
                      if (!commenter) return null;
                      return (
                        <div key={comment.id} className="flex items-start gap-3">
                          <img src={commenter.avatarUrl} alt={commenter.name} className="h-8 w-8 rounded-full object-cover" />
                          <div className="min-w-0 flex-1 rounded-2xl border border-line bg-surface px-4 py-3">
                            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                              <span>{commenter.name}</span>
                              <span>•</span>
                              <span>{formatTimestamp(comment.createdAt)}</span>
                            </div>
                            <p className="mt-2 whitespace-pre-line text-sm text-zinc-300">{comment.body}</p>
                          </div>
                        </div>
                      );
                    })}
                    <div className="flex gap-3">
                      <input
                        value={commentDrafts[post.id] ?? ""}
                        onChange={(event) =>
                          setCommentDrafts((current) => ({ ...current, [post.id]: event.target.value }))
                        }
                        placeholder="Comment on this update..."
                        className="h-11 w-full rounded-xl border border-line bg-surface px-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-zinc-500"
                      />
                      <Button
                        onClick={() => {
                          const body = commentDrafts[post.id] ?? "";
                          if (!body.trim()) return;
                          addStartupComment({ postId: post.id, body });
                          setCommentDrafts((current) => ({ ...current, [post.id]: "" }));
                        }}
                      >
                        Comment
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-2xl border border-line bg-zinc-950 p-4 text-sm text-zinc-500">
              No public updates yet.
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
}
