import { NotificationsPanel } from "@/components/notifications";
import { ProfileSurface } from "@/components/profile-surface";
import { Topbar } from "@/components/topbar";
import { PageTransition } from "@/components/ui";

export default function ProfilePage() {
  return (
    <PageTransition>
      <Topbar title="Profile" />
      <div className="space-y-4">
        <ProfileSurface />
        <NotificationsPanel />
      </div>
    </PageTransition>
  );
}
