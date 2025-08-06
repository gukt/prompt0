import { DashboardLayout } from '../components/layout/DashboardLayout';

interface SettingsPageProps {
  activeItem?: string;
  onItemChange?: (itemId: string) => void;
}

export function SettingsPage({ activeItem = 'all', onItemChange = () => {} }: SettingsPageProps) {
  return (
    <DashboardLayout activeItem={activeItem} onItemChange={onItemChange}>
      <section className="flex-1 p-6 overflow-y-auto space-y-8">This is settings page.</section>
    </DashboardLayout>
  );
}
