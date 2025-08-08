import { TooltipProvider } from '@/components/ui/tooltip';
import { Header } from './Header';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-base">
        <div>
          <Header />
          <main className="max-w-6xl mx-auto min-h-[calc(100vh-80px)]">{children}</main>
        </div>
      </div>
    </TooltipProvider>
  );
}
