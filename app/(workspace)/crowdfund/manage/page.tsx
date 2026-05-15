import { CrowdfundSurface } from "@/components/crowdfund-surface";
import { NotificationsPanel } from "@/components/notifications";
import { Topbar } from "@/components/topbar";
import { PageTransition } from "@/components/ui";

export default function ManageCrowdfundPage() {
  return (
    <PageTransition>
      <Topbar title="Manage Crowdfund" />
      <div className="space-y-4">
        <CrowdfundSurface mode="manage" />
        <NotificationsPanel />
      </div>
    </PageTransition>
  );
}
