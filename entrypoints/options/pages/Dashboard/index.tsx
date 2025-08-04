import { usePrompts } from '@/lib/hooks/prompt';
import { Prompt } from '@/lib/types';
import { useState } from 'react';
import { PromptEditor } from './components/PromptEditor';
import { PromptGrid } from './components/PromptGrid';
import { Sidebar } from './components/Sidebar';

interface DashboardPageProps {
  activeItem: string;
  onItemChange: (itemId: string) => void;
}

export const DashboardPage = ({ activeItem, onItemChange }: DashboardPageProps) => {
  const [currentView, setCurrentView] = useState<'list' | 'edit'>('list');
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);

  // 使用新的状态管理
  const { prompts, addPrompt, updatePrompt, deletePrompt, importPrompts } = usePrompts();

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

  const handleSave = async (promptData: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingPrompt?.id) {
        await updatePrompt(editingPrompt.id, promptData);
      } else {
        await addPrompt(promptData);
      }
      handleBackToList();
    } catch (error) {
      console.error('保存失败:', error);
    }
  };

  return (
    <div className="grid grid-cols-[16rem_1fr] gap-6">
      {/* 左侧边栏 */}
      <Sidebar activeItem={activeItem} onItemChange={onItemChange} />

      {/* 右侧内容区域 */}
      {currentView === 'edit' ? (
        <PromptEditor prompt={editingPrompt} onSave={handleSave} onBack={handleBackToList} />
      ) : (
        <PromptGrid
          activeItem={activeItem}
          prompts={prompts}
          onEditPrompt={handleEditPrompt}
          onDeletePrompt={deletePrompt}
          onAddPrompt={handleAddPrompt}
          onImportPrompts={importPrompts}
        />
      )}
    </div>
  );
};
