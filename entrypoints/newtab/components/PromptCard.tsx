import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Prompt } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Heart, MoreHorizontal, Pin, Share2, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface PromptCardProps {
  prompt: Prompt;
  onCopy: (content: string) => void;
  onEdit: (prompt: Prompt) => void;
  onDelete?: (promptId: string) => void;
  onTogglePin?: (promptId: string) => void;
  onShare?: (prompt: Prompt) => void;
}

export default function PromptCard({
  prompt,
  onCopy,
  onEdit,
  onDelete,
  onTogglePin,
  onShare,
}: PromptCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const handleEdit = () => {
    onEdit(prompt);
  };

  const handleTogglePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTogglePin?.(prompt.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare?.(prompt);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this prompt? This action cannot be undone.')) {
      onDelete?.(prompt.id);
    }
    setShowMenu(false);
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  return (
    <div
      className="bg-card rounded-lg p-4 border border-border shadow-sm hover:shadow-md transition-all duration-200 group flex flex-col gap-3 cursor-pointer relative"
      onClick={handleEdit}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="truncate font-medium text-sm">{prompt.title}</span>
          {prompt.isFavorite && <Heart className="w-3 h-3 text-red-500 fill-current" />}
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-accent"
                onClick={handleTogglePin}
              >
                <Pin
                  className={cn(
                    'w-3 h-3',
                    prompt.isPinned ? 'text-yellow-500 fill-current' : 'text-muted-foreground',
                  )}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{prompt.isPinned ? 'Unpin' : 'Pin'}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-accent"
                onClick={handleShare}
              >
                <Share2 className="w-3 h-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Share</TooltipContent>
          </Tooltip>

          {/* Menu */}
          <div className="relative">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-accent"
                  onClick={handleMenuClick}
                >
                  <MoreHorizontal className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>More options</TooltipContent>
            </Tooltip>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-32 bg-popover border border-border rounded-md shadow-lg z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCopy(prompt.content);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors"
                >
                  Copy
                </button>
                {onDelete && (
                  <button
                    onClick={handleDelete}
                    className="w-full px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="text-sm text-muted-foreground line-clamp-4 hover:text-foreground transition-colors">
        {prompt.content}
      </div>

      {/* Footer - Only Categories */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {prompt.categories.slice(0, 3).map((category) => (
            <Badge key={category} variant="secondary" className="text-xs">
              {category}
            </Badge>
          ))}
          {prompt.categories.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{prompt.categories.length - 3}
            </Badge>
          )}
        </div>
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(false);
          }}
        />
      )}
    </div>
  );
}
