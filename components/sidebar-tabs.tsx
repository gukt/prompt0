
interface SidebarTabsProps {
  activeTab: 'memories' | 'settings';
  onTabChange: (tab: 'memories' | 'settings') => void;
}

export function SidebarTabs({ activeTab, onTabChange }: SidebarTabsProps) {
  return (
    <div className="flex border-b border-gray-200 bg-gray-50">
      <button
        onClick={() => onTabChange('memories')}
        className={`flex-1 py-3 px-4 text-sm font-medium ${
          activeTab === 'memories'
            ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Recent Memories
      </button>
      <button
        onClick={() => onTabChange('settings')}
        className={`flex-1 py-3 px-4 text-sm font-medium ${
          activeTab === 'settings'
            ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Settings
      </button>
    </div>
  );
} 