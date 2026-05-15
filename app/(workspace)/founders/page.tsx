import { FoundersDirectory } from "@/components/founders-directory";
import { NotificationsPanel } from "@/components/notifications";
import { Topbar } from "@/components/topbar";
import { PageTransition } from "@/components/ui";

export default function FoundersPage() {
  return (
    <PageTransition>
      <Topbar title="Founders" />
      <div className="space-y-4">
        <FoundersDirectory />
        <NotificationsPanel />
      </div>
    </PageTransition>
  );
}
