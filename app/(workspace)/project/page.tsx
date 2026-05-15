import { NotificationsPanel } from "@/components/notifications";
import { ProjectSurface } from "@/components/project-surface";
import { Topbar } from "@/components/topbar";
import { PageTransition } from "@/components/ui";

export default function ProjectPage() {
  return (
    <PageTransition>
      <Topbar title="Project" />
      <div className="space-y-4">
        <ProjectSurface />
        <NotificationsPanel />
      </div>
    </PageTransition>
  );
}
