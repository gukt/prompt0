import { Prompt } from '@/lib/types';
import { usePromptStore } from '@/stores/promptStore';
import { EmptyState } from './EmptyState';
import PromptCard from './PromptCard';

interface PromptsTabProps {
  onOpenDashboard: () => void;
  onCopyPrompt: (content: string) => void;
  onViewPrompt: (prompt: Prompt) => void;
}

// TODO 将 copy 按钮放出来比较明显一点
// TODO 考虑直接拷贝，直接插入，变量复制进行插入的交互方式
// TODO 考虑如何进行编辑
// TODO 考虑如何区分有变量时的拷贝与设置变量的交互
// TODO 考虑支持变量的 PromptEditor 的交互与实现
export function PromptsTab({ onCopyPrompt, onViewPrompt }: PromptsTabProps) {
  // 使用新的状态管理
  const { prompts, loading, error, deletePrompt } = usePromptStore();

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
      {prompts.length === 0 ? (
        <EmptyState onAction={() => {}} />
      ) : (
        prompts.map((prompt) => (
          <PromptCard
            key={prompt.id}
            prompt={prompt}
            onCopy={onCopyPrompt}
            onEdit={onViewPrompt}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
}
