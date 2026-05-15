"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BriefcaseBusiness, ClipboardList, FolderKanban, HandCoins, LayoutPanelLeft, MessageSquareText } from "lucide-react";
import { APP_NAME, ADMIN_UID } from "@/lib/constants";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const links = [
  { href: "/lobby", label: "Lobby", icon: MessageSquareText },
  { href: "/startups", label: "Startups", icon: LayoutPanelLeft },
  { href: "/jobs", label: "Jobs", icon: BriefcaseBusiness },
  { href: "/crowdfund", label: "Crowdfund", icon: HandCoins }
];

export function AppSidebar() {
  const pathname = usePathname();
  const { currentUser, state } = useStore();
  const managedStartup = state.startups.find(
    (startup) =>
      startup.founder_id === currentUser.id || startup.members.includes(currentUser.id)
  );
  const founderOwnsStartup = Boolean(managedStartup && managedStartup.founder_id === currentUser.id);
  const canManageJobs = Boolean(
    managedStartup &&
      currentUser.is_verified &&
      (founderOwnsStartup || managedStartup.hiring_manager_ids.includes(currentUser.id))
  );
  const canManageCrowdfund = Boolean(
    managedStartup &&
      currentUser.is_verified &&
      (founderOwnsStartup || managedStartup.crowdfund_manager_ids.includes(currentUser.id))
  );
  const canAccessCompany = Boolean(
    managedStartup &&
      (founderOwnsStartup ||
        managedStartup.hiring_manager_ids.includes(currentUser.id) ||
        managedStartup.crowdfund_manager_ids.includes(currentUser.id) ||
        managedStartup.people_manager_ids.includes(currentUser.id) ||
        managedStartup.update_manager_ids.includes(currentUser.id))
  );

  function navItem({
    href,
    label,
    icon: Icon,
    inset = false,
    topGap = false
  }: {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    inset?: boolean;
    topGap?: boolean;
  }) {
    const active = pathname === href;
    return (
      <Link
        key={href}
        href={href}
        className={cn(
          "flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition",
          inset && "ml-3",
          topGap && "mt-4",
          active
            ? "border-line bg-surface text-white"
            : "border-transparent text-zinc-400 hover:border-line hover:bg-surface hover:text-white"
        )}
      >
        <Icon className="h-4 w-4" />
        {label}
      </Link>
    );
  }

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-[240px] border-r border-line bg-bg lg:block">
      <div className="flex h-full flex-col px-5 py-6">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-line bg-surface">
            <LayoutPanelLeft className="h-5 w-5 text-zinc-300" />
          </div>
          <div>
            <p className="text-2xl font-semibold tracking-tight text-white">{APP_NAME}</p>
          </div>
        </div>

        <nav className="space-y-1">
          {links.map((link) => navItem(link))}
          {canManageJobs || canManageCrowdfund ? (
            <div className="pt-3">
              <p className="px-3 text-[11px] uppercase tracking-[0.14em] text-zinc-600">Company</p>
              <div className="mt-2 space-y-1">
                {canAccessCompany ? navItem({ href: "/project", label: "Project", icon: FolderKanban, inset: true }) : null}
                {canManageJobs
                  ? navItem({ href: "/jobs/applications", label: "Applications", icon: ClipboardList, inset: true })
                  : null}
                {canManageJobs
                  ? navItem({ href: "/jobs/manage", label: "Manage Jobs", icon: BriefcaseBusiness, inset: true })
                  : null}
                {canManageCrowdfund
                  ? navItem({ href: "/crowdfund/manage", label: "Manage Crowdfunds", icon: HandCoins, inset: true })
                  : null}
              </div>
            </div>
          ) : null}
          {currentUser.id === ADMIN_UID ? (
            navItem({ href: "/admin", label: "Admin", icon: LayoutPanelLeft, topGap: true })
          ) : null}
        </nav>

        <Link href="/profile" className="mt-auto rounded-2xl border border-line bg-surface px-4 py-4 transition hover:border-zinc-700">
          <div className="flex items-center gap-3">
            <img src={currentUser.avatarUrl} alt={currentUser.name} className="h-11 w-11 rounded-full object-cover" />
            <div>
              <p className="text-sm text-white">{currentUser.name}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.12em] text-zinc-500">
                {currentUser.is_verified ? "Verified" : "Unverified"}
              </p>
            </div>
          </div>
        </Link>
      </div>
    </aside>
  );
}
