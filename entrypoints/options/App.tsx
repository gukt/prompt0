import '@/assets/tailwind.css';
import { mockPrompts } from '@/lib/mock-data';
import { Prompt } from '@/lib/types';
import { useState } from 'react';
import { MainLayout } from './layouts/MainLayout';
import { DashboardPage } from './pages/Dashboard';
import { DiscoverPage } from './pages/DiscoverPage';
import { DocsPage } from './pages/DocsPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  // 主要状态
  const [activeItem, setActiveItem] = useState('all');
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
  const [prompts, setPrompts] = useState<Prompt[]>(mockPrompts);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);

  const handleDeletePrompt = (promptId: string) => {
    setPrompts((prev) => prev.filter((p) => p.id !== promptId));
  };

  const handleSavePrompt = (
    promptData: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>,
    promptId?: string,
  ) => {
    if (promptId) {
      // 编辑现有提示词
      setPrompts((prev) =>
        prev.map((p) =>
          p.id === promptId
            ? {
                ...p,
                ...promptData,
                updatedAt: new Date(),
              }
            : p,
        ),
      );
    } else {
      // 新增提示词
      const newPrompt: Prompt = {
        ...promptData,
        id: Date.now().toString(),
        createdAt: new Date(),
      };
      setPrompts((prev) => [newPrompt, ...prev]);
    }
  };

  const handleImportPrompts = (importedPrompts: Prompt[]) => {
    // 过滤掉重复的 ID，避免冲突
    const existingIds = new Set(prompts.map((p) => p.id));
    const uniquePrompts = importedPrompts.filter((p) => !existingIds.has(p.id));

    // 将导入的提示词添加到现有列表的开头
    setPrompts((prev) => [...uniquePrompts, ...prev]);
  };

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

  // 渲染主内容
  const renderMainContent = () => {
    // 根据 activeMenuItem 渲染不同页面
    switch (activeMenuItem) {
      case 'dashboard':
        switch (activeItem) {
          case 'settings':
            return <SettingsPage prompts={prompts} onImportPrompts={handleImportPrompts} />;
          case 'docs':
            return <DocsPage />;
          default:
            return (
              <DashboardPage
                activeItem={activeItem}
                prompts={prompts}
                onDeletePrompt={handleDeletePrompt}
                onImportPrompts={handleImportPrompts}
                onItemChange={handleItemChange}
                onSavePrompt={(promptData) => handleSavePrompt(promptData)}
              />
            );
        }
      case 'discover':
        return (
          <DiscoverPage
            onImportPrompt={(prompt: Prompt) => {
              setPrompts((prev) => [prompt, ...prev]);
            }}
          />
        );
      default:
        return (
          <DashboardPage
            activeItem={activeItem}
            prompts={prompts}
            onDeletePrompt={handleDeletePrompt}
            onImportPrompts={handleImportPrompts}
            onItemChange={handleItemChange}
            onSavePrompt={(promptData) => handleSavePrompt(promptData)}
          />
        );
    }
  };

  return (
    <MainLayout
      activeMenuItem={activeMenuItem}
      contactDialogOpen={contactDialogOpen}
      onMenuItemChange={handleMenuItemChange}
      onContactDialogChange={setContactDialogOpen}
    >
      {renderMainContent()}
    </MainLayout>
  );
}
