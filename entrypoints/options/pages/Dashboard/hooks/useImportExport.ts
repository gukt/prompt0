import { Prompt } from '@/lib/types';
import { useCallback, useRef, useState } from 'react';

export const useImportExport = (
  prompts: Prompt[],
  onImportPrompts: (prompts: Prompt[]) => void
) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showImportMenu, setShowImportMenu] = useState(false);

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
    setShowExportMenu(false);
  }, [prompts, downloadFile]);

  // 导出为 HTML
  const exportToHTML = useCallback(() => {
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
    <p>共 ${prompts.length} 个提示词</p>
    
    ${prompts
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
  }, [prompts, downloadFile]);

  // 导出为 CSV
  const exportToCSV = useCallback(() => {
    const headers = ['标题', '内容', '标签', '创建时间', '更新时间', '是否置顶'];
    const csvContent = [
      headers.join(','),
      ...prompts.map((prompt) =>
        [
          `"${prompt.title.replace(/"/g, '""')}"`,
          `"${prompt.content.replace(/"/g, '""')}"`,
          `"${prompt.tags.join('; ')}"`,
          `"${new Date(prompt.createdAt).toLocaleString('zh-CN')}"`,
          `"${prompt.updatedAt ? new Date(prompt.updatedAt).toLocaleString('zh-CN') : ''}"`,
          prompt.isPinned ? '是' : '否',
        ].join(','),
      ),
    ].join('\n');

    // 添加 BOM 以支持中文显示
    const BOM = '\uFEFF';
    downloadFile(BOM + csvContent, `prompts-${Date.now()}.csv`, 'text/csv');
    setShowExportMenu(false);
  }, [prompts, downloadFile]);

  // 处理 JSON 文件导入
  const handleJSONImport = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        if (data.prompts && Array.isArray(data.prompts)) {
          const importedPrompts = data.prompts.map((prompt: any) => ({
            ...prompt,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            createdAt: new Date(prompt.createdAt),
            updatedAt: prompt.updatedAt ? new Date(prompt.updatedAt) : undefined,
          }));
          onImportPrompts(importedPrompts);
        }
      } catch (error) {
        console.error('导入 JSON 文件失败:', error);
        alert('导入失败：文件格式不正确');
      }
    };
    reader.readAsText(file);
  }, [onImportPrompts]);

  // 处理 CSV 文件导入
  const handleCSVImport = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const lines = content.split('\n').filter(line => line.trim());
        
        if (lines.length <= 1) return;
        
        const importedPrompts = lines.slice(1).map((line, index) => {
          const values = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || [];
          const cleanValues = values.map(v => v.replace(/^"|"$/g, '').replace(/""/g, '"'));
          
          return {
            id: Date.now().toString() + index,
            title: cleanValues[0] || '未命名提示词',
            content: cleanValues[1] || '',
            tags: cleanValues[2] ? cleanValues[2].split('; ').filter(Boolean) : [],
            createdAt: new Date(),
            isPinned: cleanValues[5] === '是',
          };
        });
        
        onImportPrompts(importedPrompts);
      } catch (error) {
        console.error('导入 CSV 文件失败:', error);
        alert('导入失败：文件格式不正确');
      }
    };
    reader.readAsText(file);
  }, [onImportPrompts]);

  // 触发文件选择
  const triggerJSONImport = useCallback(() => {
    fileInputRef.current?.click();
    setShowImportMenu(false);
  }, []);

  const triggerCSVImport = useCallback(() => {
    csvInputRef.current?.click();
    setShowImportMenu(false);
  }, []);

  return {
    // 状态
    showExportMenu,
    showImportMenu,
    
    // 设置状态的方法
    setShowExportMenu,
    setShowImportMenu,
    
    // Refs
    fileInputRef,
    csvInputRef,
    
    // 导出方法
    exportToJSON,
    exportToHTML,
    exportToMarkdown,
    exportToCSV,
    
    // 导入方法
    handleJSONImport,
    handleCSVImport,
    triggerJSONImport,
    triggerCSVImport,
  };
}; 