// components/VariableTextarea.tsx
import { cn } from '@/lib/utils';
import React, { useCallback, useEffect, useRef, useState } from 'react';

interface VariableTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function VariableTextarea({
  value,
  onChange,
  placeholder,
  className,
}: VariableTextareaProps) {
  const editableRef = useRef<HTMLDivElement>(null);
  const [isComposing, setIsComposing] = useState(false);
  const lastValueRef = useRef(value);

  // 处理输入变化
  const handleInput = useCallback(() => {
    if (isComposing || !editableRef.current) return;

    // 使用 innerText 代替 textContent 以保留换行符
    const newText = editableRef.current.innerText || '';
    if (newText !== value) {
      onChange(newText);
    }
  }, [value, onChange, isComposing]);

  // 处理组合输入（中文输入法等）
  const handleCompositionStart = () => setIsComposing(true);
  const handleCompositionEnd = () => {
    setIsComposing(false);
    handleInput();
  };

  // 处理粘贴事件，确保粘贴的是纯文本
  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData?.getData('text/plain') || '';
    document.execCommand('insertText', false, text);
  }, []);

  // 高亮变量，但只在值真正改变且包含完整变量时执行
  useEffect(() => {
    if (!editableRef.current || isComposing || value === lastValueRef.current) return;

    const hasCompleteVariable = /\{\{[^}]+\}\}/.test(value);
    if (!hasCompleteVariable) {
      // 如果没有完整的变量，只需要更新 innerText
      if (editableRef.current.innerText !== value) {
        editableRef.current.innerText = value;
      }
      lastValueRef.current = value;
      return;
    }

    // 保存当前选区
    const selection = window.getSelection();
    const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
    const isInEditor = range && editableRef.current.contains(range.startContainer);

    let offset = 0;
    if (isInEditor && range) {
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(editableRef.current);
      preCaretRange.setEnd(range.startContainer, range.startOffset);
      offset = preCaretRange.toString().length;
    }

    // 处理变量高亮
    const parts: string[] = [];
    let lastIndex = 0;

    // 修改正则表达式以更精确地匹配变量
    const regex = /\{\{([^}\n]+)\}\}/g;
    let match;

    while ((match = regex.exec(value)) !== null) {
      // 添加变量前的文本（包括换行符）
      const beforeText = value.slice(lastIndex, match.index);
      if (beforeText) {
        parts.push(beforeText);
      }

      // 只有当变量内容不为空时才添加高亮
      if (match[1].trim()) {
        parts.push(
          `<span class="bg-blue-100 text-blue-800 px-1 py-0.5 rounded text-sm font-mono border border-blue-200">${match[0]}</span>`,
        );
      } else {
        // 如果变量内容为空，直接添加原文本
        parts.push(match[0]);
      }

      lastIndex = match.index + match[0].length;
    }

    // 添加剩余的文本
    if (lastIndex < value.length) {
      parts.push(value.slice(lastIndex));
    }

    // 更新内容
    const newHtml = parts.join('').replace(/\n/g, '<br>');
    if (editableRef.current.innerHTML !== newHtml) {
      editableRef.current.innerHTML = newHtml;
    }
    lastValueRef.current = value;

    // 恢复光标位置
    if (isInEditor) {
      requestAnimationFrame(() => {
        try {
          const selection = window.getSelection();
          if (!selection || !editableRef.current) return;

          const walker = document.createTreeWalker(editableRef.current, NodeFilter.SHOW_TEXT, null);
          let currentOffset = 0;
          let node = walker.nextNode();

          while (node) {
            const length = node.textContent?.length || 0;
            if (currentOffset + length >= offset) {
              const range = document.createRange();
              range.setStart(node, offset - currentOffset);
              range.collapse(true);
              selection.removeAllRanges();
              selection.addRange(range);
              break;
            }
            currentOffset += length;
            node = walker.nextNode();
          }
        } catch (error) {
          console.error('Failed to restore cursor position:', error);
        }
      });
    }
  }, [value, isComposing]);

  return (
    <div
      ref={editableRef}
      contentEditable
      className={cn(
        'min-h-[300px] resize-none p-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
        'whitespace-pre-wrap break-words',
        'prose prose-sm max-w-none',
        className,
      )}
      onInput={handleInput}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      onPaste={handlePaste as any}
      suppressContentEditableWarning
    />
  );
}
