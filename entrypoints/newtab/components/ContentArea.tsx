import { Button } from '@/components/ui/button';
import { Prompt } from '@/lib/types';
import { Menu, Plus } from 'lucide-react';
import PromptCard from './PromptCard';

interface ContentAreaProps {
  activeItem: string;
  prompts: Prompt[];
  searchQuery: string;
  sidebarVisible: boolean;
  onEditPrompt: (prompt: Prompt) => void;
  onDeletePrompt: (promptId: string) => void;
  onAddPrompt: () => void;
  onToggleSidebar: () => void;
}

export function ContentArea({
  activeItem,
  prompts,
  searchQuery,
  sidebarVisible,
  onEditPrompt,
  onDeletePrompt,
  onAddPrompt,
  onToggleSidebar,
}: ContentAreaProps) {
  // 根据当前选中的菜单项过滤提示词
  const getFilteredPrompts = () => {
    let filtered = prompts;

    // 根据菜单项过滤
    switch (activeItem) {
      case 'frequent':
        filtered = prompts.filter((p) => p.isPinned);
        break;
      case 'favorites':
        filtered = prompts.filter((p) => p.isFavorite);
        break;
      case 'all':
        filtered = prompts;
        break;
      default:
        // 按分类过滤
        filtered = prompts.filter((p) =>
          p.categories.some((cat) => cat.toLowerCase().includes(activeItem.toLowerCase())),
        );
    }

    // 根据搜索关键词过滤
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.categories.some((cat) => cat.toLowerCase().includes(searchQuery.toLowerCase())),
      );
    }

    return filtered;
  };

  const filteredPrompts = getFilteredPrompts();

  const getTitle = () => {
    switch (activeItem) {
      case 'frequent':
        return 'Frequent Prompts';
      case 'favorites':
        return 'Favorite Prompts';
      case 'all':
        return 'All Prompts';
      default:
        return `${activeItem} Category`;
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    // TODO: Add toast notification
  };

  const handleTogglePin = (promptId: string) => {
    // TODO: Implement toggle pin functionality
    console.log('Toggle pin for prompt:', promptId);
  };

  const handleShare = (prompt: Prompt) => {
    // TODO: Implement share functionality
    console.log('Share prompt:', prompt);
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onToggleSidebar} className="p-1 h-8 w-8">
              <Menu className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-border"></div>
            <h1 className="text-2xl font-bold">{getTitle()}</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={onAddPrompt}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Prompt
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {filteredPrompts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Plus className="w-6 h-6" />
            </div>
            <p className="text-lg font-medium">No prompts found</p>
            <p className="text-sm mb-4">
              {searchQuery
                ? 'Try adjusting your search terms'
                : 'Create your first prompt to get started'}
            </p>
            {!searchQuery && (
              <Button onClick={onAddPrompt} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Prompt
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPrompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                onCopy={handleCopy}
                onEdit={onEditPrompt}
                onDelete={onDeletePrompt}
                onTogglePin={handleTogglePin}
                onShare={handleShare}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
