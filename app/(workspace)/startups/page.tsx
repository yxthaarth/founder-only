import { NotificationsPanel } from "@/components/notifications";
import { StartupsShowcase } from "@/components/startups-showcase";
import { Topbar } from "@/components/topbar";
import { PageTransition } from "@/components/ui";

export default function StartupsPage() {
  return (
    <PageTransition>
      <Topbar title="Startups" />
      <div className="space-y-4">
        <StartupsShowcase />
        <NotificationsPanel />
      </div>
    </PageTransition>
  );
}
