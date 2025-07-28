import { Copy as CopyIcon, Eye as EyeIcon } from 'lucide-react';

interface Prompt {
  id: string;
  title: string;
  content: string;
  categories: string[];
  createdAt: Date;
}

interface PromptCardProps {
  prompt: Prompt;
  onCopy: (content: string) => void;
  onView: (prompt: Prompt) => void;
}

export default function PromptCard({ prompt, onCopy, onView }: PromptCardProps) {
  return (
    <div className="rounded-lg p-3 group hover:bg-gray-750 transition-colors">
      <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">{prompt.content}</p>
      <div className="flex items-center justify-between mt-2">
        <span className="inline-block bg-blue-900 text-blue-300 text-xs px-2 py-1 rounded">
          {prompt.categories}
        </span>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onCopy(prompt.content)}
            className="text-gray-400 hover:text-white transition-colors p-1"
            title="复制"
          >
            <CopyIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onView(prompt)}
            className="text-gray-400 hover:text-white transition-colors p-1"
            title="查看"
          >
            <EyeIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export type { Prompt, PromptCardProps };
