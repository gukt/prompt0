import { mockTags } from '@/lib/mock-data';
import { MenuItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  FileTextIcon,
  HelpCircleIcon,
  ListIcon,
  MailIcon,
  PinIcon,
  SettingsIcon,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface SidebarProps {
  activeItem: string;
  onItemChange: (itemId: string) => void;
}

export function Sidebar({ activeItem, onItemChange }: SidebarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  // 主要分类菜单项
  const categoryItems: MenuItem[] = [
    { id: 'all', name: 'All Prompts', icon: 'List', count: 45 },
    { id: 'frequent', name: 'Frequent', icon: 'Pin', count: 6 },
  ];

  // 设置相关菜单项
  const settingsItems: MenuItem[] = [
    { id: 'settings', name: 'Settings', icon: 'Settings' },
    { id: 'docs', name: 'Docs', icon: 'FileText' },
    { id: 'contact', name: 'Contact Us', icon: 'Mail' },
  ];

  // 获取图标组件
  const getIcon = (iconName: string) => {
    const iconClass = 'w-4 h-4';
    switch (iconName) {
      case 'Pin':
        return <PinIcon className={iconClass} />;
      case 'List':
        return <ListIcon className={iconClass} />;
      case 'Settings':
        return <SettingsIcon className={iconClass} />;
      case 'FileText':
        return <FileTextIcon className={iconClass} />;
      case 'Mail':
        return <MailIcon className={iconClass} />;
      case 'Help':
        return <HelpCircleIcon className={iconClass} />;
      default:
        return <ListIcon className={iconClass} />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* 主要分类 */}
      <div className="flex-1">
        <div className="mb-6">
          <div className="space-y-1">
            {categoryItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onItemChange(item.id)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group',
                  activeItem === item.id
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="text-current">{getIcon(item.icon || 'List')}</div>
                  <span className="font-medium">{item.name}</span>
                </div>
                {item.count && (
                  <div
                    className={cn(
                      'text-xs font-medium px-2 py-0.5 rounded-full',
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
            {settingsItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onItemChange(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200',
                  activeItem === item.id
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
                )}
              >
                <div className="text-current">{getIcon(item.icon || 'List')}</div>
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </div>

          {/* 标签分组 */}
          <div className="mt-4 pt-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              标签
            </h3>
            <div className="px-2 py-2 flex flex-wrap gap-2">
              {mockTags.slice(0, 8).map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => onItemChange(tag.name.toLowerCase())}
                  className={cn(
                    'px-2 py-1 text-xs rounded-md border transition-colors',
                    activeItem === tag.name.toLowerCase()
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background hover:bg-accent border-border text-muted-foreground hover:text-foreground',
                  )}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* <Separator className="my-4" /> */}

        {/* 其他分组 */}
        <div className="mb-6 hidden">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            其他
          </h3>
          <div className="space-y-1">
            {settingsItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onItemChange(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200',
                  activeItem === item.id
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
                )}
              >
                <div className="text-current">{getIcon(item.icon || 'List')}</div>
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
