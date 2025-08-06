import { DashboardLayout } from '@/components/layout/DashboardLayout';

interface DocsPageProps {
  activeItem?: string;
  onItemChange?: (itemId: string) => void;
}

export function DocsPage({ activeItem = 'all', onItemChange = () => {} }: DocsPageProps) {
  return (
    <DashboardLayout activeItem={activeItem} onItemChange={onItemChange}>
      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto space-y-8">This is docs page.</div>
    </DashboardLayout>
  );
}
