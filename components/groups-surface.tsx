"use client";

import { useMemo, useState } from "react";
import { Button, Input, Panel, Stat } from "@/components/ui";
import { useStore } from "@/lib/store";
import { formatTimestamp } from "@/lib/utils";

export function GroupsSurface() {
  const { state, currentUser, joinGroup, createGroup, sendGroupMessage } = useStore();
  const joinedGroups = useMemo(
    () => state.groups.filter((group) => group.memberIds.includes(currentUser.id)),
    [currentUser.id, state.groups]
  );
  const [groupSearch, setGroupSearch] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(joinedGroups[0]?.id ?? null);
  const [draft, setDraft] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupFocus, setGroupFocus] = useState("");
  const [groupDescription, setGroupDescription] = useState("");

  const searchableGroups = useMemo(() => {
    const query = groupSearch.trim().toLowerCase();
    if (!query) return state.groups;
    return state.groups.filter(
      (group) =>
        group.name.toLowerCase().includes(query) ||
        group.focus.toLowerCase().includes(query) ||
        group.description.toLowerCase().includes(query)
    );
  }, [groupSearch, state.groups]);

  const selectedGroup = joinedGroups.find((group) => group.id === selectedGroupId) ?? joinedGroups[0] ?? null;
  const selectedMessages = selectedGroup
    ? state.groupMessages.filter((message) => message.groupId === selectedGroup.id)
    : [];

  return (
    <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
      <div className="space-y-4">
        <Panel className="p-5">
          <p className="text-sm text-white">Create Group</p>
          <div className="mt-4 space-y-3">
            <Input value={groupName} onChange={(event) => setGroupName(event.target.value)} placeholder="Group name" />
            <Input value={groupFocus} onChange={(event) => setGroupFocus(event.target.value)} placeholder="Focus" />
            <Input
              value={groupDescription}
              onChange={(event) => setGroupDescription(event.target.value)}
              placeholder="What is this group for?"
            />
            <Button
              onClick={() => {
                if (!groupName.trim() || !groupFocus.trim() || !groupDescription.trim()) return;
                const nextGroupId = createGroup({
                  name: groupName.trim(),
                  focus: groupFocus.trim(),
                  description: groupDescription.trim()
                });
                setGroupName("");
                setGroupFocus("");
                setGroupDescription("");
                setSelectedGroupId(nextGroupId);
              }}
            >
              Create Group
            </Button>
          </div>
        </Panel>

        <Panel className="p-5">
          <p className="text-sm text-white">Join Groups</p>
          <div className="mt-4">
            <Input
              value={groupSearch}
              onChange={(event) => setGroupSearch(event.target.value)}
              placeholder="Search groups by name, focus, or topic"
            />
          </div>
          <div className="mt-4 space-y-3">
            {searchableGroups.length ? (
              searchableGroups.map((group) => {
              const joined = group.memberIds.includes(currentUser.id);
              return (
                <div key={group.id} className="rounded-2xl border border-line bg-zinc-950 p-4">
                  <p className="text-sm text-white">{group.name}</p>
                  <p className="mt-2 text-sm text-zinc-400">{group.description}</p>
                  <div className="mt-4 flex gap-6">
                    <Stat label="Focus" value={group.focus} />
                    <Stat label="Members" value={group.memberIds.length} />
                  </div>
                  <div className="mt-4">
                    <Button
                      variant={joined ? "secondary" : "ghost"}
                      onClick={() => {
                        if (!joined) {
                          joinGroup(group.id);
                        }
                        setSelectedGroupId(group.id);
                      }}
                    >
                      {joined ? "Open Group" : "Join Group"}
                    </Button>
                  </div>
                </div>
              );
              })
            ) : (
              <div className="rounded-2xl border border-line bg-zinc-950 p-4 text-sm text-zinc-500">
                No groups match that search yet.
              </div>
            )}
          </div>
        </Panel>
      </div>

      <Panel className="flex min-h-[560px] flex-col">
        <div className="border-b border-line px-5 py-4">
          <h2 className="text-sm font-medium text-white">{selectedGroup ? selectedGroup.name : "Group Chat"}</h2>
          <p className="mt-1 text-xs text-zinc-500">
            {selectedGroup ? selectedGroup.description : "Join a group to participate in the conversation."}
          </p>
        </div>
        <div className="thin-scrollbar flex-1 overflow-y-auto px-5 py-4">
          {selectedGroup ? (
            selectedMessages.length ? (
              <div className="space-y-3">
                {selectedMessages.map((message) => {
                  const author = state.profiles.find((profile) => profile.id === message.userId);
                  if (!author) return null;

                  return (
                    <div key={message.id} className="flex items-start gap-3">
                      <img src={author.avatarUrl} alt={author.name} className="h-9 w-9 rounded-full object-cover" />
                      <div className="min-w-0 flex-1 rounded-2xl border border-line bg-zinc-950 px-4 py-3">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                          <span>{author.name}</span>
                          <span>•</span>
                          <span>{formatTimestamp(message.createdAt)}</span>
                        </div>
                        <p className="mt-2 whitespace-pre-line text-sm text-zinc-300">{message.body}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-sm text-zinc-500">No messages yet. Start the thread.</div>
            )
          ) : (
            <div className="text-sm text-zinc-500">Join a group from the left to unlock group chat.</div>
          )}
        </div>
        {selectedGroup ? (
          <div className="flex gap-3 border-t border-line px-5 py-4">
            <Input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Write to the group..." />
            <Button
              onClick={() => {
                if (!selectedGroup || !draft.trim()) return;
                sendGroupMessage({ groupId: selectedGroup.id, body: draft });
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
