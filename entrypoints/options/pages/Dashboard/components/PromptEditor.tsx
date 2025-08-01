import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { mockTags } from '@/lib/mock-data';
import { Prompt } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ArrowLeftIcon, Edit, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface PromptEditorProps {
  prompt?: Prompt | null;
  onSave: (prompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onBack: () => void;
}

export function PromptEditor({ prompt, onSave, onBack }: PromptEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isPinned, setIsPinned] = useState(false);

  const [titleEditing, setTitleEditing] = useState(false);
  const [titleHovered, setTitleHovered] = useState(false);

  // 智能标签输入相关状态
  const [tagInput, setTagInput] = useState('');
  const [filteredTags, setFilteredTags] = useState<string[]>([]);
  const [selectedTagIndex, setSelectedTagIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const titleInputRef = useRef<HTMLInputElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);

  const availableTags = [
    ...new Set([
      ...mockTags.map((cat) => cat.name),
      // 从现有提示词中提取标签
      ...mockTags.flatMap((cat) => [cat.name]),
    ]),
  ];

  useEffect(() => {
    if (prompt) {
      setTitle(prompt.title);
      setContent(prompt.content);
      setTags(prompt.tags);
      setIsPinned(prompt.isPinned || false);
    } else {
      setTitle('New Prompt');
      setContent('');
      setTags([]);
      setIsPinned(false);
    }
  }, [prompt]);

  // 过滤标签建议
  useEffect(() => {
    if (tagInput.trim()) {
      const filtered = availableTags
        .filter((tag) => tag.toLowerCase().includes(tagInput.toLowerCase()) && !tags.includes(tag))
        .slice(0, 5);
      setFilteredTags(filtered);
      setShowSuggestions(filtered.length > 0);
      setSelectedTagIndex(-1);
    } else {
      setShowSuggestions(false);
      setFilteredTags([]);
    }
  }, [tagInput, tags, availableTags]);

  // 处理标题编辑
  const handleTitleEdit = () => {
    setTitleEditing(true);
    setTimeout(() => titleInputRef.current?.focus(), 0);
  };

  const handleTitleSubmit = () => {
    setTitleEditing(false);
    if (!title.trim()) {
      setTitle(prompt ? prompt.title : 'New Prompt');
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setTitle(prompt ? prompt.title : 'New Prompt');
      setTitleEditing(false);
    }
  };

  // 处理标签输入
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedTagIndex >= 0 && filteredTags[selectedTagIndex]) {
        addTag(filteredTags[selectedTagIndex]);
      } else if (tagInput.trim() && !tags.includes(tagInput.trim())) {
        addTag(tagInput.trim());
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedTagIndex((prev) => (prev < filteredTags.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedTagIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setTagInput('');
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      // 删除最后一个标签
      setTags((prev) => prev.slice(0, -1));
    }
  };

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags((prev) => [...prev, tag]);
    }
    setTagInput('');
    setShowSuggestions(false);
    setSelectedTagIndex(-1);
  };

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      alert('请填写标题和内容');
      return;
    }

    onSave({
      title: title.trim(),
      content: content.trim(),
      tags,
      isPinned,
    });
    onBack();
  };

  return (
    <div className="max-w-4xl mx-auto px-6 space-y-6">
      {/* 头部 */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeftIcon className="w-4 h-4" />
          返回
        </Button>
      </div>

      {/* 标题编辑 */}
      <div className="space-y-2">
        {titleEditing ? (
          <input
            ref={titleInputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={handleTitleKeyDown}
            className="text-3xl font-bold bg-transparent border-none outline-none focus:ring-0 w-full"
            placeholder="输入标题..."
          />
        ) : (
          <div
            className="flex items-center gap-2 group cursor-pointer"
            onMouseEnter={() => setTitleHovered(true)}
            onMouseLeave={() => setTitleHovered(false)}
            onClick={handleTitleEdit}
          >
            <h1 className="text-3xl font-bold">{title}</h1>
            {titleHovered && <Edit className="w-4 h-4 text-muted-foreground" />}
          </div>
        )}
      </div>

      {/* 标签管理 */}
      <div className="space-y-3">
        <label className="text-sm font-medium">标签</label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          <div className="relative">
            <input
              ref={tagInputRef}
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="添加标签..."
              className="px-3 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {showSuggestions && filteredTags.length > 0 && (
              <div className="absolute top-full left-0 mt-1 w-full bg-background border rounded-md shadow-lg z-50">
                {filteredTags.map((tag, index) => (
                  <button
                    key={tag}
                    onClick={() => addTag(tag)}
                    className={cn(
                      'w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors',
                      index === selectedTagIndex && 'bg-accent',
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 内容编辑 */}
      <div className="space-y-2">
        <label className="text-sm font-medium">内容</label>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="输入提示词内容..."
          className="min-h-[300px] resize-none"
        />
      </div>

      {/* 其他选项 */}
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isPinned}
            onChange={(e) => setIsPinned(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">置顶</span>
        </label>
      </div>

      {/* 底部操作 */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onBack}>
          取消
        </Button>
        <Button onClick={handleSave}>保存</Button>
      </div>
    </div>
  );
}
