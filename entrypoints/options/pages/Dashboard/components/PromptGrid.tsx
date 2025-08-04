import { Button } from '@/components/ui/button';
import { Prompt } from '@/lib/types';
import { PlusIcon } from 'lucide-react';
import { ExportButton } from '../../../../../components/ExportButton';
import { ImportButton } from '../../../../../components/ImportButton';
import PromptCard from '../../../components/PromptCard';
import { usePromptFilter } from '../hooks/usePromptFilter';

interface PromptGridProps {
  activeItem: string;
  prompts: Prompt[];
  onEditPrompt: (prompt: Prompt) => void;
  onDeletePrompt: (promptId: string) => void;
  onAddPrompt: () => void;
  onImportPrompts: (prompts: Prompt[]) => void;
}

export function PromptGrid({
  activeItem,
  prompts,
  onEditPrompt,
  onDeletePrompt,
  onAddPrompt,
}: PromptGridProps) {
  const { filteredPrompts } = usePromptFilter(prompts, activeItem);

  const handleTogglePin = (promptId: string) => {
    // TODO: Implement toggle pin functionality
    console.log('Toggle pin for prompt:', promptId);
  };

  return (
    <div className="px-6">
      {/* 头部操作栏 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">
            {activeItem === 'all' && 'All Prompts'}
            {activeItem === 'frequent' && 'Frequent Prompts'}
            {activeItem !== 'all' && activeItem !== 'frequent' && `${activeItem} Prompts`}
          </h1>
          <span className="text-sm text-muted-foreground">({filteredPrompts.length})</span>
        </div>

        <div className="flex items-center gap-2">
          {/* 导入按钮 */}
          <ImportButton variant="outline" size="sm" />

          {/* 导出按钮 */}
          <ExportButton variant="outline" size="sm" />

          {/* 添加提示词按钮 */}
          <Button onClick={onAddPrompt} size="sm" className="flex items-center gap-2">
            <PlusIcon className="w-4 h-4" />
            添加提示词
          </Button>
        </div>
      </div>

      {/* 提示词列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {filteredPrompts.map((prompt) => (
          <PromptCard
            key={prompt.id}
            prompt={prompt}
            onEdit={() => onEditPrompt(prompt)}
            onDelete={() => onDeletePrompt(prompt.id)}
            onTogglePin={() => handleTogglePin(prompt.id)}
            onCopy={() => navigator.clipboard.writeText(prompt.content)}
          />
        ))}
      </div>

      {/* 空状态 */}
      {filteredPrompts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            {activeItem === 'all' ? '还没有提示词' : `没有找到相关的提示词`}
          </div>
          <Button onClick={onAddPrompt} className="flex items-center gap-2">
            <PlusIcon className="w-4 h-4" />
            创建第一个提示词
          </Button>
        </div>
      )}
    </div>
  );
}
