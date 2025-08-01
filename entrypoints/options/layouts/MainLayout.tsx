import { TooltipProvider } from '@/components/ui/tooltip';
import { ContactDialog } from '../components/ContactDialog';
import { Header } from './Header';

interface MainLayoutProps {
  activeMenuItem: string;
  contactDialogOpen: boolean;
  children: React.ReactNode;
  onMenuItemChange: (item: string) => void;
  onContactDialogChange: (open: boolean) => void;
}

export const MainLayout = ({
  activeMenuItem,
  contactDialogOpen,
  children,
  onMenuItemChange,
  onContactDialogChange,
}: MainLayoutProps) => {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-base">
        <div>
          <Header activeMenuItem={activeMenuItem} onMenuItemChange={onMenuItemChange} />

          {/* 主要内容区域 */}
          {children}
        </div>

        {/* Contact Us 对话框 */}
        <ContactDialog open={contactDialogOpen} onOpenChange={onContactDialogChange} />
      </div>
    </TooltipProvider>
  );
};
