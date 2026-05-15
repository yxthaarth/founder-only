import { AppSidebar } from "@/components/app-sidebar";
import { ToastStack } from "@/components/toast";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg">
      <AppSidebar />
      <ToastStack />
      <div className="px-4 py-6 lg:ml-[240px] lg:px-8">{children}</div>
    </div>
  );
}
