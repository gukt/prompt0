import '@/assets/tailwind.css';
import { useApp } from '@/hooks/useApp';
import { PromptProvider } from '@/stores/prompt';
import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { AppLayout } from '../../components/layout/AppLayout';
import { DashboardPage } from '../../pages/DashboardPage';
import { DiscoverPage } from '../../pages/DiscoverPage';

function AppContent() {
  // 状态管理
  const [contactDialogOpen, setContactDialogOpen] = useState(false);

  // 使用应用初始化 Hook
  const { initialized, loading } = useApp();

  if (!initialized && loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">正在初始化应用...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AppLayout contactDialogOpen={contactDialogOpen} onContactDialogChange={setContactDialogOpen}>
        <Routes>
          <Route path="/" element={<Navigate to="/prompts" replace />} />
          <Route path="/prompts" element={<DashboardPage />} />
          <Route path="/discover" element={<DiscoverPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
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
