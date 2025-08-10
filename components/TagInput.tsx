import { Badge } from '@/components/ui/badge';
import { useTag } from '@/hooks/useTag';
import { cn } from '@/lib/utils';
import { useCallback, useEffect, useRef, useState } from 'react';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  className?: string;
  placeholder?: string;
}

export function TagInput({
  value = [],
  onChange,
  className,
  placeholder = '添加标签...',
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [filteredTags, setFilteredTags] = useState<string[]>([]);
  const [highlightedTagIndex, setHighlightedTagIndex] = useState(-1);
  const [isComposing, setIsComposing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { filterTags, getRecentTags } = useTag();

  useEffect(() => {
    const filtered = filterTags(inputValue, value);
    setFilteredTags(filtered);
    setSelectedIndex(filtered.length > 0 ? 0 : -1);
  }, [inputValue, value, filterTags]);

  // 添加标签
  const addTag = useCallback(
    (tag: string) => {
      if (tag.trim() && !value.includes(tag.trim())) {
        const newTags = [...value, tag.trim()];
        onChange(newTags);
        setInputValue('');
        setIsOpen(false);
        setSelectedIndex(-1);
        setHighlightedTagIndex(-1);

        // 聚焦输入框
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }
    },
    [value, onChange],
  );

  // 删除标签
  const removeTag = useCallback(
    (tagToRemove: string) => {
      const newTags = value.filter((tag) => tag !== tagToRemove);
      onChange(newTags);
      setHighlightedTagIndex(-1);

      // 聚焦输入框
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    },
    [value, onChange],
  );

  // 处理输入框聚焦
  const handleInputFocus = () => {
    if (!inputValue.trim()) {
      // 首次聚焦时显示最近常用的标签
      const recentTags = getRecentTags(value, 3);
      setFilteredTags(recentTags);
      setSelectedIndex(recentTags.length > 0 ? 0 : -1);
    }
    setIsOpen(true);
  };

  // 处理输入框失焦
  const handleInputBlur = () => {
    // 延迟关闭，以便点击建议项时能正常工作
    setTimeout(() => {
      setIsOpen(false);
      setSelectedIndex(-1);
    }, 150);
  };

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // 处理空格键逻辑
    if (newValue.endsWith(' ') && !isComposing) {
      const trimmedValue = newValue.trim();
      if (trimmedValue) {
        addTag(trimmedValue);
        return;
      }
    }

    setInputValue(newValue);
    setIsOpen(true);
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isComposing) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (isOpen && filteredTags.length > 0) {
          setSelectedIndex((prev) => (prev < filteredTags.length - 1 ? prev + 1 : 0));
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (isOpen && filteredTags.length > 0) {
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredTags.length - 1));
        }
        break;

      case 'Enter':
      case 'Tab':
        e.preventDefault();
        if (isOpen && selectedIndex >= 0 && filteredTags[selectedIndex]) {
          addTag(filteredTags[selectedIndex]);
        } else if (inputValue.trim()) {
          addTag(inputValue.trim());
        }
        break;

      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;

      case 'Backspace':
        if (inputValue === '' && value.length > 0) {
          e.preventDefault();
          if (highlightedTagIndex >= 0) {
            // 删除高亮的标签
            removeTag(value[highlightedTagIndex]);
          } else {
            // 高亮最后一个标签
            setHighlightedTagIndex(value.length - 1);
          }
        } else if (highlightedTagIndex >= 0) {
          setHighlightedTagIndex(-1);
        }
        break;

      case ' ':
        if (!isComposing && inputValue.trim()) {
          e.preventDefault();
          addTag(inputValue.trim());
        }
        break;

      default:
        // 如果有高亮的标签，取消高亮
        if (highlightedTagIndex >= 0) {
          setHighlightedTagIndex(-1);
        }
        break;
    }
  };

  // 处理建议项点击
  const handleSuggestionClick = (tag: string) => {
    addTag(tag);
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="flex flex-wrap items-center gap-1 text-sm">
        {value.map((tag, index) => (
          <Badge
            key={`${tag}-${index}`}
            variant="outline"
            className={cn(
              'cursor-pointer',
              highlightedTagIndex === index && 'bg-primary text-primary-foreground',
            )}
          >
            {tag}
          </Badge>
        ))}

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          placeholder={value.length === 0 ? placeholder : ''}
          className="flex-1 outline-none bg-transparent text-sm min-w-[120px]"
        />
      </div>

      {/* 建议下拉列表 */}
      {isOpen && filteredTags.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50 max-h-[200px] overflow-y-auto">
          {filteredTags.map((tag, index) => (
            <button
              key={tag}
              onClick={() => handleSuggestionClick(tag)}
              className={cn(
                'w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors',
                index === selectedIndex && 'bg-accent',
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
