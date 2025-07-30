import { mockTags } from '@/lib/mock-data';
import { MenuItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  ChevronDownIcon,
  FileTextIcon,
  HelpCircleIcon,
  ListIcon,
  MailIcon,
  PinIcon,
  SettingsIcon,
} from 'lucide-react';

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
    // { id: 'writing', name: 'Writing', icon: 'List', count: 14 },
    // { id: 'tech', name: 'Tech', icon: 'List', count: 12 },
    // { id: 'ai', name: 'AI', icon: 'List', count: 8 },
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
    <div className="w-64 h-full flex flex-col">
      {/* 用户信息下拉菜单 */}
      <div className="p-6 pb-4" ref={menuRef}>
        <div className="relative">
          <div 
            className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
              <span className="text-muted-foreground text-sm font-medium">G</span>
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="text-foreground text-sm font-medium">Gu Kaitong</div>
              <div className="text-muted-foreground text-xs truncate">gukaitong@gmail.com</div>
            </div>
            <ChevronDownIcon className={cn(
              "w-4 h-4 text-muted-foreground transition-transform",
              showUserMenu && "rotate-180"
            )} />
          </div>
          
          {/* 下拉菜单 */}
          {showUserMenu && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50">
              <button
                onClick={() => {
                  onItemChange('settings');
                  setShowUserMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent transition-colors"
              >
                <SettingsIcon className="w-4 h-4" />
                设置
              </button>
              <button
                onClick={() => {
                  onItemChange('docs');
                  setShowUserMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent transition-colors"
              >
                <FileTextIcon className="w-4 h-4" />
                文档
              </button>
              <button
                onClick={() => {
                  onItemChange('contact');
                  setShowUserMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent transition-colors"
              >
                <MailIcon className="w-4 h-4" />
                联系我们
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 主要分类 - 去掉分组标题 */}
      <div className="flex-1 px-6">
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
          </div>
          
          {/* 标签分组 - 移到 frequent 下面，采用简洁样式 */}
          <div className="mt-4 pt-4 border-t border-border/60">
            <div className="px-3 py-2">
              <div className="text-xs font-medium text-muted-foreground mb-2">Tags</div>
              <div className="flex flex-wrap gap-1.5">
                {mockTags.slice(0, 8).map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => onItemChange(tag.name.toLowerCase())}
                    className={cn(
                      'px-2 py-1 text-xs rounded-md border transition-colors',
                      activeItem === tag.name.toLowerCase()
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background hover:bg-accent border-border text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 分割线 */}
        <div className="border-t border-border mb-6"></div>

        {/* 其他分组 - 移到下面 */}
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
