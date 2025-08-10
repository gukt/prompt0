import { Button } from '@/components/ui/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { usePromptStore } from '@/stores/promptStore';
import { AlertTriangleIcon } from 'lucide-react';

/** 显示在侧边栏的标签列表组件 */
export function TagList() {
  const { prompts, updatePrompt } = usePromptStore();
  const { addPinnedTag, isTagPinned } = useSidebar();
  const { availableTags, getPromptCountForTag } = useTag(prompts);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const tagInputRef = useRef<HTMLInputElement>(null);

  // 双击检测相关状态
  const [lastClickTime, setLastClickTime] = useState<number>(0);
  const [lastClickedTag, setLastClickedTag] = useState<string | null>(null);
  const DOUBLE_CLICK_DELAY = 300; // 300ms 内的两次点击视为双击

  // 删除确认对话框状态
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<string | null>(null);

  // 处理标签点击，检测双击
  const handleTagClick = (tag: string) => {
    const currentTime = Date.now();

    // 检查是否是同一个标签的双击
    if (lastClickedTag === tag && currentTime - lastClickTime < DOUBLE_CLICK_DELAY) {
      // 双击进入编辑模式
      handleStartEdit(tag);
      // 重置双击检测状态
      setLastClickTime(0);
      setLastClickedTag(null);
    } else {
      // 单击选择标签
      setSelectedTag(tag);
      setLastClickTime(currentTime);
      setLastClickedTag(tag);
    }
  };

  // 开始编辑标签
  const handleStartEdit = (tag: string) => {
    setEditingTag(tag);
    setNewTagName(tag);
    setTimeout(() => tagInputRef.current?.focus(), 0);
  };

  // 保存标签重命名
  const handleSave = async () => {
    console.log('handleSaveEdit');
    if (!editingTag || !newTagName.trim() || newTagName === editingTag) {
      setEditingTag(null);
      setNewTagName('');
      return;
    }

    try {
      // 更新所有使用该标签的提示词
      const promptsToUpdate = prompts.filter((prompt) => prompt.tags.includes(editingTag));

      for (const prompt of promptsToUpdate) {
        const updatedTags = prompt.tags.map((tag) =>
          tag === editingTag ? newTagName.trim() : tag,
        );
        await updatePrompt(prompt.id, { tags: updatedTags });
      }

      setEditingTag(null);
      setNewTagName('');
    } catch (error) {
      console.error('重命名标签失败:', error);
    }
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      // 按 Escape 取消编辑，恢复原标签名
      setEditingTag(null);
      setNewTagName('');
    }
  };

  // 处理输入框失焦
  const handleBlur = () => {
    handleSave();
  };

  // 打开删除确认对话框
  const handleDelete = (tag: string) => {
    console.log('handleDelete', tag);
    setTagToDelete(tag);
    setDeleteDialogOpen(true);
  };

  // 确认删除标签
  const handleConfirmDelete = async () => {
    if (!tagToDelete) return;

    try {
      // 从所有使用该标签的提示词中移除该标签
      const promptsToUpdate = prompts.filter((prompt) => prompt.tags.includes(tagToDelete));

      for (const prompt of promptsToUpdate) {
        const updatedTags = prompt.tags.filter((tag) => tag !== tagToDelete);
        await updatePrompt(prompt.id, { tags: updatedTags });
      }

      // 关闭对话框并重置状态
      setDeleteDialogOpen(false);
      setTagToDelete(null);

      // 如果当前选中的标签被删除，清除选择
      if (selectedTag === tagToDelete) {
        setSelectedTag(null);
      }
    } catch (error) {
      console.error('删除标签失败:', error);
    }
  };

  // 取消删除
  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setTagToDelete(null);
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {availableTags?.map((tag) => (
          <ContextMenu key={tag}>
            <ContextMenuTrigger>
              {editingTag === tag ? (
                // 编辑模式：只显示输入框
                <Input
                  ref={tagInputRef}
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleBlur}
                  className="h-6 w-20 text-xs px-2 py-1"
                  onClick={(e) => e.stopPropagation()}
                  placeholder="输入标签名"
                />
              ) : (
                // 显示模式：显示标签按钮
                <button
                  onClick={() => handleTagClick(tag)}
                  className={cn(
                    'px-2 py-1 text-xs rounded-md border transition-colors cursor-pointer',
                    selectedTag === tag
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background hover:bg-accent border-border text-muted-foreground hover:text-foreground',
                  )}
                  title="双击重命名标签"
                >
                  {tag}
                </button>
              )}
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onClick={() => handleStartEdit(tag)}>Rename</ContextMenuItem>
              <ContextMenuItem onClick={() => handleDelete(tag)}>Delete</ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem disabled={isTagPinned(tag)} onClick={() => addPinnedTag(tag)}>
                <span className="flex items-center gap-2">Add to list</span>
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ))}
      </div>

      {/* 删除确认对话框 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangleIcon className="w-5 h-5 text-destructive" />
              删除 '{tagToDelete}' 标签？
            </DialogTitle>
            <DialogDescription className="pt-2">
              <p className="text-sm text-muted-foreground">
                此标签正用于{' '}
                <span className="font-medium text-foreground">
                  {getPromptCountForTag(tagToDelete)}
                </span>{' '}
                个提示词。
              </p>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-sm text-muted-foreground mt-1">
                <strong>注意：</strong>删除标签不会删除相关的提示词，只会从这些提示词中移除该标签。
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleCancelDelete}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              确认删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
