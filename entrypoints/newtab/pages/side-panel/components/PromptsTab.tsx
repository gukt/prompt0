import { usePrompts } from '@/lib/store/promptStore';
import { Prompt } from '@/lib/types';
import PromptCard from './PromptCard';

interface PromptsTabProps {
  onOpenDashboard: () => void;
  onCopyPrompt: (content: string) => void;
  onViewPrompt: (prompt: Prompt) => void;
}

export function PromptsTab({ onOpenDashboard, onCopyPrompt, onViewPrompt }: PromptsTabProps) {
  // 使用新的状态管理
  const { prompts, loading, error, togglePin, deletePrompt } = usePrompts();

  // 处理置顶切换
  const handleTogglePin = async (promptId: string) => {
    try {
      await togglePin(promptId);
    } catch (error) {
      console.error('切换置顶失败:', error);
    }
  };

  // 处理删除
  const handleDelete = async (promptId: string) => {
    if (confirm('确定要删除这个提示词吗？此操作无法撤销。')) {
      try {
        await deletePrompt(promptId);
      } catch (error) {
        console.error('删除失败:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">正在加载提示词...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-red-500">加载失败: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 overflow-y-auto">
      <h3 className="text-lg font-medium">Recent Prompts</h3>
      {prompts.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">还没有提示词，去创建第一个吧！</div>
      ) : (
        prompts.map((prompt) => (
          <PromptCard
            key={prompt.id}
            prompt={prompt}
            onCopy={onCopyPrompt}
            onEdit={onViewPrompt}
            onDelete={handleDelete}
            onTogglePin={handleTogglePin}
          />
        ))
      )}
    </div>
  );
}
