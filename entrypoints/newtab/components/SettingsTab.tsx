export function SettingsTab() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Settings</h3>
      <div className="space-y-3">
        <div className="bg-gray-800 rounded-lg p-3">
          <label className="block text-sm font-medium mb-2">API Key</label>
          <input
            type="password"
            placeholder="输入你的 API Key"
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div className="bg-gray-800 rounded-lg p-3">
          <label className="flex items-center justify-between">
            <span className="text-sm font-medium">自动保存提示词</span>
            <input
              type="checkbox"
              defaultChecked
              className="rounded border-gray-600 bg-gray-700 text-blue-600"
            />
          </label>
        </div>
        <div className="bg-gray-800 rounded-lg p-3">
          <label className="block text-sm font-medium mb-2">快捷键</label>
          <div className="text-xs text-gray-400 bg-gray-700 rounded px-2 py-1 inline-block">
            ⌘ + M (或 Ctrl + M)
          </div>
        </div>
      </div>
    </div>
  );
} 