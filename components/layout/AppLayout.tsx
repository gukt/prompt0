import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from 'sonner';
import { AppHeader } from './AppHeader';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-base">
        <AppHeader />
        <main className="max-w-6xl mx-auto min-h-[calc(100vh-80px)]">{children}</main>
      </div>
      <Toaster />
    </TooltipProvider>
  );
}
