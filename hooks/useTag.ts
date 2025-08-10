import { mockPrompts } from '@/lib/mock-data';
import { Prompt } from '@/lib/types';
import { useCallback, useMemo } from 'react';

// 从 constants.ts 导入的标签常量
const PREDEFINED_TAGS = [
  "职业", "商业", "工具", "语言", "办公", "通用", "写作", "编程", "情感", "教育",
  "创意", "学术", "设计", "艺术", "娱乐", "生活", "医疗", "游戏", "翻译", "音乐",
  "点评", "文案", "百科", "健康", "营销", "科学", "分析", "法律", "咨询", "金融",
  "旅游", "管理"
] as const;

export type PredefinedTag = typeof PREDEFINED_TAGS[number];

export function useTag(prompts: Prompt[] = mockPrompts) {
  // 获取所有可用标签
  const availableTags = useMemo(() => {
    const allTags = new Set<string>();

    // 添加预定义标签
    // PREDEFINED_TAGS.forEach(tag => allTags.add(tag));

    // 从提示词中提取标签
    prompts.forEach(prompt => {
      prompt.tags.forEach(tag => allTags.add(tag));
    });

    return Array.from(allTags).sort();
  }, [prompts]);

  // 过滤标签
  const filterTags = useCallback((
    query: string,
    excludeTags: string[] = [],
    limit: number = 10
  ) => {
    if (!query.trim()) {
      // 如果没有查询，返回前几个可用标签（排除已选择的）
      return availableTags
        .filter(tag => !excludeTags.includes(tag))
        .slice(0, limit);
    }

    const queryLower = query.toLowerCase();

    return availableTags
      .filter(tag =>
        tag.toLowerCase().includes(queryLower) &&
        !excludeTags.includes(tag)
      )
      .sort((a, b) => {
        // 优先显示以查询开头的标签
        const aStartsWith = a.toLowerCase().startsWith(queryLower);
        const bStartsWith = b.toLowerCase().startsWith(queryLower);

        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;

        // 然后按字母顺序排序
        return a.localeCompare(b);
      })
      .slice(0, limit);
  }, [availableTags]);

  // 获取最近使用的标签（简化版本，按字母顺序）
  const getRecentTags = useCallback((
    excludeTags: string[] = [],
    limit: number = 5
  ) => {
    return availableTags
      .filter(tag => !excludeTags.includes(tag))
      .slice(0, limit);
  }, [availableTags]);

  // 检查标签是否为预定义标签
  const isPredefinedTag = useCallback((tag: string): tag is PredefinedTag => {
    return PREDEFINED_TAGS.includes(tag as PredefinedTag);
  }, []);

  return {
    availableTags,
    predefinedTags: PREDEFINED_TAGS,

    filterTags,
    getRecentTags,
    isPredefinedTag,
  };
}
