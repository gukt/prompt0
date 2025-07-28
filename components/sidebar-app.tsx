import { MemoryList } from '@/components/memory-list';
import { SidebarHeader } from '@/components/sidebar-header';
import { SidebarSettings } from '@/components/sidebar-settings';
import { SidebarTabs } from '@/components/sidebar-tabs';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function SidebarApp() {
  const [activeTab, setActiveTab] = useState<'memories' | 'settings'>('memories');

  const closeSidebar = () => {
    // 向父窗口发送关闭消息
    window.parent.postMessage({ action: 'close-sidebar' }, '*');
  };

  return (
    <div className="h-full bg-white flex flex-col">
      <SidebarHeader onClose={closeSidebar} />
      
      <SidebarTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'memories' ? (
          <MemoryList />
        ) : (
          <SidebarSettings />
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">
            Shortcut: ⌃ + M
          </div>
          <Button size="sm" variant="outline">
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
} 