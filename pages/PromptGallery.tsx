import { Button } from '@/components/ui/button';
import { usePromptFilter } from '@/hooks/usePromptFilter';
import { usePromptStore } from '@/stores/promptStore';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import PromptCard from '../components/PromptCard';

export function PromptGallery() {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('all');

  const { prompts } = usePromptStore();
  const { filteredPrompts } = usePromptFilter(prompts, activeItem);

  // const handleEditPrompt = (prompt: Prompt) => {
  //   navigate(`/prompts/${prompt.id}/edit`);
  // };

  const handleAddPrompt = () => {
    navigate('/prompts/new');
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-1">
          <h1 className="text-lg font-medium">
            {activeItem === 'all' && 'My Prompts'}
            {activeItem !== 'all' && `${activeItem} Prompts`}
          </h1>
          <span>({filteredPrompts.length})</span>
        </div>

        <Button variant="ghost" onClick={handleAddPrompt} size="sm" className="cursor-pointer">
          <PlusIcon /> Add Prompt
        </Button>
      </div>

      {/* Prompt Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {filteredPrompts.map((prompt) => (
          <PromptCard key={prompt.id} prompt={prompt} />
        ))}
      </div>

      {/* Empty State */}
      {filteredPrompts.length === 0 && (
        <div className="text-muted-foreground text-center my-10">No prompts found</div>
      )}
    </>
  );
}
