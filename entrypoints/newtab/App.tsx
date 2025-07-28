import '@/assets/tailwind.css';
import { Memory } from '@/backup/MemoryCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowUpRight as ArrowUpRightIcon, Brain as BrainIcon, X as XIcon } from 'lucide-react';
import { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'memories' | 'settings'>('memories');
  const [memories, setMemories] = useState<Memory[]>([
    {
      id: '1',
      content: '熟悉 TailwindCSS 和 Shadcn 技术',
      category: 'technology',
      createdAt: new Date(),
    },
    {
      id: '2',
      content: '正在考虑 React/Next 生态系统，因为其强大的海外使用和生态系统',
      category: 'technology',
      createdAt: new Date(),
    },
    {
      id: '3',
      content: '熟悉 TailwindCSS',
      category: 'technology',
      createdAt: new Date(),
    },
    {
      id: '4',
      content: '计划使用 React/Next 生态系统，因为其强大的海外使用和生态系统',
      category: 'technology',
      createdAt: new Date(),
    },
    {
      id: '5',
      content: '熟悉 Tailwind',
      category: 'technology',
      createdAt: new Date(),
    },
  ]);
  const [isVisible, setIsVisible] = useState(true);
  const [right, setRight] = useState(0);

  const handleClose = () => {
    setRight(-600);
  };

  const handleOpenDashboard = () => {
    // 发送消息给background打开仪表板
    browser.runtime.sendMessage({
      action: 'openDashboard',
      url: 'https://mem0.ai/dashboard',
    });
  };

  const copyMemory = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const viewMemory = (memory: Memory) => {
    console.log('查看记忆:', memory);
  };

  return (
    <div
      className="fixed top-15 right-12 w-100 h-auto max-h-[85vh] bg-primary text-white rounded-2xl shadow-lg z-[2147483647] overflow-hidden font-sans transition-[right] duration-300 ease-in-out"
      style={{ right: `${right}px` }}
    >
      {/* 头部 */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <BrainIcon className="w-6 h-6" />
          <h1 className="text-[20px] font-semibold">OpenMemory</h1>
        </div>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <XIcon className="w-5 h-5" />
        </button>
      </div>

      {/* 标签页导航 */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('memories')}
          className={cn(
            'flex-1 px-4 py-3 text-sm font-medium transition-colors relative',
            activeTab === 'memories'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-white',
          )}
        >
          Recent Memories
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={cn(
            'flex-1 px-4 py-3 text-sm font-medium transition-colors relative',
            activeTab === 'settings'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-white',
          )}
        >
          Settings
        </button>
      </div>

      {/* 内容区域 */}
      <div className="p-4">
        {activeTab === 'memories' ? (
          <div className="space-y-4">
            {/* 总数统计 */}
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Memories</p>
                  <p className="text-2xl font-semibold">{memories.length} Memories</p>
                </div>
                <Button onClick={handleOpenDashboard} size="sm">
                  Open Dashboard
                  <ArrowUpRightIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* 记忆列表 */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              <h3 className="text-lg font-medium">Recent Memories</h3>
              {/* {memories.map((memory) => (
                <MemoryCard
                  key={memory.id}
                  memory={memory}
                  onCopy={copyMemory}
                  onView={viewMemory}
                />
              ))} */}
            </div>
          </div>
        ) : (
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
                  <span className="text-sm font-medium">自动保存记忆</span>
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
        )}
      </div>

      {/* 底部 */}
      <div className="p-4 flex items-center justify-between">
        <div className="text-xs text-gray-400">Shortcut: ⌘ + M</div>
        <Button variant="secondary" size="sm">
          Logout
        </Button>
      </div>
    </div>
  );
}
