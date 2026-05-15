import { JobsSurface } from "@/components/jobs-surface";
import { NotificationsPanel } from "@/components/notifications";
import { Topbar } from "@/components/topbar";
import { PageTransition } from "@/components/ui";

export default function JobsPage() {
  return (
    <PageTransition>
      <Topbar title="Jobs" />
      <div className="space-y-4">
        <JobsSurface mode="browse" />
        <NotificationsPanel />
      </div>
    </PageTransition>
  );
}
