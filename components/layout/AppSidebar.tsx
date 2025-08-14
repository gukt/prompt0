import { useSidebar } from '@/hooks/use-sidebar';
import { cn } from '@/lib/utils';
import { usePromptStore } from '@/stores/promptStore';
import { ClockFadingIcon, HashIcon, ListIcon, SearchIcon, Trash2Icon } from 'lucide-react';
import React, { useMemo } from 'react';
import { NavLink } from 'react-router';
import { TagList } from '../TagList';

export function AppSidebar() {
  const { prompts } = usePromptStore();
  const { pinnedTags: pinnedTagNames } = useSidebar();
  const stats = useMemo(
    () => ({
      totalCount: prompts.length,
    }),
    [prompts],
  );

  const fixedMenuItems = [
    { id: 'all', name: 'All', to: '/', icon: <ListIcon />, count: stats.totalCount },
    { id: 'recent', name: 'Recent', to: '/prompts/recent', icon: <ClockFadingIcon /> },
    {
      id: 'trash',
      name: 'Trash',
      to: '/prompts/trash',
      icon: <Trash2Icon />,
    },
    { id: 'discover', name: 'Discover', to: '/discover', icon: <SearchIcon /> },
  ];

  const pinnedTags = pinnedTagNames.map((tag) => ({
    id: tag,
    name: tag,
    to: `/prompts/tags/${tag}`,
    icon: <HashIcon />,
    count: 0,
  }));

  const finalMenuItems = [...fixedMenuItems, ...pinnedTags];

  return (
    <aside className="w-64 flex flex-col space-y-8">
      {/* Nav Items */}
      <ul className="space-y-1">
        {finalMenuItems.map((item) => (
          <li>
            <NavLink
              key={item.id}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'sidebar-menu-item justify-between',
                  isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
                )
              }
            >
              <div className="flex items-center gap-2">
                {React.cloneElement(item.icon as React.ReactElement<any>, { size: 16 })}
                <span className="font-medium">{item.name}</span>
              </div>
              {/* 仅当 count 大于 0 时才显示 */}
              {item.count && item.count > 0 && (
                <div className="ml-auto p-2 text-xs font-semibold">{item.count}</div>
              )}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Tag Groups */}
      <div className="flex-1">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-2">
          Tags
        </h3>
        <div className="px-2 py-2 flex flex-wrap gap-2">
          <TagList />
        </div>
      </div>

      <div className="px-2 py-2">aaa</div>
    </aside>
  );
}
