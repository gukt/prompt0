import '@/assets/tailwind.css';
import { TooltipProvider } from '@/components/ui/tooltip';
import { mockPrompts } from '@/lib/mock-data';
import { Prompt } from '@/lib/types';
import { useState } from 'react';
import { ContactDialog } from './components/ContactDialog';
import { ContentArea } from './components/ContentArea';
import { DocsPage } from './components/DocsPage';
import { PromptEditPage } from './components/PromptEditPage';
import { SettingsPage } from './components/SettingsTab';
import { Sidebar } from './components/Sidebar';

export default function App() {
  const [activeItem, setActiveItem] = useState('all');
  const [prompts, setPrompts] = useState<Prompt[]>(mockPrompts);
  const [currentPage, setCurrentPage] = useState<'main' | 'edit'>('main');
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);

  const handleAddPrompt = () => {
    setEditingPrompt(null);
    setCurrentPage('edit');
  };

  const handleEditPrompt = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setCurrentPage('edit');
  };

  const handleBackToMain = () => {
    setCurrentPage('main');
    setEditingPrompt(null);
  };

  const handleDeletePrompt = (promptId: string) => {
    setPrompts((prev) => prev.filter((p) => p.id !== promptId));
  };

  const handleSavePrompt = (promptData: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingPrompt) {
      // 编辑现有提示词
      setPrompts((prev) =>
        prev.map((p) =>
          p.id === editingPrompt.id
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

  const handleItemChange = (itemId: string) => {
    if (itemId === 'contact') {
      setContactDialogOpen(true);
    } else {
      setActiveItem(itemId);
    }
  };

  const renderMainContent = () => {
    if (currentPage === 'edit') {
      return (
        <PromptEditPage
          prompt={editingPrompt}
          onSave={handleSavePrompt}
          onBack={handleBackToMain}
        />
      );
    }

    switch (activeItem) {
      case 'settings':
        return <SettingsPage prompts={prompts} onImportPrompts={handleImportPrompts} />;
      case 'docs':
        return <DocsPage />;
      default:
        return (
          <ContentArea
            activeItem={activeItem}
            prompts={prompts}
            searchQuery=""
            sidebarVisible={true}
            onEditPrompt={handleEditPrompt}
            onDeletePrompt={handleDeletePrompt}
            onAddPrompt={handleAddPrompt}
            onToggleSidebar={() => {}}
            onImportPrompts={handleImportPrompts}
          />
        );
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background dark">
        {/* 居中容器 */}
        <div className="max-w-7xl mx-auto">
          {/* 顶部导航栏 */}
          <header className="bg-background">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">P</span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* 主要内容区域 */}
          <div className="flex min-h-[calc(100vh-80px)]">
            {/* 左侧边栏 */}
            <div className="w-64">
              <Sidebar activeItem={activeItem} onItemChange={handleItemChange} />
            </div>

            {/* 右侧内容区域 */}
            <div className="flex-1">{renderMainContent()}</div>
          </div>
        </div>

        {/* Contact Us 对话框 */}
        <ContactDialog open={contactDialogOpen} onOpenChange={setContactDialogOpen} />
      </div>
    </TooltipProvider>
  );
}
