import { DmSurface } from "@/components/dm-surface";
import { Topbar } from "@/components/topbar";
import { PageTransition } from "@/components/ui";

export default function DmsPage() {
  return (
    <PageTransition>
      <Topbar title="Private DMs" />
      <DmSurface />
    </PageTransition>
  );
}
