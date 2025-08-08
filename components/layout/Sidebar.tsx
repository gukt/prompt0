import { usePrompts } from '@/hooks/usePrompts';
import { cn } from '@/lib/utils';
import { FileTextIcon, ListIcon, SearchIcon, SettingsIcon } from 'lucide-react';
import React, { useMemo } from 'react';
import { NavLink } from 'react-router';

export function Sidebar() {
  const { prompts } = usePrompts();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const stats = useMemo(
    () => ({
      totalCount: prompts.length,
      pinnedCount: prompts.filter((prompt) => prompt.isPinned).length,
    }),
    [prompts],
  );

  // 菜单项定义
  const menuItems = [
    { id: 'all', name: 'My Prompts', to: '/prompts', icon: <ListIcon />, count: stats.totalCount },
    { id: 'discover', name: 'Discover', to: '/discover', icon: <SearchIcon /> },
    { id: 'settings', name: 'Settings', to: '/settings', icon: <SettingsIcon /> },
    { id: 'docs', name: 'Docs', to: '/docs', icon: <FileTextIcon /> },
  ];

  return (
    <div className="space-y-8 text-sm">
      {/* 菜单项列表 */}
      <div className="space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group',
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
              )
            }
          >
            <div className="flex items-center gap-3">
              <div className="text-muted-foreground">
                {React.cloneElement(item.icon as React.ReactElement<any>, { size: 16 })}
              </div>
              <span className="font-medium">{item.name}</span>
            </div>
            {item.count && <div className="text-xs font-semibold">{item.count}</div>}
          </NavLink>
        ))}
      </div>

      {/* 标签分组 */}
      <div>
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-2">
          标签
        </h3>
        <div className="px-2 py-2 flex flex-wrap gap-2">
          {prompts.slice(0, 8).map((prompt) =>
            prompt.tags?.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={cn(
                  'px-2 py-1 text-xs rounded-md border transition-colors',
                  selectedTag === tag
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background hover:bg-accent border-border text-muted-foreground hover:text-foreground',
                )}
              >
                {tag}
              </button>
            )),
          )}
        </div>
      </div>
    </div>
  );
}
