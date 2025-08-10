import { SidebarProvider } from '@/components/ui/sidebar';
import { Sidebar2 } from './Sidebar2';

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="grid grid-cols-[16rem_1fr] gap-6">
        <Sidebar2 />
        <div className="flex-1 px-6 pt-2 pb-8 overflow-y-auto">{children}</div>
      </div>
    </SidebarProvider>
  );
}
