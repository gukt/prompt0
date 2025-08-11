import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { TagInput } from '@/components/TagInput';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { usePromptStore } from '@/stores/promptStore';
import { ArrowLeftIcon, PencilIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

export function PromptEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { prompts, addPrompt, updatePrompt } = usePromptStore();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isPinned, setIsPinned] = useState(false);

  const [titleEditing, setTitleEditing] = useState(false);
  const [titleHovered, setTitleHovered] = useState(false);

  const titleInputRef = useRef<HTMLInputElement>(null);

  // 获取当前编辑的 prompt
  const editingPrompt = id ? prompts.find((p) => p.id === id) : null;

  useEffect(() => {
    if (editingPrompt) {
      setTitle(editingPrompt.title);
      setContent(editingPrompt.content);
      setTags(editingPrompt.tags);
      setIsPinned(editingPrompt.isPinned || false);
    } else {
      setTitle('New Prompt');
      setContent('');
      setTags([]);
      setIsPinned(false);
    }
  }, [editingPrompt]);

  // 处理标题编辑
  const handleTitleEdit = () => {
    setTitleEditing(true);
    setTimeout(() => titleInputRef.current?.focus(), 0);
  };

  const handleTitleSubmit = () => {
    setTitleEditing(false);
    if (!title.trim()) {
      setTitle(editingPrompt ? editingPrompt.title : 'New Prompt');
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setTitle(editingPrompt ? editingPrompt.title : 'New Prompt');
      setTitleEditing(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert('请填写标题和内容');
      return;
    }

    try {
      const promptData = {
        title: title.trim(),
        content: content.trim(),
        tags,
        isPinned,
        updatedAt: new Date(),
      };

      if (editingPrompt?.id) {
        await updatePrompt(editingPrompt.id, promptData);
      } else {
        await addPrompt(promptData);
      }

      navigate('/prompts');
    } catch (error) {
      console.error('保存失败:', error);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <SidebarLayout>
      <div className="max-w-4xl mx-auto px-6 space-y-6">
        {/* Title */}
        <div className="flex items-center gap-2">
          <a onClick={handleBack} className="rounded p-1.5 hover:bg-muted cursor-pointer">
            <ArrowLeftIcon size={16} />
          </a>

          {/* 添加 flex-1 是为了防止 hover 时标题抖动 */}
          <div className="flex-1 space-y-2">
            {titleEditing ? (
              <input
                ref={titleInputRef}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={handleTitleKeyDown}
                className="text-base bg-transparent border-none outline-none focus:ring-0 w-full"
                placeholder="New Prompt"
              />
            ) : (
              <div
                className="flex items-center gap-2 group cursor-pointer"
                onMouseEnter={() => setTitleHovered(true)}
                onMouseLeave={() => setTitleHovered(false)}
                onClick={handleTitleEdit}
              >
                <h1 className="text-base">{title}</h1>
                {titleHovered && <PencilIcon size={14} className="text-muted-foreground" />}
              </div>
            )}
          </div>
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
          <Button variant="outline" onClick={handleBack}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </SidebarLayout>
  );
}
