import { StartupDetailSurface } from "@/components/startup-detail-surface";
import { Topbar } from "@/components/topbar";
import { PageTransition } from "@/components/ui";

export default async function StartupDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <PageTransition>
      <Topbar title="Startup" />
      <StartupDetailSurface startupId={id} />
    </PageTransition>
  );
}
