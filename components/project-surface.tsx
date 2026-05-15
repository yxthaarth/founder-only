"use client";

import { useMemo, useState } from "react";
import { Button, Input, Panel, Stat, Textarea } from "@/components/ui";
import { useStore } from "@/lib/store";
import { formatTimestamp } from "@/lib/utils";

export function ProjectSurface() {
  const { state, currentUser, currentStartup, addEmployeeAccess, createStartupPost } = useStore();
  const [search, setSearch] = useState("");
  const [employeeTitle, setEmployeeTitle] = useState("");
  const [canManageJobsToggle, setCanManageJobsToggle] = useState(true);
  const [canManageCrowdfundToggle, setCanManageCrowdfundToggle] = useState(false);
  const [canManagePeopleToggle, setCanManagePeopleToggle] = useState(false);
  const [canPostUpdatesToggle, setCanPostUpdatesToggle] = useState(true);
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateBody, setUpdateBody] = useState("");

  const founderOwnsStartup = Boolean(currentStartup && currentStartup.founder_id === currentUser.id);
  const isCompanyMember = Boolean(currentStartup && currentStartup.members.includes(currentUser.id));
  const canManagePeople = Boolean(
    currentStartup &&
      (founderOwnsStartup || currentStartup.people_manager_ids.includes(currentUser.id))
  );
  const canPostUpdates = Boolean(
    currentStartup &&
      (founderOwnsStartup || currentStartup.update_manager_ids.includes(currentUser.id))
  );

  const startupPosts = useMemo(
    () =>
      currentStartup
        ? state.startupPosts
            .filter((post) => post.startupId === currentStartup.id)
            .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
        : [],
    [currentStartup, state.startupPosts]
  );

  const candidateProfiles = useMemo(() => {
    if (!currentStartup || !search.trim()) return [];
    const query = search.trim().toLowerCase();
    return state.profiles.filter(
      (profile) =>
        profile.role !== "admin" &&
        (profile.name.toLowerCase().includes(query) || profile.email.toLowerCase().includes(query))
    );
  }, [currentStartup, search, state.profiles]);

  if (!currentStartup || !isCompanyMember) {
    return (
      <Panel className="p-6">
        <h2 className="text-sm font-medium text-white">Project</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-500">
          Company controls are only available to members inside their startup workspace.
        </p>
      </Panel>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-4">
        <Panel className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-medium text-white">Project</h2>
              <p className="mt-1 text-sm text-zinc-500">Team access, company updates, and internal operating controls.</p>
            </div>
            <span className="font-mono text-xs text-zinc-500">
              Status: {currentStartup.status === "verified" ? "Verified" : "Pending"}
            </span>
          </div>

          <div className="mt-6 rounded-2xl border border-line bg-zinc-950 p-5">
            <p className="text-xl font-semibold text-white">{currentStartup.name}</p>
            <p className="mt-3 text-sm leading-6 text-zinc-400">{currentStartup.pitch}</p>
            <div className="mt-4 flex gap-6">
              <Stat label="Members" value={currentStartup.members.length} />
              <Stat label="Jobs" value={currentStartup.openings.length} />
              <Stat label="Updates" value={startupPosts.length} />
            </div>
          </div>
        </Panel>

        <Panel className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-medium text-white">Startup Updates</h3>
              <p className="mt-1 text-sm text-zinc-500">Publish feature launches, milestones, and progress notes.</p>
            </div>
          </div>

          {canPostUpdates ? (
            <div className="mt-5 space-y-3 rounded-2xl border border-line bg-zinc-950 p-4">
              <Input value={updateTitle} onChange={(event) => setUpdateTitle(event.target.value)} placeholder="Update title" />
              <Textarea
                rows={5}
                value={updateBody}
                onChange={(event) => setUpdateBody(event.target.value)}
                placeholder="Share what shipped, changed, or is coming next."
              />
              <Button
                onClick={() => {
                  if (!updateTitle.trim() || !updateBody.trim()) return;
                  createStartupPost({ title: updateTitle.trim(), body: updateBody.trim() });
                  setUpdateTitle("");
                  setUpdateBody("");
                }}
              >
                Publish Update
              </Button>
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-line bg-zinc-950 p-4 text-sm text-zinc-500">
              You can view updates here, but only founders or approved operators can publish them.
            </div>
          )}

          <div className="mt-5 space-y-3">
            {startupPosts.length ? (
              startupPosts.map((post) => {
                const author = state.profiles.find((profile) => profile.id === post.authorId);
                const commentCount = state.startupComments.filter((comment) => comment.postId === post.id).length;
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
                        <p className="mt-3 text-xs text-zinc-500">{commentCount} comments on the public startup page</p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-2xl border border-line bg-zinc-950 p-4 text-sm text-zinc-500">
                No startup updates have been published yet.
              </div>
            )}
          </div>
        </Panel>
      </div>

      <div className="space-y-4">
        <Panel className="p-6">
          <h3 className="text-sm font-medium text-white">Team Roles</h3>
          <div className="mt-4 space-y-3">
            {currentStartup.members.map((memberId) => {
              const member = state.profiles.find((profile) => profile.id === memberId);
              if (!member) return null;
              const title = currentStartup.teamRoles.find((entry) => entry.userId === memberId)?.title ?? member.role;
              return (
                <div key={memberId} className="rounded-2xl border border-line bg-zinc-950 p-4">
                  <div className="flex items-start gap-3">
                    <img src={member.avatarUrl} alt={member.name} className="h-10 w-10 rounded-full object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-white">{member.name}</p>
                      <p className="mt-1 text-sm text-zinc-500">{title}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-400">
                    {currentStartup.hiring_manager_ids.includes(memberId) ? <span className="rounded-full border border-line px-2 py-1">Jobs</span> : null}
                    {currentStartup.crowdfund_manager_ids.includes(memberId) ? <span className="rounded-full border border-line px-2 py-1">Crowdfund</span> : null}
                    {currentStartup.people_manager_ids.includes(memberId) ? <span className="rounded-full border border-line px-2 py-1">People</span> : null}
                    {currentStartup.update_manager_ids.includes(memberId) ? <span className="rounded-full border border-line px-2 py-1">Updates</span> : null}
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel className="p-6">
          <h3 className="text-sm font-medium text-white">Add Employee</h3>
          <p className="mt-1 text-sm text-zinc-500">Search a user, assign a role title, and grant company permissions.</p>

          {canManagePeople ? (
            <div className="mt-4 space-y-3">
              <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name or email" />
              <Input value={employeeTitle} onChange={(event) => setEmployeeTitle(event.target.value)} placeholder="Role title" />
              <div className="flex flex-wrap gap-2">
                <Button variant={canManageJobsToggle ? "secondary" : "ghost"} onClick={() => setCanManageJobsToggle((value) => !value)}>
                  Jobs
                </Button>
                <Button variant={canManageCrowdfundToggle ? "secondary" : "ghost"} onClick={() => setCanManageCrowdfundToggle((value) => !value)}>
                  Crowdfund
                </Button>
                <Button variant={canManagePeopleToggle ? "secondary" : "ghost"} onClick={() => setCanManagePeopleToggle((value) => !value)}>
                  People
                </Button>
                <Button variant={canPostUpdatesToggle ? "secondary" : "ghost"} onClick={() => setCanPostUpdatesToggle((value) => !value)}>
                  Updates
                </Button>
              </div>
              <div className="space-y-2">
                {candidateProfiles.length ? (
                  candidateProfiles.map((profile) => {
                    const existingTitle = currentStartup.teamRoles.find((entry) => entry.userId === profile.id)?.title;
                    return (
                      <div key={profile.id} className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-zinc-950 p-4">
                        <div className="flex items-center gap-3">
                          <img src={profile.avatarUrl} alt={profile.name} className="h-10 w-10 rounded-full object-cover" />
                          <div>
                            <p className="text-sm text-white">{profile.name}</p>
                            <p className="mt-1 text-sm text-zinc-500">{existingTitle ?? profile.email}</p>
                          </div>
                        </div>
                        <Button
                          onClick={() =>
                            addEmployeeAccess({
                              startupId: currentStartup.id,
                              userId: profile.id,
                              title: employeeTitle.trim() || existingTitle || "Team Member",
                              canManageJobs: canManageJobsToggle,
                              canManageCrowdfund: canManageCrowdfundToggle,
                              canManagePeople: canManagePeopleToggle,
                              canPostUpdates: canPostUpdatesToggle
                            })
                          }
                        >
                          {currentStartup.members.includes(profile.id) ? "Save Access" : "Add Employee"}
                        </Button>
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-2xl border border-line bg-zinc-950 p-4 text-sm text-zinc-500">
                    Search for a user to grant company access.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-line bg-zinc-950 p-4 text-sm text-zinc-500">
              Only founders or people managers can grant employee access.
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
