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
import { useSidebar } from '@/hooks/useSidebar';
import { useTag } from '@/hooks/useTag';
import { cn } from '@/lib/utils';
import { usePromptStore } from '@/stores/promptStore';
import { AlertTriangleIcon, StarIcon } from 'lucide-react';
import { useRef, useState } from 'react';

/** 显示在侧边栏的标签列表组件 */
export function TagList() {
  const { prompts, updatePrompt } = usePromptStore();
  const { addPinnedTag } = useSidebar();
  const { availableTags } = useTag(prompts);
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

  // 添加到列表功能相关状态
  const [addToListDialogOpen, setAddToListDialogOpen] = useState(false);
  const [tagToAddToList, setTagToAddToList] = useState<string | null>(null);

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

  // 处理添加到列表
  const handleAddToList = (tag: string) => {
    setTagToAddToList(tag);
    setAddToListDialogOpen(true);
  };

  // 确认添加到列表
  const handleConfirmAddToList = async () => {
    if (!tagToAddToList) return;

    try {
      addPinnedTag(tagToAddToList);

      // 关闭对话框
      setAddToListDialogOpen(false);
      setTagToAddToList(null);

      // 可以添加一个成功提示
      console.log(`标签 "${tagToAddToList}" 已添加到固定列表`);
    } catch (error) {
      console.error('添加到列表失败:', error);
    }
  };

  // 取消添加到列表
  const handleCancelAddToList = () => {
    setAddToListDialogOpen(false);
    setTagToAddToList(null);
  };

  // 检查标签是否已在固定列表中
  const isTagPinned = (tag: string) => {
    const pinnedTags = JSON.parse(localStorage.getItem('pinnedTags') || '[]');
    return pinnedTags.includes(tag);
  };

  // 获取使用该标签的提示词数量
  const getPromptCountForTag = (tag: string) => {
    return prompts.filter((prompt) => prompt.tags.includes(tag)).length;
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
              <ContextMenuItem onClick={() => handleStartEdit(tag)}>重命名标签</ContextMenuItem>
              <ContextMenuItem onClick={() => handleDelete(tag)}>删除此标签</ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem
                onClick={() => handleAddToList(tag)}
                className={isTagPinned(tag) ? 'text-muted-foreground' : ''}
              >
                <div className="flex items-center gap-2">
                  <StarIcon className="w-4 h-4" />
                  {isTagPinned(tag) ? '已在列表中' : '添加到列表'}
                </div>
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
                  {tagToDelete ? getPromptCountForTag(tagToDelete) : 0}
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

      {/* 添加到列表确认对话框 */}
      <Dialog open={addToListDialogOpen} onOpenChange={setAddToListDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <StarIcon className="w-5 h-5 text-primary" />
              添加标签到固定列表
            </DialogTitle>
            <DialogDescription className="pt-2">
              <p className="text-sm text-muted-foreground">
                您即将将标签 <span className="font-medium text-foreground">"{tagToAddToList}"</span>{' '}
                添加到侧边栏的固定列表中。
              </p>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-sm text-muted-foreground mt-1">
                <strong>说明：</strong>
                添加到固定列表后，该标签将显示在侧边栏的固定菜单中，方便快速访问。
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleCancelAddToList}>
              取消
            </Button>
            <Button onClick={handleConfirmAddToList}>确认添加</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
