import { TagInput } from '@/components/TagInput';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Prompt } from '@/lib/types';
import { ArrowLeftIcon, Edit } from 'lucide-react';
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

  const titleInputRef = useRef<HTMLInputElement>(null);

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
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeftIcon /> Back
        </Button>
      </div>

      {/* Title */}
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
            placeholder="Enter title..."
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

      {/* Content */}
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="输入提示词内容..."
        className="min-h-[300px] resize-none"
      />

      {/* Tags */}
      <TagInput value={tags} onChange={setTags} placeholder="添加标签" />

      {/* Bottom Actions */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onBack}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}
