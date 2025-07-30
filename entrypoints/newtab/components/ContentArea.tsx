import { Button } from '@/components/ui/button';
import { Prompt } from '@/lib/types';
import { PlusIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import PromptCard from './PromptCard';

interface ContentAreaProps {
  activeItem: string;
  prompts: Prompt[];
  searchQuery: string;
  sidebarVisible: boolean;
  onEditPrompt: (prompt: Prompt) => void;
  onDeletePrompt: (promptId: string) => void;
  onAddPrompt: () => void;
  onToggleSidebar: () => void;
  onImportPrompts: (prompts: Prompt[]) => void;
}

export function ContentArea({
  activeItem,
  prompts,
  searchQuery,
  onEditPrompt,
  onDeletePrompt,
  onAddPrompt,
  onImportPrompts,
}: ContentAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showImportMenu, setShowImportMenu] = useState(false);
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
  }, []);

  // 根据当前选中的菜单项过滤提示词
  const getFilteredPrompts = () => {
    let filtered = prompts;

    // 根据菜单项过滤
    switch (activeItem) {
      case 'frequent':
        filtered = prompts.filter((p) => p.isPinned);
        break;
      case 'all':
        filtered = prompts;
        break;
      default:
        // 按分类过滤
        filtered = prompts.filter((p) =>
          p.tags.some((tag) => tag.toLowerCase().includes(activeItem.toLowerCase())),
        );
    }

    // 根据搜索关键词过滤
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      );
    }

    return filtered;
  };

  const filteredPrompts = getFilteredPrompts();

  const getTitle = () => {
    switch (activeItem) {
      case 'frequent':
        return 'Frequent Prompts';
      case 'all':
        return 'All Prompts';
      default:
        return `${activeItem} Prompts`;
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    // TODO: Add toast notification
  };

  const handleTogglePin = (promptId: string) => {
    // TODO: Implement toggle pin functionality
    console.log('Toggle pin for prompt:', promptId);
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
      prompts: filteredPrompts,
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };
    const content = JSON.stringify(data, null, 2);
    downloadFile(content, `prompts-${Date.now()}.json`, 'application/json');
    setShowExportMenu(false);
  };

  // 导出为 HTML
  const exportToHTML = () => {
    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prompts Export</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 40px; }
        .prompt { border: 1px solid #e1e5e9; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
        .title { font-size: 18px; font-weight: 600; margin-bottom: 10px; }
        .content { background: #f6f8fa; padding: 15px; border-radius: 6px; margin: 10px 0; }
        .tags { margin-top: 10px; }
        .tag { background: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-right: 8px; }
        .meta { color: #6b7280; font-size: 14px; margin-top: 10px; }
    </style>
</head>
<body>
    <h1>Prompts 导出</h1>
    <p>导出时间: ${new Date().toLocaleString('zh-CN')}</p>
    <p>共 ${filteredPrompts.length} 个提示词</p>
    
    ${filteredPrompts
      .map(
        (prompt) => `
    <div class="prompt">
        <div class="title">${prompt.title}</div>
        <div class="content">${prompt.content.replace(/\n/g, '<br>')}</div>
        <div class="tags">
            ${prompt.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <div class="meta">
            创建时间: ${new Date(prompt.createdAt).toLocaleString('zh-CN')}
            ${prompt.isPinned ? ' | 📌 已置顶' : ''}
        </div>
    </div>`,
      )
      .join('')}
</body>
</html>`;
    downloadFile(html, `prompts-${Date.now()}.html`, 'text/html');
    setShowExportMenu(false);
  };

  // 导出为 Markdown
  const exportToMarkdown = () => {
    const markdown = `# Prompts 导出

导出时间: ${new Date().toLocaleString('zh-CN')}
共 ${filteredPrompts.length} 个提示词

---

${filteredPrompts
  .map(
    (prompt) => `
## ${prompt.title}

${prompt.content}

**标签:** ${prompt.tags.join(', ')}

**创建时间:** ${new Date(prompt.createdAt).toLocaleString('zh-CN')}${
      prompt.isPinned ? ' | 📌 已置顶' : ''
    }

---
`,
  )
  .join('')}`;
    downloadFile(markdown, `prompts-${Date.now()}.md`, 'text/markdown');
    setShowExportMenu(false);
  };

  // 导出为 CSV
  const exportToCSV = () => {
    const headers = ['ID', '标题', '内容', '标签', '创建时间', '是否置顶'];
    const csvContent = [
      headers.join(','),
      ...filteredPrompts.map((prompt) =>
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
    const headers = ['ID', '标题', '内容', '标签', '创建时间', '是否置顶', '是否收藏'];
    const template = [
      headers.join(','),
      'example-1,"示例提示词","这是一个示例提示词内容","AI; 写作",2024-01-01T00:00:00.000Z,否,是',
      'example-2,"另一个示例","另一个示例提示词的内容","编程; 技术",2024-01-01T00:00:00.000Z,是,否',
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

        if (validPrompts.length > 0) {
          onImportPrompts(validPrompts);
          // TODO: 显示成功提示
          console.log(`成功导入 ${validPrompts.length} 个提示词`);
        } else {
          // TODO: 显示错误提示
          console.error('没有找到有效的提示词数据');
        }
      } catch (error) {
        console.error('导入失败:', error);
        // TODO: 显示错误提示
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
              isFavorite: columns[6] === '是',
            };
          })
          .filter((prompt) => prompt.title && prompt.content);

        if (importedPrompts.length > 0) {
          onImportPrompts(importedPrompts);
          console.log(`成功导入 ${importedPrompts.length} 个提示词`);
        } else {
          console.error('没有找到有效的提示词数据');
        }
      } catch (error) {
        console.error('CSV 导入失败:', error);
      }
    };
    reader.readAsText(file);

    // 重置文件输入
    event.target.value = '';
    setShowImportMenu(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full">
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

      {/* Header */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* 标题 */}
          <h1 className="text-xl font-semibold text-foreground">{getTitle()}</h1>

          {/* 操作按钮组 */}
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onAddPrompt} size="sm">
              <PlusIcon />
              Add Prompt
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {filteredPrompts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <PlusIcon className="w-6 h-6" />
            </div>
            <p className="text-lg font-medium">No prompts found</p>
            <p className="text-sm mb-4">
              {searchQuery
                ? 'Try adjusting your search terms'
                : 'Create your first prompt to get started'}
            </p>
            {!searchQuery && (
              <Button onClick={onAddPrompt} size="sm">
                <PlusIcon className="w-4 h-4" /> Add Prompt
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredPrompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                onCopy={handleCopy}
                onEdit={onEditPrompt}
                onDelete={onDeletePrompt}
                onTogglePin={handleTogglePin}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
