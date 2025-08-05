import '@/assets/tailwind.css';
import SidePanel from '@/components/sidePanel/SidePanel';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { mockPrompts } from '@/lib/mock-data';
import { Prompt } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI assistant. How can I help you today?",
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Prompt 搜索相关状态
  const [showPromptDropdown, setShowPromptDropdown] = useState(false);
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);
  const [selectedPromptIndex, setSelectedPromptIndex] = useState(0);
  const [atPosition, setAtPosition] = useState(-1);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [dropdownSide, setDropdownSide] = useState<'top' | 'bottom'>('bottom');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 搜索 prompts
  const searchPrompts = (query: string) => {
    if (!query) {
      return mockPrompts.slice(0, 8); // 显示前 8 个
    }

    return mockPrompts
      .filter(
        (prompt) =>
          prompt.title.toLowerCase().includes(query.toLowerCase()) ||
          prompt.content.toLowerCase().includes(query.toLowerCase()) ||
          prompt.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase())),
      )
      .slice(0, 8);
  };

  // 计算下拉框位置
  const calculateDropdownPosition = () => {
    if (!textareaRef.current || atPosition === -1) return;

    const textarea = textareaRef.current;
    const textBeforeAt = inputValue.substring(0, atPosition);

    // 创建一个临时元素来测量文本宽度和高度
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return;

    const computedStyle = window.getComputedStyle(textarea);
    context.font = `${computedStyle.fontSize} ${computedStyle.fontFamily}`;

    const textareaPadding = parseInt(computedStyle.paddingLeft) || 12;
    const lineHeight = parseInt(computedStyle.lineHeight) || 24;

    // 计算 @ 符号的精确位置
    const lines = textBeforeAt.split('\n');
    const currentLineText = lines[lines.length - 1];
    const currentLineWidth = context.measureText(currentLineText).width;
    const lineNumber = lines.length - 1;

    // @ 符号的左侧位置 (相对于 textarea)
    const atLeft = textareaPadding + currentLineWidth;
    // @ 符号的垂直位置 (相对于 textarea)
    const atTop = textareaPadding + lineNumber * lineHeight;

    // 判断是否有足够的空间在下方显示
    const textareaRect = textarea.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - (textareaRect.top + atTop + lineHeight);
    const spaceAbove = textareaRect.top + atTop;
    const dropdownHeight = Math.min(filteredPrompts.length * 36 + 16, 300); // 估算下拉框高度 (36px per item + padding)

    const side = spaceBelow < dropdownHeight && spaceAbove > dropdownHeight ? 'top' : 'bottom';

    setDropdownPosition({ left: atLeft, top: atTop });
    setDropdownSide(side);
  };

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart;

    setInputValue(value);

    // 检查是否输入了 @
    const textBeforeCursor = value.substring(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');

    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);

      // 添加调试信息
      console.log('@ 位置:', lastAtIndex);
      console.log('@ 后面的文本:', textAfterAt);
      console.log('正则匹配结果:', /^[a-zA-Z0-9\u4e00-\u9fa5\s\-_\.]*$/.test(textAfterAt));
      console.log('搜索结果:', searchPrompts(textAfterAt));
      console.log('mockPrompts 长度:', mockPrompts.length);

      // 放宽正则表达式限制，允许更多字符
      if (/^[a-zA-Z0-9\u4e00-\u9fa5\s\-_\.]*$/.test(textAfterAt)) {
        setAtPosition(lastAtIndex);
        setSearchQuery(textAfterAt);
        setFilteredPrompts(searchPrompts(textAfterAt));
        setShowPromptDropdown(true);
        setSelectedPromptIndex(0);

        // 延迟计算位置，确保 DOM 更新完成
        setTimeout(calculateDropdownPosition, 0);

        // 添加更多调试信息
        console.log('设置 showPromptDropdown 为 true');
        console.log('设置 filteredPrompts:', searchPrompts(textAfterAt));
      } else {
        setShowPromptDropdown(false);
      }
    } else {
      setShowPromptDropdown(false);
    }
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showPromptDropdown && filteredPrompts.length > 0) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedPromptIndex((prev) => (prev < filteredPrompts.length - 1 ? prev + 1 : 0));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedPromptIndex((prev) => (prev > 0 ? prev - 1 : filteredPrompts.length - 1));
          break;
        case 'Enter':
          if (!e.shiftKey) {
            e.preventDefault();
            selectPrompt(filteredPrompts[selectedPromptIndex]);
            return;
          }
          break;
        case 'Escape':
          e.preventDefault();
          // 关闭下拉选择框，并在当前位置插入 @ 字符
          setShowPromptDropdown(false);
          if (atPosition !== -1) {
            const beforeAt = inputValue.substring(0, atPosition);
            const afterAtQuery = inputValue.substring(atPosition + 1 + searchQuery.length);
            const newValue = beforeAt + '@' + afterAtQuery;
            setInputValue(newValue);

            // 设置光标位置到 @ 后面
            setTimeout(() => {
              if (textareaRef.current) {
                const newCursorPos = atPosition + 1;
                textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
                textareaRef.current.focus();
              }
            }, 0);
          }
          break;
      }
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 选择 prompt
  const selectPrompt = (prompt: Prompt) => {
    if (atPosition === -1) return;

    const beforeAt = inputValue.substring(0, atPosition);
    const afterAtQuery = inputValue.substring(atPosition + 1 + searchQuery.length);

    // 插入选中的 prompt 内容
    const newValue = beforeAt + prompt.content + afterAtQuery;
    setInputValue(newValue);
    setShowPromptDropdown(false);

    // 设置光标位置到插入内容的后面
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPos = beforeAt.length + prompt.content.length;
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        textareaRef.current.focus();
      }
    }, 0);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setShowPromptDropdown(false);

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'I received your message: "' + userMessage.content + '". This is a demo response.',
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        textareaRef.current &&
        !textareaRef.current.contains(event.target as Node)
      ) {
        setShowPromptDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-y-4 m-auto w-240 mt-[500px]">
      {/* 聊天输入框区域 */}
      <form
        className="flex items-end gap-2 mt-2 relative"
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
      >
        <div className="flex-1 relative">
          <DropdownMenu>
            <textarea
              ref={textareaRef}
              className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
              rows={5}
              placeholder="请输入你的问题… (输入 @ 搜索 prompts)"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              style={{ minHeight: 40, maxHeight: 120 }}
            />

            {showPromptDropdown && filteredPrompts.length > 0 && (
              <div
                ref={dropdownRef}
                className="absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-card text-card-foreground shadow-md w-72 max-h-96 overflow-y-auto p-1"
                style={{
                  left: dropdownPosition.left,
                  [dropdownSide === 'bottom' ? 'top' : 'bottom']:
                    dropdownSide === 'bottom'
                      ? dropdownPosition.top + 24
                      : dropdownPosition.top - 8,
                }}
              >
                {filteredPrompts.map((prompt, index) => (
                  <div
                    key={prompt.id}
                    className={cn(
                      'cursor-pointer px-3 py-2 my-0.5 rounded-sm',
                      index === selectedPromptIndex
                        ? 'bg-accent text-accent-foreground'
                        : 'text-foreground hover:bg-accent/50',
                    )}
                    onClick={() => selectPrompt(prompt)}
                    onMouseEnter={() => setSelectedPromptIndex(index)}
                  >
                    <div className="font-medium text-sm truncate w-full">{prompt.title}</div>
                  </div>
                ))}
              </div>
            )}
          </DropdownMenu>
        </div>

        <button
          type="submit"
          className={cn(
            'shadcn-btn shadcn-btn-primary px-4 py-2 rounded-lg',
            isLoading || !inputValue.trim() ? 'opacity-60 cursor-not-allowed' : '',
          )}
          disabled={isLoading || !inputValue.trim()}
        >
          {isLoading ? '发送中…' : '发送'}
        </button>
      </form>
      <SidePanel />
    </div>
  );
}
