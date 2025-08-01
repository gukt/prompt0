import { Prompt } from '@/lib/types';
import { useMemo } from 'react';

export const usePromptFilter = (prompts: Prompt[], activeItem: string, searchQuery: string = '') => {
  const filteredPrompts = useMemo(() => {
    let filtered = prompts;

    // 根据激活的菜单项过滤
    if (activeItem !== 'all') {
      filtered = filtered.filter((prompt) => {
        switch (activeItem) {
          case 'frequent':
            return prompt.isPinned;
          case 'settings':
          case 'docs':
          case 'contact':
            return false; // 这些项目不显示提示词
          default:
            // 检查是否为标签过滤
            return prompt.tags.some((tag) => 
              tag.toLowerCase().includes(activeItem.toLowerCase())
            );
        }
      });
    }

    // 根据搜索查询过滤
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((prompt) =>
        prompt.title.toLowerCase().includes(query) ||
        prompt.content.toLowerCase().includes(query) ||
        prompt.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [prompts, activeItem, searchQuery]);

  return {
    filteredPrompts,
    totalCount: prompts.length,
    filteredCount: filteredPrompts.length,
  };
}; 