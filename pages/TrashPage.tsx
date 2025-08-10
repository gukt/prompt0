import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePromptStore } from '@/stores/promptStore';
import { ArchiveRestoreIcon, Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';

export function TrashPage() {
  const { deletedPrompts, restorePrompt, permanentlyDeletePrompt } = usePromptStore();

  const handleRestore = async (id: string) => {
    try {
      await restorePrompt(id);
      toast.success('提示词已恢复');
    } catch (error) {
      toast.error('恢复失败');
    }
  };

  const handlePermanentlyDelete = async (id: string) => {
    try {
      await permanentlyDeletePrompt(id);
      toast.success('提示词已永久删除');
    } catch (error) {
      toast.error('永久删除失败');
    }
  };

  const handleEmptyTrash = async () => {
    if (deletedPrompts.length === 0) return;

    try {
      await Promise.all(deletedPrompts.map((p) => permanentlyDeletePrompt(p.id)));
      toast.success('回收站已清空');
    } catch (error) {
      toast.error('清空回收站失败');
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-1">
          <h1 className="text-lg font-medium">回收站</h1>
          <span>({deletedPrompts.length})</span>
        </div>

        {deletedPrompts.length > 0 && (
          <Button variant="destructive" onClick={handleEmptyTrash} size="sm">
            <Trash2Icon className="w-4 h-4 mr-2" />
            清空回收站
          </Button>
        )}
      </div>

      {/* Deleted Prompts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {deletedPrompts.map((prompt) => (
          <div
            key={prompt.id}
            className="flex flex-col gap-3 rounded-xl p-4 border border-dashed border-muted-foreground/30 bg-muted/20"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-1 font-medium text-sm">
                <span className="truncate line-clamp-1">{prompt.title}</span>
                <span className="text-xs text-muted-foreground">
                  {prompt.deletedAt && new Date(prompt.deletedAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="text-sm text-muted-foreground line-clamp-4">{prompt.content}</div>

            {/* Footer - Tags */}
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {prompt.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} className="bg-muted/50 text-muted-foreground">
                    {tag}
                  </Badge>
                ))}
                {prompt.tags.length > 3 && (
                  <Badge className="bg-muted/50 text-muted-foreground">
                    +{prompt.tags.length - 3}
                  </Badge>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRestore(prompt.id)}
                  className="h-8 px-3"
                >
                  <ArchiveRestoreIcon /> 恢复
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handlePermanentlyDelete(prompt.id)}
                  className="h-8 px-3"
                >
                  <Trash2Icon /> 永久删除
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {deletedPrompts.length === 0 && (
        <div className="text-muted-foreground text-center my-10">
          回收站是空的，删除的提示词会显示在这里
        </div>
      )}
    </>
  );
}
