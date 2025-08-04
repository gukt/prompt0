import { Sidebar } from '../../pages/Dashboard/components/Sidebar';

interface DashboardLayoutProps {
  activeItem: string;
  onItemChange: (itemId: string) => void;
  children: React.ReactNode;
}

export const DashboardLayout = ({ activeItem, onItemChange, children }: DashboardLayoutProps) => {
  return (
    <div className="grid grid-cols-[16rem_1fr] gap-6">
      {/* 左侧边栏 */}
      <Sidebar activeItem={activeItem} onItemChange={onItemChange} />

      {/* 右侧内容区域 */}
      <div className="py-6">{children}</div>
    </div>
  );
};
