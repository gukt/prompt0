import { Badge } from '@/components/ui/badge';
import { mockCategories } from '@/lib/mock-data';
import { Category, MenuItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Heart, HelpCircle, Pin, Search, Settings, Star, Tag, User } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  activeItem: string;
  onItemChange: (itemId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Sidebar({ activeItem, onItemChange, searchQuery, onSearchChange }: SidebarProps) {
  const [categories] = useState<Category[]>(mockCategories);
  const [showMoreCategories, setShowMoreCategories] = useState(false);

  // 基础固定菜单项
  const baseMenuItems: MenuItem[] = [
    { id: 'all', name: 'All Prompts', icon: 'Tag', count: 8 },
    { id: 'frequent', name: 'Frequent', icon: 'Pin', count: 4 },
    { id: 'favorites', name: 'Favorites', icon: 'Star', count: 3 },
  ];

  // 获取固定的分类并添加到固定菜单项中
  const pinnedCategories = categories.filter((cat) => cat.isPinned);
  const unpinnedCategories = categories.filter((cat) => !cat.isPinned);

  const pinnedCategoryItems: MenuItem[] = pinnedCategories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    icon: 'Pin',
    count: 3,
    color: cat.color,
  }));

  const allFixedMenuItems = [...baseMenuItems, ...pinnedCategoryItems];

  // 显示的未固定分类（默认10个，超出显示 more）
  const visibleUnpinnedCategories = showMoreCategories
    ? unpinnedCategories
    : unpinnedCategories.slice(0, 10);

  const hasMoreCategories = unpinnedCategories.length > 10;

  // 获取图标组件
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Pin':
        return <Pin className="w-4 h-4" />;
      case 'Star':
        return <Star className="w-4 h-4" />;
      case 'Heart':
        return <Heart className="w-4 h-4" />;
      default:
        return <Tag className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-64 bg-card h-full flex flex-col">
      {/* Header */}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Prompt Manager</h2>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
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
                  <Pin className="w-2 h-2 text-white" />
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

        {/* Other Categories */}
        {visibleUnpinnedCategories.length > 0 && (
          <>
            <div className="pt-4 pb-2">
              <h3 className="text-sm font-medium text-muted-foreground px-3">Other Categories</h3>
            </div>
            {visibleUnpinnedCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => onItemChange(category.id)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors group',
                  activeItem === category.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground',
                )}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span>{category.name}</span>
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
            {hasMoreCategories && (
              <button
                onClick={() => setShowMoreCategories(!showMoreCategories)}
                className="w-full flex items-center justify-center px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <span>
                  {showMoreCategories ? `Show less` : `${unpinnedCategories.length - 10} more...`}
                </span>
              </button>
            )}
          </>
        )}
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-border space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-accent hover:text-accent-foreground transition-colors">
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-accent hover:text-accent-foreground transition-colors">
          <HelpCircle className="w-4 h-4" />
          <span>Get Help</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-accent hover:text-accent-foreground transition-colors">
          <Search className="w-4 h-4" />
          <span>Search</span>
        </button>

        {/* User Profile */}
        <div className="pt-2 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2">
            <User className="w-8 h-8 rounded-full bg-muted p-1" />
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
