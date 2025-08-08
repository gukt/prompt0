import { TooltipProvider } from '@/components/ui/tooltip';
import { ContactDialog } from '../ContactDialog';
import { Header } from './Header';

interface MainLayoutProps {
  contactDialogOpen: boolean;
  children: React.ReactNode;
  onContactDialogChange: (open: boolean) => void;
}

export const AppLayout = ({
  contactDialogOpen,
  children,
  onContactDialogChange,
}: MainLayoutProps) => {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-base">
        <div>
          <Header />

          {/* 主要内容区域 */}
          <main className="max-w-6xl mx-auto min-h-[calc(100vh-80px)]">{children}</main>
        </div>

        {/* Contact Us 对话框 */}
        <ContactDialog open={contactDialogOpen} onOpenChange={onContactDialogChange} />
      </div>
    </TooltipProvider>
  );
};
