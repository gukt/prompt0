import { Sidebar } from './Sidebar';

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[16rem_1fr] gap-6">
      <Sidebar />
      <div className="flex-1 px-6 pt-2 pb-8 overflow-y-auto">{children}</div>
    </div>
  );
}
