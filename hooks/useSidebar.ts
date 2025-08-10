import { useSidebarStore } from '@/stores/sidebarStore';
import { useCallback } from 'react';

export const useSidebar = () => {
  const {
    sidebar,
    // toggle,
    setOpen,
    updatePinnedTags,
    // toggleTagGroup,
    // reset,
  } = useSidebarStore();

  const isOpen = sidebar.isOpen;
  const pinnedTags = sidebar.pinnedTags;
  const isTagGroupExpanded = sidebar.isTagGroupExpanded;

  // 便捷方法
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

  // TODO 看看其他地方是否也都像这里一样去掉 useCallback
  // https://github.com/facebook/react/issues/31913
  function isTagPinned(tag: string) {
    return pinnedTags.includes(tag);
  }

  return {
    // 状态
    isOpen,
    pinnedTags,
    isTagGroupExpanded,

    // // 基础操作
    // toggle,
    // setOpen,
    // updatePinnedTags,
    // toggleTagGroup,
    // reset,

    // 便捷操作
    closeSidebar,
    openSidebar,
    addPinnedTag,
    removePinnedTag,
    isTagPinned,
  };
};
