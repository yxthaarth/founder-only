import { LobbyFeed } from "@/components/lobby-feed";
import { NotificationsPanel } from "@/components/notifications";
import { Topbar } from "@/components/topbar";
import { PageTransition } from "@/components/ui";

export default function LobbyPage() {
  return (
    <PageTransition>
      <Topbar title="Lobby" />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <LobbyFeed />
        <NotificationsPanel />
      </div>
    </PageTransition>
  );
}
