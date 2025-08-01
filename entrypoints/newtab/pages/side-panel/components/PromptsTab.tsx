import { Prompt } from '@/lib/types';
import PromptCard from './PromptCard';

interface PromptsTabProps {
  prompts: Prompt[];
  onOpenDashboard: () => void;
  onCopyPrompt: (content: string) => void;
  onViewPrompt: (prompt: Prompt) => void;
}

export function PromptsTab({
  prompts,
  onOpenDashboard,
  onCopyPrompt,
  onViewPrompt,
}: PromptsTabProps) {
  return (
    <div className="space-y-4 overflow-y-auto">
      <h3 className="text-lg font-medium">Recent Prompts</h3>
      {prompts.map((prompt) => (
        <PromptCard key={prompt.id} prompt={prompt} onCopy={onCopyPrompt} onView={onViewPrompt} />
      ))}
    </div>
  );
}
