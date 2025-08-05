import { Button } from '@/components/ui/button';
import { Prompt } from '@/lib/types';
import { PlusIcon } from 'lucide-react';

interface PromptGridProps {
  activeItem: string;
  prompts: Prompt[];
  onEditPrompt: (prompt: Prompt) => void;
  onAddPrompt: () => void;
}

export function PromptGrid({ activeItem, prompts, onEditPrompt, onAddPrompt }: PromptGridProps) {
  const { filteredPrompts } = usePromptFilter(prompts, activeItem);

  return (
    <div className="px-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-1">
          <h1 className="text-lg font-medium">
            {activeItem === 'all' && 'All Prompts'}
            {activeItem === 'frequent' && 'Frequent Prompts'}
            {activeItem !== 'all' && activeItem !== 'frequent' && `${activeItem} Prompts`}
          </h1>
          <span>({filteredPrompts.length})</span>
        </div>

        <Button variant="ghost" onClick={onAddPrompt} size="sm" className="cursor-pointer">
          <PlusIcon /> Add Prompt
        </Button>
      </div>

      {/* Prompt Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {filteredPrompts.map((prompt) => (
          <PromptCard key={prompt.id} prompt={prompt} onEdit={onEditPrompt} />
        ))}
      </div>

      {/* Empty State */}
      {filteredPrompts.length === 0 && (
        <div className="text-muted-foreground text-center my-10">No prompts found</div>
      )}
    </div>
  );
}
