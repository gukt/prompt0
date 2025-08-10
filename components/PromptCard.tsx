import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Prompt } from '@/lib/types';
import { usePromptStore } from '@/stores/promptStore';
import { CopyIcon, MoreHorizontalIcon, PinIcon, PinOffIcon, Trash2Icon } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner'; // 使用 sonner 的 toast

interface PromptCardProps {
  prompt: Prompt;
}

export default function PromptCard({ prompt }: PromptCardProps) {
  const navigate = useNavigate();
  const { togglePin, deletePrompt } = usePromptStore();

  const handleCardClick = () => {
    navigate(`/prompts/${prompt.id}/edit`);
  };

  const handleTogglePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    togglePin(prompt.id);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      toast.success('提示词已复制到剪贴板');
    } catch (error) {
      console.error('复制失败:', error);
      toast.error('复制失败');
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deletePrompt(prompt.id);
      toast.success('提示词已移动到回收站');
    } catch (error) {
      toast.error('删除失败');
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="flex flex-col gap-3 cursor-pointer rounded-xl p-4 border hover:border-primary transition-all duration-200 group"
    >
      {/* Header/Title */}
      <div className="flex items-start justify-between">
        {/* Title and Pin Icon (if pinned) */}
        <div className="flex items-center gap-1 font-medium text-sm">
          <span className="truncate line-clamp-1">{prompt.title}</span>
          {prompt.isPinned ? <PinIcon size={14} className="text-muted-foreground" /> : null}
        </div>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-1 opacity-100 group-hover:opacity-100 transition-opacity">
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
              <DropdownMenuItem onClick={handleTogglePin}>
                <>
                  {prompt.isPinned ? <PinOffIcon /> : <PinIcon />}
                  {prompt.isPinned ? 'Unpin' : 'Pin'}
                </>
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
