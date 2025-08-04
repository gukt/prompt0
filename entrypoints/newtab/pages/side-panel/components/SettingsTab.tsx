import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useImportExport } from '@/lib/hooks/useImportExport';
import { usePrompts } from '@/lib/store/promptStore';
import { ChevronDownIcon, DownloadIcon, UploadIcon } from 'lucide-react';
import { useState } from 'react';

interface SettingsTabProps {}

export function SettingsTab({}: SettingsTabProps) {
  // 使用新的状态管理和导入导出 Hook
  const { prompts, getStorageStats, clearAll } = usePrompts();
  const {
    showExportMenu,
    showImportMenu,
    setShowExportMenu,
    setShowImportMenu,
    fileInputRef,
    csvInputRef,
    exportToJSON,
    exportToHTML,
    exportToMarkdown,
    exportToCSV,
    handleJSONImport,
    handleCSVImport,
    triggerJSONImport,
    triggerCSVImport,
  } = useImportExport();

  // 本地设置状态
  const [autoComplete, setAutoComplete] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState('zh-CN');
  const [autoBackup, setAutoBackup] = useState(true);
  const [apiKey, setApiKey] = useState('');

  // 处理清空所有数据
  const handleClearAll = async () => {
    if (confirm('确定要清空所有提示词数据吗？此操作无法撤销。')) {
      try {
        await clearAll();
        alert('已清空所有数据');
      } catch (error) {
        console.error('清空失败:', error);
        alert('清空失败，请稍后重试');
      }
    }
  };

  const handleExportSettings = () => {
    const settings = {
      autoComplete,
      notifications,
      darkMode,
      language,
      autoBackup,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prompt-settings-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleResetSettings = () => {
    if (confirm('确定要重置所有设置吗？此操作无法撤销。')) {
      setAutoComplete(true);
      setNotifications(false);
      setDarkMode(true);
      setLanguage('zh-CN');
      setAutoBackup(true);
      setApiKey('');
    }
  };

  return (
    <div className="space-y-6">
      {/* 基本设置 */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-medium mb-4">基本设置</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">自动补全</div>
                <div className="text-sm text-muted-foreground">输入时自动显示提示词建议</div>
              </div>
              <Switch checked={autoComplete} onCheckedChange={setAutoComplete} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">通知提醒</div>
                <div className="text-sm text-muted-foreground">重要操作时显示通知</div>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">深色模式</div>
                <div className="text-sm text-muted-foreground">使用深色主题界面</div>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">自动备份</div>
                <div className="text-sm text-muted-foreground">定期自动备份提示词数据</div>
              </div>
              <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 数据管理 */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-medium mb-4">数据管理</h3>

          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">当前共有 {prompts.length} 个提示词</div>

            {/* 导出功能 */}
            <div className="relative">
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => setShowExportMenu(!showExportMenu)}
              >
                <div className="flex items-center gap-2">
                  <DownloadIcon className="w-4 h-4" />
                  导出数据
                </div>
                <ChevronDownIcon className="w-4 h-4" />
              </Button>

              {showExportMenu && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-10">
                  <button
                    onClick={exportToJSON}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors"
                  >
                    导出为 JSON
                  </button>
                  <button
                    onClick={exportToHTML}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors"
                  >
                    导出为 HTML
                  </button>
                  <button
                    onClick={exportToMarkdown}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors"
                  >
                    导出为 Markdown
                  </button>
                  <button
                    onClick={exportToCSV}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors"
                  >
                    导出为 CSV
                  </button>
                </div>
              )}
            </div>

            {/* 导入功能 */}
            <div className="relative">
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => setShowImportMenu(!showImportMenu)}
              >
                <div className="flex items-center gap-2">
                  <UploadIcon className="w-4 h-4" />
                  导入数据
                </div>
                <ChevronDownIcon className="w-4 h-4" />
              </Button>

              {showImportMenu && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-10">
                  <button
                    onClick={triggerJSONImport}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors"
                  >
                    从 JSON 导入
                  </button>
                  <button
                    onClick={triggerCSVImport}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors"
                  >
                    从 CSV 导入
                  </button>
                </div>
              )}
            </div>

            <Separator />

            {/* 危险操作 */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-destructive">危险操作</div>
              <Button
                variant="outline"
                className="w-full text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                onClick={handleClearAll}
              >
                清空所有数据
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 其他设置 */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-medium mb-4">其他设置</h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">语言设置</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="zh-CN">简体中文</option>
                <option value="en-US">English</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">API 密钥</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="输入您的 API 密钥"
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              />
            </div>

            <Separator />

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExportSettings} className="flex-1">
                导出设置
              </Button>
              <Button variant="outline" onClick={handleResetSettings} className="flex-1">
                重置设置
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleJSONImport(file);
          }
        }}
      />
      <input
        ref={csvInputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleCSVImport(file);
          }
        }}
      />

      {/* 点击外部关闭菜单 */}
      {(showExportMenu || showImportMenu) && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => {
            setShowExportMenu(false);
            setShowImportMenu(false);
          }}
        />
      )}
    </div>
  );
}
