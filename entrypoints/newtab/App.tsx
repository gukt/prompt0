import '@/assets/tailwind.css';
import { TooltipProvider } from '@/components/ui/tooltip';
import { mockPrompts } from '@/lib/mock-data';
import { Prompt } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { ContentArea } from './components/ContentArea';
import { PromptDialog } from './components/PromptDialog';
import { Sidebar } from './components/Sidebar';

export default function App() {
  const [activeItem, setActiveItem] = useState('all');
  const [prompts, setPrompts] = useState<Prompt[]>(mockPrompts);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const handleAddPrompt = () => {
    setEditingPrompt(null);
    setDialogOpen(true);
  };

  const handleEditPrompt = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setDialogOpen(true);
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

  const handleToggleSidebar = () => {
    setSidebarVisible((prev) => !prev);
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground">
        <div className="flex h-screen">
          {/* 左侧边栏 */}
          <div
            className={cn(
              'transition-all duration-300 ease-in-out border-r border-border',
              sidebarVisible ? 'w-64' : 'w-0 overflow-hidden',
            )}
          >
            <Sidebar
              activeItem={activeItem}
              onItemChange={setActiveItem}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>

          {/* 右侧内容区域 */}
          <ContentArea
            activeItem={activeItem}
            prompts={prompts}
            searchQuery={searchQuery}
            sidebarVisible={sidebarVisible}
            onEditPrompt={handleEditPrompt}
            onDeletePrompt={handleDeletePrompt}
            onAddPrompt={handleAddPrompt}
            onToggleSidebar={handleToggleSidebar}
          />
        </div>

        {/* 新增/编辑对话框 */}
        <PromptDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          prompt={editingPrompt}
          onSave={handleSavePrompt}
        />
      </div>
    </TooltipProvider>
  );
}
