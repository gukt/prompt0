import { usePromptStore } from '@/stores/promptStore';
import { useSidebarStore } from '@/stores/sidebarStore';
import { useCallback } from 'react';

export const useSidebar = () => {
  const { prompts } = usePromptStore();
  const {
    sidebar,
    loading,
    error,
    toggle,
    setOpen,
    updatePinnedTags,
    toggleTagGroup,
    reset,
  } = useSidebarStore();

  // 便捷方法
  const isOpen = sidebar.isOpen;
  const pinnedTags = sidebar.pinnedTags;
  const isTagGroupExpanded = sidebar.isTagGroupExpanded;

  // 组合操作
  const closeSidebar = useCallback(() => setOpen(false), [setOpen]);
  const openSidebar = useCallback(() => setOpen(true), [setOpen]);

  const addPinnedTag = useCallback((tag: string) => {
    if (!pinnedTags.includes(tag)) {
      updatePinnedTags([...pinnedTags, tag]);
    }
  }, [pinnedTags, updatePinnedTags]);

  const removePinnedTag = useCallback((tag: string) => {
    updatePinnedTags(pinnedTags.filter(t => t !== tag));
  }, [pinnedTags, updatePinnedTags]);

  const getPromptCountForTag = useCallback((tag: string) => {
    return prompts.filter((prompt) => prompt.tags.includes(tag)).length;
  }, [prompts]);

  return {
    // 状态
    isOpen,
    pinnedTags,
    isTagGroupExpanded,
    loading,
    error,

    // 基础操作
    toggle,
    setOpen,
    updatePinnedTags,
    toggleTagGroup,
    reset,

    // 便捷操作
    closeSidebar,
    openSidebar,
    addPinnedTag,
    removePinnedTag,
    getPromptCountForTag,
  };
};
