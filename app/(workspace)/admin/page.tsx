import { AdminCenter } from "@/components/admin-center";
import { Topbar } from "@/components/topbar";
import { PageTransition } from "@/components/ui";

export default function AdminPage() {
  return (
    <PageTransition>
      <Topbar title="Admin" />
      <AdminCenter />
    </PageTransition>
  );
}
