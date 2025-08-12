import { AppSidebar } from './AppSidebar';

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 flex gap-10 h-full">
      {/* Left Sidebar */}
      <AppSidebar />

      {/* Right Content */}
      <main className="flex-1 pb-8 overflow-y-auto">{children}</main>
    </div>
  );
}
