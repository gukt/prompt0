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
  Trash2Icon,
} from 'lucide-react';
import React, { useMemo } from 'react';
import { NavLink } from 'react-router';
import { TagList } from '../TagList';

export function AppSidebar() {
  const { prompts, deletedPrompts } = usePromptStore();
  const { pinnedTags: pinnedTagNames } = useSidebar();
  const { getPromptCountForTag } = useTag(prompts);
  const stats = useMemo(
    () => ({
      totalCount: prompts.length,
      pinnedCount: prompts.filter((prompt) => prompt.isPinned).length,
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
