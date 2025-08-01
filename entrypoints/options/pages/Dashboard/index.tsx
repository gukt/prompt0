import { Prompt } from '@/lib/types';
import { useState } from 'react';
import { PromptEditor } from './components/PromptEditor';
import { PromptList } from './components/PromptList';
import { Sidebar } from './components/Sidebar';

interface DashboardPageProps {
  activeItem: string;
  prompts: Prompt[];
  onDeletePrompt: (id: string) => void;
  onImportPrompts: (prompts: Prompt[]) => void;
  onItemChange: (itemId: string) => void;
  onSavePrompt: (
    promptData: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>,
    promptId?: string,
  ) => void;
}

export const DashboardPage = ({
  activeItem,
  prompts,
  onDeletePrompt,
  onImportPrompts,
  onItemChange,
  onSavePrompt,
}: DashboardPageProps) => {
  const [currentView, setCurrentView] = useState<'list' | 'edit'>('list');
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);

  const handleAddPrompt = () => {
    setEditingPrompt(null);
    setCurrentView('edit');
  };

  const handleEditPrompt = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setCurrentView('edit');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setEditingPrompt(null);
  };

  const handleSave = (promptData: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => {
    onSavePrompt(promptData, editingPrompt?.id);
    handleBackToList();
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] max-w-6xl mx-auto">
      {/* 左侧边栏 */}
      <div className="w-76">
        <Sidebar activeItem={activeItem} onItemChange={onItemChange} />
      </div>

      {/* 右侧内容区域 */}
      <div className="flex-1 ml-12">
        {currentView === 'edit' ? (
          <PromptEditor prompt={editingPrompt} onSave={handleSave} onBack={handleBackToList} />
        ) : (
          <PromptList
            activeItem={activeItem}
            prompts={prompts}
            onEditPrompt={handleEditPrompt}
            onDeletePrompt={onDeletePrompt}
            onAddPrompt={handleAddPrompt}
            onImportPrompts={onImportPrompts}
          />
        )}
      </div>
    </div>
  );
};
