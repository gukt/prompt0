import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { usePrompts } from '@/hooks/usePrompts';
import { cn } from '@/lib/utils';
import { FileTextIcon, ListIcon, SearchIcon, SettingsIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { NavLink } from 'react-router';

export function Sidebar2() {
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
    { id: 'all', name: 'My Prompts', to: '/prompts', icon: ListIcon, count: stats.totalCount },
    { id: 'discover', name: 'Discover', to: '/discover', icon: SearchIcon },
    { id: 'settings', name: 'Settings', to: '/settings', icon: SettingsIcon },
    { id: 'docs', name: 'Docs', to: '/docs', icon: FileTextIcon },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        {/* 主菜单组 */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        cn(
                          'w-full flex items-center justify-between gap-3',
                          isActive && 'text-accent-foreground',
                        )
                      }
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </div>
                      {item.count && <span className="text-xs font-medium">{item.count}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* 标签组 */}
        <SidebarGroup>
          <SidebarGroupLabel>标签</SidebarGroupLabel>
          <SidebarGroupContent>
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
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
