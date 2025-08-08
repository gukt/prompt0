import { usePrompts } from '@/hooks/usePrompts';
import { Prompt } from '@/lib/types';
import { useState } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { PromptEditor } from '../components/PromptEditor';
import { PromptGrid } from '../components/PromptGrid';

export const DashboardPage = () => {
  const [currentView, setCurrentView] = useState<'list' | 'edit'>('list');
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [activeItem, setActiveItem] = useState('all');

  const { prompts, addPrompt, updatePrompt } = usePrompts();

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

  const handleItemChange = (itemId: string) => {
    setActiveItem(itemId);
  };

  return (
    <div className="grid grid-cols-[16rem_1fr] gap-6">
      {/* 左侧边栏 */}
      <Sidebar activeItem={activeItem} onItemChange={handleItemChange} />

      {/* 右侧内容区域 */}
      {currentView === 'edit' ? (
        <PromptEditor prompt={editingPrompt} onSave={handleSave} onBack={handleBackToList} />
      ) : (
        <PromptGrid
          activeItem={activeItem}
          prompts={prompts}
          onEditPrompt={handleEditPrompt}
          onAddPrompt={handleAddPrompt}
        />
      )}
    </div>
  );
};
