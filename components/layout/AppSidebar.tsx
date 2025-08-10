import { useSidebar } from '@/hooks/useSidebar';
import { cn } from '@/lib/utils';
import { usePromptStore } from '@/stores/promptStore';
import {
  ClockFadingIcon,
  FileTextIcon,
  HashIcon,
  ListIcon,
  SearchIcon,
  SettingsIcon,
} from 'lucide-react';
import React, { useMemo } from 'react';
import { NavLink } from 'react-router';
import { TagList } from '../TagList';

export function AppSidebar() {
  const { prompts } = usePromptStore();
  const { pinnedTags: pinnedTagNames, getPromptCountForTag } = useSidebar();
  const stats = useMemo(
    () => ({
      totalCount: prompts.length,
      pinnedCount: prompts.filter((prompt) => prompt.isPinned).length,
    }),
    [prompts],
  );

  const fixedMenuItems = [
    { id: 'all', name: 'My Prompts', to: '/', icon: <ListIcon />, count: stats.totalCount },
    { id: 'recent', name: 'Recent', to: '/', icon: <ClockFadingIcon />, count: 0 },
  ];

  const pinnedTags = pinnedTagNames.map((tag) => ({
    id: tag,
    name: tag,
    to: `/tags/${tag}`,
    icon: <HashIcon />,
    count: getPromptCountForTag(tag),
  }));

  const otherItems = [
    { id: 'discover', name: 'Discover', to: '/discover', icon: <SearchIcon /> },
    { id: 'settings', name: 'Settings', to: '/settings', icon: <SettingsIcon /> },
    { id: 'docs', name: 'Docs', to: '/docs', icon: <FileTextIcon /> },
  ];

  const finalMenuItems = [...fixedMenuItems, ...pinnedTags];

  return (
    <div className="space-y-8 text-sm">
      {/* 菜单项列表 */}
      <div className="space-y-1">
        {finalMenuItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'sidebar-menu-item',
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
            {item.count && <div className="ml-auto p-1 text-xs font-semibold">{item.count}</div>}
          </NavLink>
        ))}
      </div>

      {/* 标签分组 */}
      <div>
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-2">
          标签
        </h3>
        <div className="px-2 py-2 flex flex-wrap gap-2">
          <TagList />
        </div>
      </div>
    </div>
  );
}
