"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderKanban, LayoutPanelLeft, MessageSquareText, Users } from "lucide-react";
import { APP_HANDLE, APP_NAME, ADMIN_UID } from "@/lib/constants";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const links = [
  { href: "/lobby", label: "Lobby", icon: MessageSquareText },
  { href: "/founders", label: "Founders", icon: Users },
  { href: "/project", label: "Project", icon: FolderKanban }
];

export function AppSidebar() {
  const pathname = usePathname();
  const { currentUser } = useStore();

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-[240px] border-r border-line bg-bg lg:block">
      <div className="flex h-full flex-col px-5 py-6">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-[4px] border border-line bg-surface">
            <LayoutPanelLeft className="h-4 w-4 text-zinc-300" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">{APP_NAME}</p>
            <p className="font-mono text-xs text-zinc-500">{APP_HANDLE}</p>
          </div>
        </div>

        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-[4px] border px-3 py-2 text-sm transition",
                  active
                    ? "border-line bg-surface text-white"
                    : "border-transparent text-zinc-400 hover:border-line hover:bg-surface hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
          {currentUser.id === ADMIN_UID ? (
            <Link
              href="/admin"
              className={cn(
                "mt-4 flex items-center gap-3 rounded-[4px] border px-3 py-2 text-sm transition",
                pathname === "/admin"
                  ? "border-line bg-surface text-white"
                  : "border-transparent text-zinc-400 hover:border-line hover:bg-surface hover:text-white"
              )}
            >
              <LayoutPanelLeft className="h-4 w-4" />
              Admin
            </Link>
          ) : null}
        </nav>

        <div className="mt-auto rounded-[4px] border border-line bg-surface px-3 py-3">
          <p className="text-[11px] uppercase tracking-[0.14em] text-zinc-500">Identity</p>
          <p className="mt-2 text-sm text-white">{currentUser.name}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.12em] text-zinc-500">
            Role: {currentUser.role}
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.12em] text-zinc-500">
            Status: {currentUser.is_verified ? "Verified" : "Unverified"}
          </p>
        </div>
      </div>
    </aside>
  );
}
