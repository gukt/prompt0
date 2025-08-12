import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from 'sonner';
import { AppHeader } from './AppHeader';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <div className="h-screen flex flex-col">
        {/* Header */}
        <AppHeader />

        {/* Main Content Area */}
        <div className="flex-1 mx-auto max-w-6xl min-h-[calc(100vh-80px)]">{children}</div>
      </div>
      <Toaster />
    </TooltipProvider>
  );
}
