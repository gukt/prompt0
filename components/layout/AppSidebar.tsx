import { useTag } from '@/hooks/useTag';
import { cn } from '@/lib/utils';
import { usePromptStore } from '@/stores/promptStore';
import { ListIcon, PinIcon } from 'lucide-react';
import React, { useMemo } from 'react';
import { NavLink } from 'react-router';

export function AppSidebar() {
  const { prompts } = usePromptStore();
  const { availableTags } = useTag(prompts);
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
    { id: 'all', name: 'My Prompts', to: '/', icon: <ListIcon />, count: stats.totalCount },
    // { id: 'discover', name: 'Discover', to: '/discover', icon: <SearchIcon /> },
    // { id: 'settings', name: 'Settings', to: '/settings', icon: <SettingsIcon /> },
    // { id: 'docs', name: 'Docs', to: '/docs', icon: <FileTextIcon /> },
  ];

  const subItems = [
    { id: 'all', name: 'All', to: '/prompts/all', icon: <ListIcon />, count: stats.totalCount },
    {
      id: 'recent',
      name: 'Recent',
      to: '/prompts/recent',
      icon: <PinIcon />,
      count: stats.pinnedCount,
    },
    // 子菜单：常用标签
    {
      id: 'writing',
      name: 'Writing',
      to: '/tag/writing',
      icon: <ListIcon />,
      count: prompts.filter((prompt) => prompt.tags.includes('Writing')).length,
    },
    {
      id: 'education',
      name: 'Education',
      to: '/tag/education',
      icon: <ListIcon />,
      count: prompts.filter((prompt) => prompt.tags.includes('Education')).length,
    },
    {
      id: 'marketing',
      name: 'Marketing',
      to: '/tag/marketing',
      icon: <ListIcon />,
      count: prompts.filter((prompt) => prompt.tags.includes('Marketing')).length,
    },
    {
      id: 'development',
      name: 'Development',
      to: '/tag/development',
      icon: <ListIcon />,
      count: prompts.filter((prompt) => prompt.tags.includes('Development')).length,
    },
  ];

  return (
    <div className="space-y-8 text-sm">
      {/* 菜单项列表 */}
      <div className="space-y-1">
        {menuItems.map((item) => (
          <>
            <NavLink
              key={item.id}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-8 text-sm ',
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
              {item.count && <div className="text-xs font-semibold">{item.count}</div>}
            </NavLink>

            {/* 显示 Sub 菜单 */}
            {subItems.map((subItem) => (
              <NavLink
                key={subItem.id}
                to={subItem.to}
                className={({ isActive }) =>
                  cn(
                    'flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-8 text-sm ',
                    isActive
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
                  )
                }
              >
                <div className="flex items-center gap-2">
                  {React.cloneElement(subItem.icon as React.ReactElement<any>, { size: 16 })}
                  <span className="font-medium">{subItem.name}</span>
                </div>
              </NavLink>
            ))}
          </>
        ))}
      </div>

      {/* 标签分组 */}
      <div>
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-2">
          标签
        </h3>
        <div className="px-2 py-2 flex flex-wrap gap-2">
          {availableTags?.map((tag) => (
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
          ))}
        </div>
      </div>
    </div>
  );
}
