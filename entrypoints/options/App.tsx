import '@/assets/tailwind.css';
import { AppLayout } from '@/components/layout/AppLayout';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { useApp } from '@/hooks/useApp';
import { DiscoverPage } from '@/pages/DiscoverPage';
import { DocsPage } from '@/pages/DocsPage';
import { PromptEditor } from '@/pages/PromptEditor';
import { PromptGallery } from '@/pages/PromptGallery';
import { SettingsPage } from '@/pages/SettingsPage';
import { HashRouter, Navigate, Route, Routes } from 'react-router';

function AppContent() {
  const { initialized, loading } = useApp();

  if (!initialized && loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">正在初始化应用...</div>
      </div>
    );
  }

  return (
    <HashRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/prompts" replace />} />
          <Route
            path="/prompts"
            element={
              <SidebarLayout>
                <PromptGallery />
              </SidebarLayout>
            }
          />
          <Route path="/prompts/new" element={<PromptEditor />} />
          <Route path="/prompts/:id/edit" element={<PromptEditor />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </AppLayout>
    </HashRouter>
  );
}

export default function App() {
  return <AppContent />;
}
