import type { Prompt } from '@/backup/PromptCard';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Check as CheckIcon, Copy as CopyIcon, Eye as EyeIcon } from 'lucide-react';

interface PromptCardProps {
  prompt: Prompt;
  onCopy: (content: string) => void;
  onView: (prompt: Prompt) => void;
}

export default function PromptCard({ prompt, onCopy, onView }: PromptCardProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    onCopy(prompt.content);

    setIsCopied(true);
    // 2 秒后重置
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }

  return (
    <div className="bg-card rounded-lg p-4 flex flex-col gap-2 shadow hover:shadow-lg transition-shadow group">
      <div className="flex items-center justify-between">
        {/* Title */}
        <span className="truncate max-w-[240px] block font-medium">{prompt.title}</span>
        {/* Icons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="text-primary/75 hover:text-primary cursor-pointer p-1 rounded-md hover:bg-primary/10"
                onClick={() => handleCopy()}
                type="button"
              >
                {isCopied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              {isCopied ? '已复制' : '复制到剪贴板'}
            </TooltipContent>
          </Tooltip>

          <button
            className="text-primary/75 hover:text-primary cursor-pointer p-1 rounded-md hover:bg-primary/10"
            onClick={() => onView(prompt)}
            title="查看"
            type="button"
          >
            <EyeIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      {/* Content */}
      <div className="text-sm text-primary/75 break-words line-clamp-5" onClick={() => onView(prompt)}>
        {prompt.content}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {prompt.categories.map((category) => (
          <Badge key={category} variant="secondary" className="text-primary/50">
            {category}
          </Badge>
        ))}
      </div>
    </div>
  );
} 