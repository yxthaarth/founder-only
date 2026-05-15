import { JobsSurface } from "@/components/jobs-surface";
import { Topbar } from "@/components/topbar";
import { PageTransition } from "@/components/ui";

export default function JobApplicationsPage() {
  return (
    <PageTransition>
      <Topbar title="Applications" />
      <JobsSurface mode="applications" />
    </PageTransition>
  );
}
