import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Prompt } from '@/lib/types';
import { ChevronDownIcon, DownloadIcon, UploadIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { DashboardLayout } from '../components/layouts/DashboardLayout';

interface SettingsPageProps {
  prompts?: Prompt[];
  onImportPrompts?: (prompts: Prompt[]) => void;
  activeItem?: string;
  onItemChange?: (itemId: string) => void;
}

export function SettingsPage({
  prompts = [],
  onImportPrompts,
  activeItem = 'all',
  onItemChange = () => {},
}: SettingsPageProps) {
  const [autoComplete, setAutoComplete] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState('zh-CN');
  const [autoBackup, setAutoBackup] = useState(true);
  const [apiKey, setApiKey] = useState('');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showImportMenu, setShowImportMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

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

  // 导出工具函数
  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 导出为 JSON
  const exportToJSON = () => {
    const data = {
      prompts: prompts,
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };
    const content = JSON.stringify(data, null, 2);
    downloadFile(content, `prompts-${Date.now()}.json`, 'application/json');
    setShowExportMenu(false);
  };

  // 导出为 CSV
  const exportToCSV = () => {
    const headers = ['ID', '标题', '内容', '标签', '创建时间', '是否置顶'];
    const csvContent = [
      headers.join(','),
      ...prompts.map((prompt) =>
        [
          prompt.id,
          `"${prompt.title.replace(/"/g, '""')}"`,
          `"${prompt.content.replace(/"/g, '""').replace(/\n/g, '\\n')}"`,
          `"${prompt.tags.join('; ')}"`,
          new Date(prompt.createdAt).toISOString(),
          prompt.isPinned ? '是' : '否',
        ].join(','),
      ),
    ].join('\n');

    // 添加 BOM 以支持中文显示
    const bom = '\ufeff';
    downloadFile(bom + csvContent, `prompts-${Date.now()}.csv`, 'text/csv;charset=utf-8');
    setShowExportMenu(false);
  };

  // 下载 CSV 模板
  const downloadCSVTemplate = () => {
    const headers = ['ID', '标题', '内容', '标签', '创建时间', '是否置顶'];
    const template = [
      headers.join(','),
      'example-1,"示例提示词","这是一个示例提示词内容","AI; 写作",2024-01-01T00:00:00.000Z,否',
      'example-2,"另一个示例","另一个示例提示词的内容","编程; 技术",2024-01-01T00:00:00.000Z,是',
    ].join('\n');

    const bom = '\ufeff';
    downloadFile(bom + template, 'prompts-template.csv', 'text/csv;charset=utf-8');
    setShowImportMenu(false);
  };

  // 从 JSON 导入
  const importFromJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        let importedPrompts: Prompt[] = [];

        // 支持不同的 JSON 格式
        if (data.prompts && Array.isArray(data.prompts)) {
          importedPrompts = data.prompts;
        } else if (Array.isArray(data)) {
          importedPrompts = data;
        } else {
          throw new Error('不支持的 JSON 格式');
        }

        // 验证和转换数据
        const validPrompts = importedPrompts
          .filter((item) => item.title && item.content)
          .map((prompt) => ({
            ...prompt,
            id: prompt.id || `imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            tags: Array.isArray(prompt.tags) ? prompt.tags : [],
            createdAt: prompt.createdAt ? new Date(prompt.createdAt) : new Date(),
            updatedAt: new Date(),
            isPinned: Boolean(prompt.isPinned),
          }));

        if (validPrompts.length > 0 && onImportPrompts) {
          onImportPrompts(validPrompts);
          alert(`成功导入 ${validPrompts.length} 个提示词`);
        } else {
          alert('没有找到有效的提示词数据');
        }
      } catch (error) {
        console.error('导入失败:', error);
        alert('导入失败，请检查文件格式');
      }
    };
    reader.readAsText(file);

    // 重置文件输入
    event.target.value = '';
    setShowImportMenu(false);
  };

  // 从 CSV 导入
  const importFromCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const lines = content.split('\n').filter((line) => line.trim());

        if (lines.length < 2) {
          throw new Error('CSV 文件格式不正确');
        }

        // 跳过标题行
        const dataLines = lines.slice(1);

        const importedPrompts: Prompt[] = dataLines
          .map((line, index) => {
            const columns = line
              .split(',')
              .map((col) => col.replace(/^"|"$/g, '').replace(/""/g, '"'));

            if (columns.length < 3) {
              throw new Error(`第 ${index + 2} 行数据不完整`);
            }

            return {
              id: columns[0] || `csv-imported-${Date.now()}-${index}`,
              title: columns[1] || `导入的提示词 ${index + 1}`,
              content: columns[2].replace(/\\n/g, '\n'),
              tags: columns[3]
                ? columns[3]
                    .split(';')
                    .map((tag) => tag.trim())
                    .filter(Boolean)
                : [],
              createdAt: columns[4] ? new Date(columns[4]) : new Date(),
              updatedAt: new Date(),
              isPinned: columns[5] === '是',
            };
          })
          .filter((prompt) => prompt.title && prompt.content);

        if (importedPrompts.length > 0 && onImportPrompts) {
          onImportPrompts(importedPrompts);
          alert(`成功导入 ${importedPrompts.length} 个提示词`);
        } else {
          alert('没有找到有效的提示词数据');
        }
      } catch (error) {
        console.error('CSV 导入失败:', error);
        alert('CSV 导入失败，请检查文件格式');
      }
    };
    reader.readAsText(file);

    // 重置文件输入
    event.target.value = '';
    setShowImportMenu(false);
  };

  return (
    <DashboardLayout activeItem={activeItem} onItemChange={onItemChange}>
      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={importFromJSON}
        style={{ display: 'none' }}
      />
      <input
        ref={csvInputRef}
        type="file"
        accept=".csv"
        onChange={importFromCSV}
        style={{ display: 'none' }}
      />

      {/* Content */}
      <section className="flex-1 p-6 overflow-y-auto space-y-8">
        {/* 基本设置 */}
        <section className="space-y-4">
          <div>
            <h2 className="text-[20px] leading-[25px] font-semibold ">Basic</h2>
            <p className="text-sm text-muted-foreground">Manage your basic preferences</p>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Auto Complete</div>
                <p className="text-sm text-muted-foreground">Enable auto-complete feature</p>
              </div>
              <Switch
                checked={autoComplete}
                onCheckedChange={(checked) => setAutoComplete(checked)}
              />
            </div>

            <Separator className="my-2" />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Notifications</div>
                <p className="text-sm text-muted-foreground">
                  Receive updates and important notifications
                </p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={(checked) => setNotifications(checked)}
              />
            </div>

            <Separator className="my-2" />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Dark Mode</div>
                <p className="text-sm text-muted-foreground">Enable dark mode</p>
              </div>
              <Switch checked={darkMode} onCheckedChange={(checked) => setDarkMode(checked)} />
            </div>

            <Separator className="my-2" />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Language</div>
                <p className="text-sm text-muted-foreground">Select the interface language</p>
              </div>
            </div>
          </div>
        </section>

        {/* 数据管理 */}
        <section className="space-y-4">
          <div>
            <h2 className="text-[20px] leading-[25px] font-semibold ">Data</h2>
            <p className="text-sm text-muted-foreground">Manage your prompt data</p>
          </div>
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">自动备份</div>
                  <p className="text-sm text-muted-foreground">定期自动备份您的提示词数据</p>
                </div>
                <Switch
                  checked={autoBackup}
                  onCheckedChange={(checked) => setAutoBackup(checked)}
                />
              </div>

              <div className="border-t border-border my-4"></div>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  {/* 导出菜单 */}
                  <div className="relative">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowExportMenu(!showExportMenu);
                        setShowImportMenu(false);
                      }}
                    >
                      <DownloadIcon />
                      Export
                      <ChevronDownIcon />
                    </Button>
                    {showExportMenu && (
                      <div className="absolute left-0 mt-1 min-w-48 w-max bg-popover border border-border rounded-md shadow-lg z-50">
                        <div className="py-1">
                          <button
                            onClick={exportToJSON}
                            className="block w-full text-left px-4 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground whitespace-nowrap"
                          >
                            Export as JSON
                          </button>
                          <button
                            onClick={exportToCSV}
                            className="block w-full text-left px-4 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground whitespace-nowrap"
                          >
                            Export as CSV
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 导入菜单 */}
                  <div className="relative">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowImportMenu(!showImportMenu);
                        setShowExportMenu(false);
                      }}
                    >
                      <UploadIcon />
                      Import
                      <ChevronDownIcon />
                    </Button>
                    {showImportMenu && (
                      <div className="absolute left-0 mt-1 min-w-48 w-max bg-popover border border-border rounded-md shadow-lg z-50">
                        <div className="py-1">
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="block w-full text-left px-4 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground whitespace-nowrap"
                          >
                            Import from JSON
                          </button>
                          <button
                            onClick={() => csvInputRef.current?.click()}
                            className="block w-full text-left px-4 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground whitespace-nowrap"
                          >
                            Import from CSV
                          </button>
                          <button
                            onClick={downloadCSVTemplate}
                            className="block w-full text-left px-4 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground whitespace-nowrap"
                          >
                            Download CSV Template
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 快捷键 */}
        <section className="space-y-4">
          <div>
            <h2 className="text-[20px] leading-[25px] font-semibold ">Keyboard Shortcuts</h2>
            <p className="text-sm text-muted-foreground">View and manage keyboard shortcuts</p>
          </div>
          <Card>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-sm">Open Prompt Panel</span>
                <div className="px-2 py-1 bg-muted rounded text-xs font-mono">
                  ⌘ + M (or Ctrl + M)
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between items-center">
                <span className="text-sm">Quick Search</span>
                <div className="px-2 py-1 bg-muted rounded text-xs font-mono">
                  ⌘ + K (or Ctrl + K)
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 关于 */}
        <section className="space-y-4">
          <div>
            <h2 className="text-[20px] leading-[25px] font-semibold ">About</h2>
            <p className="text-sm text-muted-foreground">Application information</p>
          </div>
          <Card>
            <CardContent>
              <div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">版本</span>
                  <span className="text-sm">1.0.0</span>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">作者</span>
                  <span className="text-sm">Gu Kaitong</span>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">联系邮箱</span>
                  <span className="text-sm">gukaitong@gmail.com</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </section>
    </DashboardLayout>
  );
}
