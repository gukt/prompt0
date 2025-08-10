import { AppSidebar } from './AppSidebar';

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 grid grid-cols-[16rem_1fr] gap-6">
      {/* Sidebar */}
      <AppSidebar />
      {/* Right Content */}
      <div className="flex-1 px-6 pt-2 pb-8 overflow-y-auto">{children}</div>
    </div>
  );
}
