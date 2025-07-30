import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { mockTags } from '@/lib/mock-data';
import { Prompt } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ArrowLeftIcon, Edit, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface PromptEditPageProps {
  prompt?: Prompt | null;
  onSave: (prompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onBack: () => void;
}

export function PromptEditPage({ prompt, onSave, onBack }: PromptEditPageProps) {
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
    setTitleEditing(false);
    setTagInput('');
  }, [prompt]);

  // 处理标签输入的智能匹配
  useEffect(() => {
    if (tagInput.trim()) {
      const filtered = availableTags.filter(
        (tag) => tag.toLowerCase().includes(tagInput.toLowerCase()) && !tags.includes(tag),
      );
      setFilteredTags(filtered);
      setShowSuggestions(filtered.length > 0);
      setSelectedTagIndex(-1);
    } else {
      setFilteredTags([]);
      setShowSuggestions(false);
      setSelectedTagIndex(-1);
    }
  }, [tagInput, tags]);

  const handleTitleClick = () => {
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

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ') {
      e.preventDefault();
      const trimmedInput = tagInput.trim();
      if (trimmedInput && !tags.includes(trimmedInput)) {
        setTags((prev) => [...prev, trimmedInput]);
        setTagInput('');
      }
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      // 当输入框为空且按退格键时，删除最后一个标签
      e.preventDefault();
      setTags((prev) => prev.slice(0, -1));
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (showSuggestions) {
        setSelectedTagIndex((prev) => (prev >= filteredTags.length - 1 ? 0 : prev + 1));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (showSuggestions) {
        setSelectedTagIndex((prev) => (prev <= 0 ? filteredTags.length - 1 : prev - 1));
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (showSuggestions && selectedTagIndex >= 0) {
        const selectedTag = filteredTags[selectedTagIndex];
        if (!tags.includes(selectedTag)) {
          setTags((prev) => [...prev, selectedTag]);
          setTagInput('');
        }
      } else {
        const trimmedInput = tagInput.trim();
        if (trimmedInput && !tags.includes(trimmedInput)) {
          setTags((prev) => [...prev, trimmedInput]);
          setTagInput('');
        }
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedTagIndex(-1);
    }
  };

  const handleSuggestionClick = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags((prev) => [...prev, tag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      alert('Please fill in both title and content');
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
    <div className="flex-1 flex flex-col">
      {/* Breadcrumb */}
      <div>
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <ArrowLeftIcon />
          </Button>

          {titleEditing ? (
            <input
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={handleTitleKeyDown}
              className="text-xl font-semibold bg-transparent border-b border-border focus:outline-none focus:border-primary flex-1"
            />
          ) : (
            <div
              className="flex items-center gap-2 cursor-pointer flex-1"
              onClick={handleTitleClick}
              onMouseEnter={() => setTitleHovered(true)}
              onMouseLeave={() => setTitleHovered(false)}
            >
              <h1 className="text-xl font-semibold">{title}</h1>
              {titleHovered && <Edit className="w-4 h-4 text-muted-foreground" />}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6 mt-4">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter prompt content..."
          rows={12}
          className="px-3 py-2 min-h-64"
        />

        {/* Smart Tags Input */}
        <div>
          <label className="block text-sm font-medium">Tags</label>
          <div className="relative">
            <div className="flex items-center gap-2 min-h-[44px] overflow-x-auto">
              <div className="flex items-center gap-2 flex-shrink-0">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1 whitespace-nowrap"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:bg-destructive/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <input
                ref={tagInputRef}
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                placeholder={tags.length === 0 ? 'Type tags, separate with space...' : ''}
                className="flex-1 min-w-[120px] bg-transparent outline-none text-sm"
              />
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-popover border border-border rounded-md shadow-lg max-h-40 overflow-y-auto">
                {filteredTags.map((tag, index) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleSuggestionClick(tag)}
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

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onBack}>
          Cancel
        </Button>
        <Button onClick={handleSave}>{prompt ? 'Save Changes' : 'Create Prompt'}</Button>
      </div>
    </div>
  );
}
