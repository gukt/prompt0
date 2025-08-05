import '@/assets/tailwind.css';
import { Button } from '@/components/ui/button';
import { Prompt } from '@/lib/types';
import { cn } from '@/lib/utils';
import { PromptProvider } from '@/stores/prompt';
import { BrainIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { PromptsTab } from './PromptsTab';
import { SettingsTab } from './SettingsTab';

function SidePanelContent() {
  const [activeTab, setActiveTab] = useState<'prompts' | 'settings'>('prompts');
  const [isVisible, setIsVisible] = useState(true);
  const [right, setRight] = useState(0);

  // 使用应用初始化 Hook
  const { initialized, loading } = useApp();

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

  const copyPrompt = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const viewPrompt = (prompt: Prompt) => {
    console.log('查看提示词:', prompt);
  };

  return (
    <div
      className="flex flex-col fixed top-15 text-base w-120 h-[85vh] max-h-[85vh] rounded-2xl border shadow-lg z-[2147483647] overflow-hidden font-sans transition-[right] duration-300 ease-in-out"
      style={{ right: `${right}px` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <BrainIcon className="w-6 h-6" />
          <h1 className="text-[20px] font-semibold">OpenPrompt</h1>
        </div>
        <button
          onClick={handleClose}
          className="text-primary/50 hover:text-primary transition-colors cursor-pointer"
        >
          <XIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="px-4 flex border-b">
        <button
          onClick={() => setActiveTab('prompts')}
          className={cn(
            'flex-1 px-4 py-3 text-sm font-medium transition-colors relative cursor-pointer',
            activeTab === 'prompts'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-white',
          )}
        >
          Recents
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={cn(
            'flex-1 px-4 py-3 text-sm font-medium transition-colors relative cursor-pointer',
            activeTab === 'settings'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-white',
          )}
        >
          Settings
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 overflow-y-auto">
        {!initialized && loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">正在加载...</div>
          </div>
        ) : activeTab === 'prompts' ? (
          <PromptsTab
            onOpenDashboard={handleOpenDashboard}
            onCopyPrompt={copyPrompt}
            onViewPrompt={viewPrompt}
          />
        ) : (
          <SettingsTab />
        )}
      </div>

      {/* Footer */}
      <div className="p-4 flex items-center justify-between">
        <Button variant="outline" size="sm" className="text-primary/50">
          Shortcut: ^ + M
        </Button>
        <Button variant="outline" size="sm">
          Logout
        </Button>
      </div>
    </div>
  );
}

// 主组件包装 Provider
export default function App() {
  return (
    <PromptProvider>
      <SidePanelContent />
    </PromptProvider>
  );
}
