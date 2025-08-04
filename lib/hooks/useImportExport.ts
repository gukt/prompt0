import { useCallback, useRef, useState } from 'react';
import { usePrompts } from '../store/promptStore';
import { Prompt } from '../types';

/**
 * 导入导出功能 Hook
 * 基于 React 19 最佳实践重构
 */
export function useImportExport() {
  const { prompts, importPrompts: importPromptsAction } = usePrompts();
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showImportMenu, setShowImportMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

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

**创建时间:** ${new Date(prompt.createdAt).toLocaleString('zh-CN')}${prompt.isPinned ? ' | 📌 已置顶' : ''}

---`,
  )
  .join('')}`;

    downloadFile(markdown, `prompts-${Date.now()}.md`, 'text/markdown');
    setShowExportMenu(false);
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
          `"${prompt.tags.join('; ')}"`,
          new Date(prompt.createdAt).toISOString(),
          prompt.isPinned ? '是' : '否',
        ].join(','),
      ),
    ].join('\n');

    // 添加 BOM 以支持中文显示
    const BOM = '\uFEFF';
    const content = BOM + csvContent;
    downloadFile(content, `prompts-${Date.now()}.csv`, 'text/csv;charset=utf-8');
    setShowExportMenu(false);
  }, [prompts, downloadFile]);

  // 处理 JSON 导入
  const handleJSONImport = useCallback(
    async (file: File) => {
      try {
        const text = await file.text();
        const data = JSON.parse(text);

        let importedPrompts: Prompt[] = [];

        // 支持不同的 JSON 格式
        if (Array.isArray(data)) {
          importedPrompts = data;
        } else if (data.prompts && Array.isArray(data.prompts)) {
          importedPrompts = data.prompts;
        } else {
          throw new Error('不支持的 JSON 格式');
        }

        // 验证数据格式
        if (importedPrompts.length === 0) {
          throw new Error('没有找到有效的提示词数据');
        }

        // 验证必需字段
        for (const prompt of importedPrompts) {
          if (!prompt.title || !prompt.content) {
            throw new Error('提示词数据格式不正确：缺少必需字段');
          }
        }

        await importPromptsAction(importedPrompts);
        setShowImportMenu(false);
        
        // 显示成功消息
        alert(`成功导入 ${importedPrompts.length} 个提示词`);
      } catch (error) {
        console.error('导入失败:', error);
        alert(`导入失败: ${error instanceof Error ? error.message : '未知错误'}`);
      }
    },
    [importPromptsAction],
  );

  // 处理 CSV 导入
  const handleCSVImport = useCallback(
    async (file: File) => {
      try {
        const text = await file.text();
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          throw new Error('CSV 文件格式不正确');
        }

        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const rows = lines.slice(1);

        const importedPrompts: Prompt[] = rows.map((row, index) => {
          const values = row.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
          
          if (values.length < headers.length) {
            throw new Error(`第 ${index + 2} 行数据格式不正确`);
          }

          const prompt: Prompt = {
            id: values[0] || Date.now().toString(),
            title: values[1] || `导入的提示词 ${index + 1}`,
            content: values[2]?.replace(/\\n/g, '\n') || '',
            tags: values[3] ? values[3].split(';').map(t => t.trim()) : [],
            createdAt: values[4] ? new Date(values[4]) : new Date(),
            isPinned: values[5] === '是',
          };

          return prompt;
        });

        await importPromptsAction(importedPrompts);
        setShowImportMenu(false);
        
        // 显示成功消息
        alert(`成功导入 ${importedPrompts.length} 个提示词`);
      } catch (error) {
        console.error('CSV 导入失败:', error);
        alert(`CSV 导入失败: ${error instanceof Error ? error.message : '未知错误'}`);
      }
    },
    [importPromptsAction],
  );

  // 触发文件选择
  const triggerJSONImport = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const triggerCSVImport = useCallback(() => {
    csvInputRef.current?.click();
  }, []);

  return {
    // 状态
    showExportMenu,
    showImportMenu,
    
    // 设置状态
    setShowExportMenu,
    setShowImportMenu,
    
    // 引用
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
}