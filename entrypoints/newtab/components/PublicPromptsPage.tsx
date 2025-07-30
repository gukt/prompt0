import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getSampleTags, sampleAgents } from '@/lib/sample-agents';
import { Prompt } from '@/lib/types';
import { CopyIcon, DownloadIcon, SearchIcon, TagIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

interface PublicPromptsPageProps {
  onImportPrompt?: (prompt: Prompt) => void;
}

export function PublicPromptsPage({ onImportPrompt }: PublicPromptsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [publicPrompts, setPublicPrompts] = useState<Prompt[]>(sampleAgents);

  const allTags = useMemo(() => getSampleTags(), []);

  const filteredPrompts = useMemo(() => {
    let filtered = publicPrompts;

    // 按搜索关键词过滤
    if (searchQuery) {
      filtered = filtered.filter(
        (prompt) =>
          prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prompt.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prompt.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      );
    }

    // 按标签过滤
    if (selectedTag) {
      filtered = filtered.filter((prompt) => prompt.tags.includes(selectedTag));
    }

    return filtered;
  }, [publicPrompts, searchQuery, selectedTag]);

  const handleCopyPrompt = async (prompt: Prompt) => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      // 这里可以添加一个 toast 提示
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  const handleImportPrompt = (prompt: Prompt) => {
    if (onImportPrompt) {
      // 创建一个新的 prompt 对象，去掉 cherry- 前缀
      const newPrompt: Prompt = {
        ...prompt,
        id: Date.now().toString(),
        createdAt: new Date(),
      };
      onImportPrompt(newPrompt);
    }
  };

  const handleImportFromFile = async () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const text = await file.text();
          const agentsData = JSON.parse(text);

          // 转换数据格式
          const convertedPrompts: Prompt[] = agentsData.map((agent: any) => ({
            id: `cherry-${agent.id}`,
            title: agent.name,
            content: agent.prompt,
            tags: agent.group || [],
            createdAt: new Date('2024-01-01'),
            isPinned: false,
          }));

          setPublicPrompts(convertedPrompts);
        }
      };
      input.click();
    } catch (error) {
      console.error('导入文件失败:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Prompt Library</h1>
          <p className="text-muted-foreground">
            探索来自 Cherry Studio 的精选提示词库，包含 {publicPrompts.length} 个专业提示词
          </p>
        </div>
        <Button onClick={handleImportFromFile} variant="outline">
          <DownloadIcon className="h-4 w-4 mr-2" />
          导入完整数据
        </Button>
      </div>

      {/* 搜索和筛选 */}
      <div className="space-y-4">
        {/* 搜索框 */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索提示词..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* 标签筛选 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TagIcon className="h-4 w-4" />
            <span className="text-sm font-medium">标签筛选:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedTag === '' ? 'default' : 'secondary'}
              className="cursor-pointer"
              onClick={() => setSelectedTag('')}
            >
              全部 ({publicPrompts.length})
            </Badge>
            {allTags.map((tag) => {
              const count = publicPrompts.filter((p) => p.tags.includes(tag)).length;
              return (
                <Badge
                  key={tag}
                  variant={selectedTag === tag ? 'default' : 'secondary'}
                  className="cursor-pointer"
                  onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                >
                  {tag} ({count})
                </Badge>
              );
            })}
          </div>
        </div>
      </div>

      {/* 结果统计 */}
      <div className="text-sm text-muted-foreground">
        显示 {filteredPrompts.length} 个提示词
        {selectedTag && ` (标签: ${selectedTag})`}
        {searchQuery && ` (搜索: "${searchQuery}")`}
      </div>

      {/* 提示词网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPrompts.map((prompt) => (
          <Card key={prompt.id} className="h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="text-base leading-tight">{prompt.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* 标签 */}
              <div className="flex flex-wrap gap-1">
                {prompt.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {prompt.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{prompt.tags.length - 3}
                  </Badge>
                )}
              </div>

              {/* 内容预览 */}
              <p className="text-sm text-muted-foreground line-clamp-3">
                {prompt.content.replace(/\r\n/g, ' ').slice(0, 120)}
                {prompt.content.length > 120 && '...'}
              </p>

              {/* 操作按钮 */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopyPrompt(prompt)}
                  className="flex-1"
                >
                  <CopyIcon className="h-3 w-3 mr-1" />
                  复制
                </Button>
                <Button size="sm" onClick={() => handleImportPrompt(prompt)} className="flex-1">
                  导入
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 空状态 */}
      {filteredPrompts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">没有找到匹配的提示词</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setSelectedTag('');
            }}
            className="mt-2"
          >
            清除筛选条件
          </Button>
        </div>
      )}
    </div>
  );
}
