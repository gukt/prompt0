import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { mockCategories } from '@/lib/mock-data';
import { Prompt } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Edit, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface PromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prompt?: Prompt | null;
  onSave: (prompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export function PromptDialog({ open, onOpenChange, prompt, onSave }: PromptDialogProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [isPinned, setIsPinned] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
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
      ...mockCategories.map((cat) => cat.name),
      // 从现有提示词中提取标签
      ...mockCategories.flatMap((cat) => [cat.name]),
    ]),
  ];

  useEffect(() => {
    if (prompt) {
      setTitle(prompt.title);
      setContent(prompt.content);
      setCategories(prompt.categories);
      setIsPinned(prompt.isPinned || false);
      setIsFavorite(prompt.isFavorite || false);
    } else {
      setTitle('New Prompt');
      setContent('');
      setCategories([]);
      setIsPinned(false);
      setIsFavorite(false);
    }
    setTitleEditing(false);
    setTagInput('');
  }, [prompt]);

  // 处理标签输入的智能匹配
  useEffect(() => {
    if (tagInput.trim()) {
      const filtered = availableTags.filter(
        (tag) => tag.toLowerCase().includes(tagInput.toLowerCase()) && !categories.includes(tag),
      );
      setFilteredTags(filtered);
      setShowSuggestions(filtered.length > 0);
      setSelectedTagIndex(-1);
    } else {
      setFilteredTags([]);
      setShowSuggestions(false);
      setSelectedTagIndex(-1);
    }
  }, [tagInput, categories]);

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
      if (trimmedInput && !categories.includes(trimmedInput)) {
        setCategories((prev) => [...prev, trimmedInput]);
        setTagInput('');
      }
    } else if (e.key === 'Backspace' && !tagInput && categories.length > 0) {
      // 当输入框为空且按退格键时，删除最后一个标签
      e.preventDefault();
      setCategories((prev) => prev.slice(0, -1));
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
        if (!categories.includes(selectedTag)) {
          setCategories((prev) => [...prev, selectedTag]);
          setTagInput('');
        }
      } else {
        const trimmedInput = tagInput.trim();
        if (trimmedInput && !categories.includes(trimmedInput)) {
          setCategories((prev) => [...prev, trimmedInput]);
          setTagInput('');
        }
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedTagIndex(-1);
    }
  };

  const handleSuggestionClick = (tag: string) => {
    if (!categories.includes(tag)) {
      setCategories((prev) => [...prev, tag]);
      setTagInput('');
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    setCategories((prev) => prev.filter((cat) => cat !== categoryToRemove));
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    onSave({
      title: title.trim(),
      content: content.trim(),
      categories,
      isPinned,
      isFavorite,
      usage: prompt?.usage || 0,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          {titleEditing ? (
            <input
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={handleTitleKeyDown}
              className="text-lg font-semibold bg-transparent border-b border-border focus:outline-none focus:border-primary"
            />
          ) : (
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={handleTitleClick}
              onMouseEnter={() => setTitleHovered(true)}
              onMouseLeave={() => setTitleHovered(false)}
            >
              <span className="text-lg font-semibold">{title}</span>
              {titleHovered && <Edit className="w-4 h-4 text-muted-foreground" />}
            </div>
          )}
        </DialogHeader>

        <div className="space-y-6">
          {/* Content */}
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter prompt content..."
              rows={8}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>

          {/* Smart Tags Input - Single Row */}
          <div className="space-y-2">
            <div className="relative">
              <div className="flex items-center gap-2 p-3 border border-border rounded-md min-h-[44px] bg-background overflow-x-auto">
                <div className="flex items-center gap-2 flex-shrink-0">
                  {categories.map((category) => (
                    <Badge
                      key={category}
                      variant="secondary"
                      className="flex items-center gap-1 whitespace-nowrap"
                    >
                      {category}
                      <button
                        type="button"
                        onClick={() => removeCategory(category)}
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
                  placeholder={categories.length === 0 ? 'Type tags, separate with space...' : ''}
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

          {/* Options */}
          <div className="space-y-3">
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                />
                <span className="text-sm">Pin as frequent</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFavorite}
                  onChange={(e) => setIsFavorite(e.target.checked)}
                  className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                />
                <span className="text-sm">Mark as favorite</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>{prompt ? 'Save' : 'Create'}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
