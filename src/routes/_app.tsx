import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileNav } from "@/components/MobileNav";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <MobileNav />
        <div className="h-1.5 w-full shrink-0 bg-gradient-to-r from-brand-navy via-brand-orange to-brand-yellow" />
        <main className="flex-1 min-w-0 overflow-x-hidden">
          <div className="p-6 lg:p-10 max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );

}
