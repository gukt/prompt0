import { Button } from '@/components/ui/button';
import { usePrompts } from '@/lib/store/promptStore';
import { Prompt } from '@/lib/types';
import { ChevronDownIcon, UploadIcon } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

interface ImportButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function ImportButton({
  className = '',
  variant = 'outline',
  size = 'default',
}: ImportButtonProps) {
  const { importPrompts: importPromptsAction } = usePrompts();
  const [showMenu, setShowMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

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
        setShowMenu(false);

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
        const lines = text.split('\n').filter((line) => line.trim());

        if (lines.length < 2) {
          throw new Error('CSV 文件格式不正确');
        }

        const headers = lines[0].split(',').map((h) => h.trim().replace(/"/g, ''));
        const rows = lines.slice(1);

        const importedPrompts: Prompt[] = rows.map((row, index) => {
          const values = row.split(',').map((v) => v.trim().replace(/^"|"$/g, ''));

          if (values.length < headers.length) {
            throw new Error(`第 ${index + 2} 行数据格式不正确`);
          }

          const prompt: Prompt = {
            id: values[0] || Date.now().toString(),
            title: values[1] || `导入的提示词 ${index + 1}`,
            content: values[2]?.replace(/\\n/g, '\n') || '',
            tags: values[3] ? values[3].split(';').map((t) => t.trim()) : [],
            createdAt: values[4] ? new Date(values[4]) : new Date(),
            isPinned: values[5] === '是',
          };

          return prompt;
        });

        await importPromptsAction(importedPrompts);
        setShowMenu(false);

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

  return (
    <div className="relative">
      <Button
        variant={variant}
        size={size}
        className={`justify-between ${className}`}
        onClick={() => setShowMenu(!showMenu)}
      >
        <div className="flex items-center gap-2">
          <UploadIcon className="w-4 h-4" />
          导入
        </div>
        <ChevronDownIcon className="w-4 h-4" />
      </Button>

      {showMenu && (
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
      {showMenu && <div className="fixed inset-0 z-0" onClick={() => setShowMenu(false)} />}
    </div>
  );
}
