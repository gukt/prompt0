import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Prompt } from '@/lib/types';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { ClockIcon, CopyIcon, MoreHorizontalIcon, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';

interface PromptCardProps {
  prompt: Prompt;
  onCopy: (content: string) => void;
  onEdit: (prompt: Prompt) => void;
  onDelete?: (promptId: string) => void;
  onTogglePin?: (promptId: string) => void;
}

export default function PromptCard({ prompt, onCopy, onEdit, onDelete }: PromptCardProps) {
  // const { variableNames } = usePromptVariable(prompt);
  const variableNames = ['source_lang', 'target_lang', 'source_text'];

  const handleEdit = () => {
    onEdit(prompt);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.content);
    onCopy?.(prompt.content);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this prompt? This action cannot be undone.')) {
      onDelete?.(prompt.id);
    }
  };

  return (
    <div
      className="border rounded-lg p-4 bg-card/40 hover:bg-card/60 transition-all duration-200 group space-y-3"
      onClick={handleEdit}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <h3 className="text-sm font-medium truncate">{prompt.title}</h3>

        {/* Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontalIcon className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleCopy}>
              <CopyIcon /> Copy
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={handleDelete}>
              <Trash2 /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content */}
      <p className="text-xs leading-relaxed text-foreground/75 line-clamp-3">{prompt.content}</p>

      {/* Variables */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {variableNames.slice(0, 3).map((v) => (
            <Badge
              key={v}
              variant="secondary"
              className="bg-muted/80 text-muted-foreground hover:bg-muted"
            >
              {`{${v}}`}
            </Badge>
          ))}
          {variableNames.length > 3 && (
            <Badge variant="secondary" className="bg-muted/80 text-muted-foreground hover:bg-muted">
              +{variableNames.length - 3}
            </Badge>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <ClockIcon className="h-3 w-3" />
          {/* <span>{formatDistanceToNow(prompt.createdAt, { addSuffix: true })}</span> */}
          <span>about 2 hours ago</span>
        </div>
      </div>
    </div>
  );
}
