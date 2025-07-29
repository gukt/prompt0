import { MenuItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  FileTextIcon,
  HeartIcon,
  HelpCircleIcon,
  ListIcon,
  MailIcon,
  PinIcon,
  SettingsIcon,
  StarIcon,
} from 'lucide-react';

interface SidebarProps {
  activeItem: string;
  onItemChange: (itemId: string) => void;
}

export function Sidebar({ activeItem, onItemChange }: SidebarProps) {
  // 主要分类菜单项
  const categoryItems: MenuItem[] = [
    { id: 'all', name: 'All Prompts', icon: 'List', count: 45 },
    { id: 'writing', name: 'Writing', icon: 'List', count: 14 },
    { id: 'tech', name: 'Tech', icon: 'List', count: 12 },
    { id: 'ai', name: 'AI', icon: 'List', count: 8 },
    { id: 'frequent', name: 'Frequent', icon: 'Pin', count: 6 },
    { id: 'favorites', name: 'Favorites', icon: 'Star', count: 4 },
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
      case 'Star':
        return <StarIcon className={iconClass} />;
      case 'Heart':
        return <HeartIcon className={iconClass} />;
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
    <div className="w-64 h-full flex flex-col">
      {/* 用户信息 - 顶部 */}
      <div className="p-6 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
            <span className="text-muted-foreground text-sm font-medium">G</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-foreground text-sm font-medium">Gu Kaitong</div>
            <div className="text-muted-foreground text-xs truncate">gukailtong@gmail.com</div>
          </div>
        </div>
      </div>

      {/* 主要分类 */}
      <div className="flex-1 px-6">
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            我的列表
          </h3>
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
          </div>
        </div>

        {/* 分割线 */}
        <div className="border-t border-border mb-6"></div>

        {/* 设置相关 */}
        <div className="mb-6">
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
