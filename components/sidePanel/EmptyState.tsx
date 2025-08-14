import { Button } from '@/components/ui/button';
import { FileTextIcon, SearchIcon, SettingsIcon } from 'lucide-react';

interface EmptyStateProps {
  onAction?: () => void;
}

const emptyStates: any = {
  recents: {
    icon: FileTextIcon,
    title: 'No recent prompts',
    description: 'Start using AI assistants to see your recent prompts here',
    actionText: 'Go to Settings',
    actionIcon: SettingsIcon,
  },
  search: {
    icon: SearchIcon,
    title: 'No results found',
    description: 'Try adjusting your search terms or filters',
    actionText: 'Clear Filters',
    actionIcon: SearchIcon,
  },
};

export function EmptyState({ onAction }: EmptyStateProps) {
  const state = emptyStates.recents;
  const Icon = state.icon;
  const ActionIcon = state.actionIcon;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-extension-card rounded-full p-4 mb-4">
        <Icon className="h-8 w-8 text-extension-text-muted" />
      </div>

      <h3 className="text-extension-text font-medium text-sm mb-2">{state.title}</h3>

      <p className="text-extension-text-muted text-xs mb-6 max-w-48 leading-relaxed">
        {state.description}
      </p>

      {onAction && (
        <Button
          onClick={onAction}
          variant="outline"
          size="sm"
          className="bg-extension-card border-extension-border text-extension-text hover:bg-extension-card-hover h-8 text-xs"
        >
          <ActionIcon className="h-3 w-3 mr-2" />
          {state.actionText}
        </Button>
      )}
    </div>
  );
}
