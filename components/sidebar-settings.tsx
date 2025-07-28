import { Button } from '@/components/ui/button';

export function SidebarSettings() {
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
      <div className="space-y-4">
        <div className="p-3 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">API Configuration</h4>
          <p className="text-sm text-gray-600 mb-3">
            Configure your OpenMemory API settings
          </p>
          <Button size="sm" className="w-full">
            Configure API
          </Button>
        </div>
        
        <div className="p-3 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Privacy Settings</h4>
          <p className="text-sm text-gray-600 mb-3">
            Manage your data and privacy preferences
          </p>
          <Button size="sm" variant="outline" className="w-full">
            Privacy Settings
          </Button>
        </div>

        <div className="p-3 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Memory Management</h4>
          <p className="text-sm text-gray-600 mb-3">
            Export, backup, or clear your memories
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1">
              Export
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              Clear All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 