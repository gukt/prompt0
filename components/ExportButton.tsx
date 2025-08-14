import { Button } from '@/components/ui/button';
import { usePromptStore } from '@/stores/promptStore';
import { ChevronDownIcon, DownloadIcon } from 'lucide-react';
import { useCallback, useState } from 'react';

interface ExportButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function ExportButton({
  className = '',
  variant = 'outline',
  size = 'default',
}: ExportButtonProps) {
  const { prompts } = usePromptStore();
  const [showMenu, setShowMenu] = useState(false);

  // 下载文件工具函数
  const downloadFile = useCallback((content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  // 导出为 JSON
  const exportToJSON = useCallback(() => {
    const data = {
      prompts,
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };
    const content = JSON.stringify(data, null, 2);
    downloadFile(content, `prompts-${Date.now()}.json`, 'application/json');
    setShowMenu(false);
  }, [prompts, downloadFile]);

  // 导出为 HTML
  const exportToHTML = useCallback(() => {
    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prompts 导出</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 40px; }
        .prompt { border: 1px solid #e1e5e9; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
        .title { font-size: 18px; font-weight: 600; margin-bottom: 10px; }
        .content { background: #f6f8fa; padding: 15px; border-radius: 6px; margin: 10px 0; white-space: pre-wrap; }
        .tags { margin-top: 10px; }
        .tag { background: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-right: 8px; }
        .meta { color: #6b7280; font-size: 14px; margin-top: 10px; }
    </style>
</head>
<body>
    <h1>Prompts 导出</h1>
    <p>导出时间: ${new Date().toLocaleString('zh-CN')}</p>
    <p>共 ${prompts.length} 个提示词</p>
    
    ${prompts
      .map(
        (prompt) => `
    <div class="prompt">
        <div class="title">${prompt.title}</div>
        <div class="content">${prompt.content}</div>
    </div>`,
      )
      .join('')}
</body>
</html>`;
    downloadFile(html, `prompts-${Date.now()}.html`, 'text/html');
    setShowMenu(false);
  }, [prompts, downloadFile]);

  // 导出为 Markdown
  const exportToMarkdown = useCallback(() => {
    const markdown = `# Prompts 导出

导出时间: ${new Date().toLocaleString('zh-CN')}
共 ${prompts.length} 个提示词

---

${prompts
  .map(
    (prompt) => `
## ${prompt.title}

${prompt.content}

**创建时间:** ${new Date(prompt.createdAt).toLocaleString('zh-CN')}

---`,
  )
  .join('')}`;

    downloadFile(markdown, `prompts-${Date.now()}.md`, 'text/markdown');
    setShowMenu(false);
  }, [prompts, downloadFile]);

  // 导出为 CSV
  const exportToCSV = useCallback(() => {
    const headers = ['ID', '标题', '内容', '标签', '创建时间', '是否置顶'];
    const csvContent = [
      headers.join(','),
      ...prompts.map((prompt) =>
        [
          prompt.id,
          `"${prompt.title.replace(/"/g, '""')}"`,
          `"${prompt.content.replace(/"/g, '""').replace(/\n/g, '\\n')}"`,
          new Date(prompt.createdAt).toISOString(),
        ].join(','),
      ),
    ].join('\n');

    // 添加 BOM 以支持中文显示
    const BOM = '\uFEFF';
    const content = BOM + csvContent;
    downloadFile(content, `prompts-${Date.now()}.csv`, 'text/csv;charset=utf-8');
    setShowMenu(false);
  }, [prompts, downloadFile]);

  return (
    <div className="relative">
      <Button
        variant={variant}
        size={size}
        className={`justify-between ${className}`}
        onClick={() => setShowMenu(!showMenu)}
      >
        <div className="flex items-center gap-2">
          <DownloadIcon className="w-4 h-4" />
          导出
        </div>
        <ChevronDownIcon className="w-4 h-4" />
      </Button>

      {showMenu && (
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

      {/* 点击外部关闭菜单 */}
      {showMenu && <div className="fixed inset-0 z-0" onClick={() => setShowMenu(false)} />}
    </div>
  );
}
