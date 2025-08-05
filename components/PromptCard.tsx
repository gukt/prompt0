import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { usePrompts } from '@/hooks/usePrompts';
import { Prompt } from '@/lib/types';
import { CopyIcon, MoreHorizontalIcon, PinIcon, Trash2Icon } from 'lucide-react';

interface PromptCardProps {
  prompt: Prompt;
}

export default function PromptCard({ prompt }: PromptCardProps) {
  const { togglePin, deletePrompt } = usePrompts();

  const handleTogglePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    togglePin(prompt.id);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      // 可以添加一个 toast 提示
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('确定要删除这个提示词吗？此操作无法撤销。')) {
      deletePrompt(prompt.id);
    }
  };

  return (
    <div className="flex flex-col gap-3 cursor-pointer rounded-xl p-4 border hover:border-primary transition-all duration-200 group">
      {/* Header/Title */}
      <div className="flex items-start justify-between">
        {/* Title */}
        <span className="truncate font-medium text-sm">{prompt.title}</span>

        {/* Action Icons */}
        <div className="flex items-center gap-1 opacity-100 group-hover:opacity-100 transition-opacity">
          {/* Pin Action */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 hover:bg-accent cursor-pointer"
                onClick={handleTogglePin}
              >
                <PinIcon
                  className={
                    prompt.isPinned ? 'text-primary fill-current' : 'text-muted-foreground'
                  }
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{prompt.isPinned ? 'Unpin' : 'Pin'}</TooltipContent>
          </Tooltip>

          {/* More Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 hover:bg-accent cursor-pointer">
                <MoreHorizontalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-32" align="end">
              <DropdownMenuItem onClick={handleCopy}>
                <CopyIcon /> Copy
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={handleDelete}>
                <Trash2Icon /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content */}
      <div className="text-sm text-muted-foreground line-clamp-4 hover:text-foreground transition-colors">
        {prompt.content}
      </div>

      {/* Footer - Only Tags */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {prompt.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} className="bg-muted/50 text-muted-foreground">
              {tag}
            </Badge>
          ))}
          {prompt.tags.length > 3 && (
            <Badge className="bg-muted/50 text-muted-foreground">+{prompt.tags.length - 3}</Badge>
          )}
        </div>
      </div>
    </div>
  );
}
