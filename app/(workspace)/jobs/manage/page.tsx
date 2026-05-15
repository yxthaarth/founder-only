import { JobsSurface } from "@/components/jobs-surface";
import { NotificationsPanel } from "@/components/notifications";
import { Topbar } from "@/components/topbar";
import { PageTransition } from "@/components/ui";

export default function ManageJobsPage() {
  return (
    <PageTransition>
      <Topbar title="Manage Jobs" />
      <div className="space-y-4">
        <JobsSurface mode="manage" />
        <NotificationsPanel />
      </div>
    </PageTransition>
  );
}
