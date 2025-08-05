import '@/assets/tailwind.css';
import { useApp } from '@/hooks/useApp';
import { PromptProvider } from '@/lib/store/prompt';
import { useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { DashboardPage } from '../../pages/Dashboard/Dashboard';
import { DiscoverPage } from '../../pages/Discover/Discover';

function AppContent() {
  // 主要状态
  const [activeItem, setActiveItem] = useState('all');
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
  const [contactDialogOpen, setContactDialogOpen] = useState(false);

  // 使用应用初始化 Hook
  const { initialized, loading } = useApp();

  // 导航处理
  const handleMenuItemChange = (menuItem: string) => {
    setActiveMenuItem(menuItem);
  };

  const handleItemChange = (itemId: string) => {
    if (itemId === 'contact') {
      setContactDialogOpen(true);
    } else {
      setActiveItem(itemId);
    }
  };

  if (!initialized && loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">正在初始化应用...</div>
      </div>
    );
  }

  return (
    <AdminLayout
      activeMenuItem={activeMenuItem}
      onMenuItemChange={handleMenuItemChange}
      contactDialogOpen={contactDialogOpen}
      onContactDialogChange={setContactDialogOpen}
    >
      {activeMenuItem === 'dashboard' && (
        <DashboardPage activeItem={activeItem} onItemChange={handleItemChange} />
      )}
      {activeMenuItem === 'discover' && <DiscoverPage />}
    </AdminLayout>
  );
}

// 主组件包装 Provider
export default function App() {
  return (
    <PromptProvider>
      <AppContent />
    </PromptProvider>
  );
}
