import { CrowdfundSurface } from "@/components/crowdfund-surface";
import { NotificationsPanel } from "@/components/notifications";
import { Topbar } from "@/components/topbar";
import { PageTransition } from "@/components/ui";

export default function CrowdfundPage() {
  return (
    <PageTransition>
      <Topbar title="Crowdfund" />
      <div className="space-y-4">
        <CrowdfundSurface mode="browse" />
        <NotificationsPanel />
      </div>
    </PageTransition>
  );
}
