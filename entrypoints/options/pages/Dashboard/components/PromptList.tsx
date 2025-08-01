import { Button } from '@/components/ui/button';
import { Prompt } from '@/lib/types';
import { DownloadIcon, PlusIcon, UploadIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import PromptCard from '../../../components/PromptCard';
import { useImportExport } from '../hooks/useImportExport';
import { usePromptFilter } from '../hooks/usePromptFilter';

interface PromptListProps {
  activeItem: string;
  prompts: Prompt[];
  onEditPrompt: (prompt: Prompt) => void;
  onDeletePrompt: (promptId: string) => void;
  onAddPrompt: () => void;
  onImportPrompts: (prompts: Prompt[]) => void;
}

export function PromptList({
  activeItem,
  prompts,
  onEditPrompt,
  onDeletePrompt,
  onAddPrompt,
  onImportPrompts,
}: PromptListProps) {
  const { filteredPrompts } = usePromptFilter(prompts, activeItem);

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
  } = useImportExport(filteredPrompts, onImportPrompts);

  const exportMenuRef = useRef<HTMLDivElement>(null);
  const importMenuRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
      if (importMenuRef.current && !importMenuRef.current.contains(event.target as Node)) {
        setShowImportMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setShowExportMenu, setShowImportMenu]);

  const handleTogglePin = (promptId: string) => {
    // TODO: Implement toggle pin functionality
    console.log('Toggle pin for prompt:', promptId);
  };

  return (
    <div className="px-6">
      {/* 头部操作栏 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">
            {activeItem === 'all' && 'All Prompts'}
            {activeItem === 'frequent' && 'Frequent Prompts'}
            {activeItem !== 'all' && activeItem !== 'frequent' && `${activeItem} Prompts`}
          </h1>
          <span className="text-sm text-muted-foreground">({filteredPrompts.length})</span>
        </div>

        <div className="flex items-center gap-2">
          {/* 导入按钮 */}
          <div className="relative" ref={importMenuRef}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowImportMenu(!showImportMenu)}
              className="flex items-center gap-2"
            >
              <UploadIcon className="w-4 h-4" />
              导入
            </Button>
            {showImportMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-background border rounded-md shadow-md z-50">
                <div className="py-1">
                  <button
                    onClick={triggerJSONImport}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors"
                  >
                    导入 JSON 文件
                  </button>
                  <button
                    onClick={triggerCSVImport}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors"
                  >
                    导入 CSV 文件
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 导出按钮 */}
          <div className="relative" ref={exportMenuRef}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2"
            >
              <DownloadIcon className="w-4 h-4" />
              导出
            </Button>
            {showExportMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-background border rounded-md shadow-md z-50">
                <div className="py-1">
                  <button
                    onClick={exportToJSON}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors"
                  >
                    导出为 JSON
                  </button>
                  <button
                    onClick={exportToHTML}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors"
                  >
                    导出为 HTML
                  </button>
                  <button
                    onClick={exportToMarkdown}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors"
                  >
                    导出为 Markdown
                  </button>
                  <button
                    onClick={exportToCSV}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors"
                  >
                    导出为 CSV
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 添加提示词按钮 */}
          <Button onClick={onAddPrompt} size="sm" className="flex items-center gap-2">
            <PlusIcon className="w-4 h-4" />
            添加提示词
          </Button>
        </div>
      </div>

      {/* 提示词列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {filteredPrompts.map((prompt) => (
          <PromptCard
            key={prompt.id}
            prompt={prompt}
            onEdit={() => onEditPrompt(prompt)}
            onDelete={() => onDeletePrompt(prompt.id)}
            onTogglePin={() => handleTogglePin(prompt.id)}
            onCopy={() => navigator.clipboard.writeText(prompt.content)}
          />
        ))}
      </div>

      {/* 空状态 */}
      {filteredPrompts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            {activeItem === 'all' ? '还没有提示词' : `没有找到相关的提示词`}
          </div>
          <Button onClick={onAddPrompt} className="flex items-center gap-2">
            <PlusIcon className="w-4 h-4" />
            创建第一个提示词
          </Button>
        </div>
      )}

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
    </div>
  );
}
