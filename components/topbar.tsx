"use client";

import { Bell, PencilLine } from "lucide-react";
import { useState } from "react";
import { Button, Input, Label, Modal, Textarea } from "@/components/ui";
import { useStore } from "@/lib/store";

export function Topbar({ title }: { title: string }) {
  const { state, currentUser, switchUser, updateProfile } = useStore();
  const [open, setOpen] = useState(false);
  const [bio, setBio] = useState(currentUser.bio);
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl);

  const unread = state.notifications.filter((item) => item.userId === currentUser.id && !item.read).length;

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 border-b border-line pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-medium text-white">{title}</h1>
          <p className="mt-1 text-sm text-zinc-500">Structured access, low-noise surfaces, persistent state.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 rounded-[4px] border border-line bg-surface px-3 py-2 text-sm text-zinc-400">
            <Bell className="h-4 w-4" />
            {unread} notifications
          </div>
          <select
            value={currentUser.id}
            onChange={(event) => switchUser(event.target.value)}
            className="h-10 rounded-[4px] border border-line bg-surface px-3 text-sm text-white outline-none"
          >
            {state.profiles.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.name}
              </option>
            ))}
          </select>
          <Button variant="secondary" onClick={() => setOpen(true)}>
            <PencilLine className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </div>

      <Modal open={open} title="Edit Profile" onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Profile Image URL</Label>
            <Input value={avatarUrl} onChange={(event) => setAvatarUrl(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Bio</Label>
            <Textarea rows={5} value={bio} onChange={(event) => setBio(event.target.value)} />
          </div>
          <div className="flex justify-end">
            <Button
              onClick={() => {
                updateProfile({ avatarUrl, bio });
                setOpen(false);
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
