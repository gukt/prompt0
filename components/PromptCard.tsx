import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Prompt } from '@/lib/types';
import { usePromptStore } from '@/stores/promptStore';
import { CopyIcon, MoreHorizontalIcon, PinIcon, PinOffIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

interface PromptCardProps {
  prompt: Prompt;
}

export default function PromptCard({ prompt }: PromptCardProps) {
  const navigate = useNavigate();
  const { togglePin, deletePrompt } = usePromptStore();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
      // 可以添加一个 toast 提示
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    deletePrompt(prompt.id);
    setShowDeleteDialog(false);
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
  };

  return (
    <>
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 hover:bg-accent cursor-pointer"
                >
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

      {/* 删除确认 Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              确定要删除提示词 "{prompt.title}" 吗？此操作无法撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDelete}>
              取消
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
