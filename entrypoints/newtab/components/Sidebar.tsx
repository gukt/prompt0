import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { mockTags } from '@/lib/mock-data';
import { MenuItem, Tag } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  HeartIcon,
  HelpCircleIcon,
  PinIcon,
  SearchIcon,
  SettingsIcon,
  StarIcon,
  TagIcon,
  UserIcon,
} from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  activeItem: string;
  onItemChange: (itemId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Sidebar({ activeItem, onItemChange, searchQuery, onSearchChange }: SidebarProps) {
  const [tags] = useState<Tag[]>(mockTags);
  const [showMoreTags, setShowMoreTags] = useState(false);

  // 基础固定菜单项
  const baseMenuItems: MenuItem[] = [
    { id: 'all', name: 'All Prompts', icon: 'Tag', count: 8 },
    { id: 'frequent', name: 'Frequent', icon: 'Pin', count: 4 },
    { id: 'favorites', name: 'Favorites', icon: 'Star', count: 3 },
  ];

  // 获取固定的分类并添加到固定菜单项中
  const pinnedTags = tags.filter((cat) => cat.isPinned);
  const unpinnedTags = tags.filter((cat) => !cat.isPinned);

  const pinnedTagItems: MenuItem[] = pinnedTags.map((cat) => ({
    id: cat.id,
    name: cat.name,
    icon: 'Pin',
    count: 3,
    color: cat.color,
  }));

  const allFixedMenuItems = [...baseMenuItems, ...pinnedTagItems];

  // 显示的未固定分类（默认 6 个，超出显示 more）
  const visibleUnpinnedTags = showMoreTags ? unpinnedTags : unpinnedTags.slice(0, 6);

  const hasMoreTags = unpinnedTags.length > 6;

  // 获取图标组件
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Pin':
        return <PinIcon className="w-4 h-4" />;
      case 'Star':
        return <StarIcon className="w-4 h-4" />;
      case 'Heart':
        return <HeartIcon className="w-4 h-4" />;
      default:
        return <TagIcon className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-64 bg-card h-full flex flex-col">
      {/* Header */}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Prompt Manager</h2>

        {/* Search Bar */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder="Search prompts..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Fixed Menu Items */}
      <div className="px-4 space-y-1 flex-1">
        {allFixedMenuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onItemChange(item.id)}
            className={cn(
              'w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors',
              activeItem === item.id
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent hover:text-accent-foreground',
            )}
          >
            <div className="flex items-center gap-2">
              {item.color ? (
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: item.color }}
                >
                  <PinIcon className="w-2 h-2 text-white" />
                </div>
              ) : (
                getIcon(item.icon || 'Tag')
              )}
              <span>{item.name}</span>
            </div>
            {item.count && (
              <Badge variant="secondary" className="text-xs">
                {item.count}
              </Badge>
            )}
          </button>
        ))}

        {/* Other Tags */}
        {visibleUnpinnedTags.length > 0 && (
          <>
            <div className="pt-4 pb-2">
              <h3 className="text-sm font-medium text-muted-foreground px-3">Other Tags</h3>
            </div>
            {visibleUnpinnedTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => onItemChange(tag.id)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors group',
                  activeItem === tag.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground',
                )}
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color }} />
                  <span>{tag.name}</span>
                </div>
                <Badge
                  variant="secondary"
                  className="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  3
                </Badge>
              </button>
            ))}

            {/* More Button */}
            {hasMoreTags && (
              <button
                onClick={() => setShowMoreTags(!showMoreTags)}
                className="w-full flex items-center justify-center px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <span>{showMoreTags ? `Show less` : `${unpinnedTags.length - 10} more...`}</span>
              </button>
            )}
          </>
        )}
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-border space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-accent hover:text-accent-foreground transition-colors">
          <SettingsIcon className="w-4 h-4" />
          <span>Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-accent hover:text-accent-foreground transition-colors">
          <HelpCircleIcon className="w-4 h-4" />
          <span>Get Help</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-accent hover:text-accent-foreground transition-colors">
          <SearchIcon className="w-4 h-4" />
          <span>Search</span>
        </button>

        {/* User Profile */}
        <div className="pt-2 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2">
            <UserIcon className="w-8 h-8 rounded-full bg-muted p-1" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">shadcn</p>
              <p className="text-xs text-muted-foreground truncate">m@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
