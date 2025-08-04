import { usePrompts } from '@/lib/hooks/prompt';
import { SidebarMenuItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import { FileTextIcon, ListIcon, MailIcon, PinIcon, SettingsIcon } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';

interface SidebarProps {
  activeItem: string;
  onItemChange: (itemId: string) => void;
}

export function Sidebar({ activeItem, onItemChange }: SidebarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 使用 prompts store 获取数据
  const { prompts } = usePrompts();

  // 统计 Prompt 数量, 使用 useMemo 避免不必要的重复计算
  const stats = useMemo(
    () => ({
      totalCount: prompts.length,
      pinnedCount: prompts.filter((prompt) => prompt.isPinned).length,
    }),
    [prompts],
  );

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 菜单项定义
  const menuItems: SidebarMenuItem[] = [
    { id: 'all', name: 'All Prompts', icon: <ListIcon />, count: stats.totalCount },
    { id: 'frequent', name: 'Frequent', icon: <PinIcon />, count: stats.pinnedCount },
    { id: 'settings', name: 'Settings', icon: <SettingsIcon /> },
    { id: 'docs', name: 'Docs', icon: <FileTextIcon /> },
    { id: 'contact', name: 'Contact Us', icon: <MailIcon /> },
  ];

  return (
    <div className="space-y-8 text-sm">
      {/* 菜单项列表 */}
      <div className="space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onItemChange(item.id)}
            className={cn(
              'w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group',
              activeItem === item.id
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
            )}
          >
            <div className="flex items-center gap-3">
              <div className="text-muted-foreground">
                {React.cloneElement(item.icon as React.ReactElement<any>, { size: 16 })}
              </div>
              <span className="font-medium">{item.name}</span>
            </div>
            {item.count && (
              <div
                className={cn(
                  'text-xs font-semibold',
                  activeItem === item.id
                    ? 'text-muted-foreground'
                    : 'text-muted-foreground/70 group-hover:text-muted-foreground',
                )}
              >
                {item.count}
              </div>
            )}
          </button>
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
                onClick={() => onItemChange(tag.toLowerCase())}
                className={cn(
                  'px-2 py-1 text-xs rounded-md border transition-colors',
                  activeItem === tag.toLowerCase()
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
