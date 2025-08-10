import { usePromptStore } from '@/stores/promptStore';

/**
 * 提供完整的 Prompt 操作的 Hook
 * 
 * 这是一个兼容层，用于保持 API 一致性，内部使用 Zustand store
 */
export function usePrompts() {
  const {
    prompts,
    loading,
    error,
    initialized,
    initialize,
    refresh,
    addPrompt,
    updatePrompt,
    deletePrompt,
    togglePin,
    importPrompts,
    clearAll,
    getStorageStats,
    clearError,
  } = usePromptStore();

  return {
    // 状态
    prompts,
    loading,
    error,
    initialized,

    // 操作方法
    initialize,
    refresh,
    addPrompt,
    updatePrompt,
    deletePrompt,
    togglePin,
    importPrompts,
    clearAll,
    getStorageStats,
    clearError,
  };
}