import { Prompt } from '@/lib/types';
import { PromptStorageService } from '@/services/prompt-service';
import { usePromptContext } from '@/stores/prompt/context';

// 提供完整的 Prompt 操作
export function usePrompts() {
  const { state, dispatch } = usePromptContext();

  // 初始化数据
  const initialize = async (mockData?: Prompt[]) => {
    if (state.initialized) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // 先尝试迁移旧格式数据
      await PromptStorageService.migrateFromOldFormat();
      
      // 如果提供了 mock 数据，先初始化
      if (mockData && mockData.length > 0) {
        await PromptStorageService.initializeWithMockData(mockData);
      }

      const prompts = await PromptStorageService.getPrompts();
      dispatch({ type: 'SET_PROMPTS', payload: prompts });
      dispatch({ type: 'SET_INITIALIZED', payload: true });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : '初始化失败',
      });
    }
  };

  // 刷新数据
  const refresh = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const prompts = await PromptStorageService.getPrompts();
      dispatch({ type: 'SET_PROMPTS', payload: prompts });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : '刷新失败' });
    }
  };

  // 添加提示词
  const addPrompt = async (promptData: Omit<Prompt, 'id' | 'createdAt'>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const newPrompt = await PromptStorageService.addPrompt(promptData);
      dispatch({ type: 'ADD_PROMPT', payload: newPrompt });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : '添加失败' });
    }
  };

  // 更新提示词
  const updatePrompt = async (id: string, updates: Partial<Prompt>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await PromptStorageService.updatePrompt(id, updates);
      dispatch({ type: 'UPDATE_PROMPT', payload: { id, updates } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : '更新失败' });
    }
  };

  // 删除提示词
  const deletePrompt = async (id: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await PromptStorageService.deletePrompt(id);
      dispatch({ type: 'DELETE_PROMPT', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : '删除失败' });
    }
  };

  // 切换置顶
  const togglePin = async (id: string) => {
    try {
      await PromptStorageService.togglePin(id);
      dispatch({ type: 'TOGGLE_PIN', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : '操作失败' });
    }
  };

  // 导入提示词
  const importPrompts = async (importedPrompts: Prompt[]) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await PromptStorageService.importPrompts(importedPrompts);
      // 重新加载数据以确保同步
      await refresh();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : '导入失败' });
    }
  };

  // 清空所有数据
  const clearAll = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await PromptStorageService.clearAll();
      dispatch({ type: 'CLEAR_ALL' });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : '清空失败' });
    }
  };

  // 获取存储统计
  const getStorageStats = async () => {
    try {
      return await PromptStorageService.getStorageStats();
    } catch (error) {
      console.error('获取存储统计失败:', error);
      return { count: 0, totalSize: 0 };
    }
  };

  // 清除错误
  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  return {
    // 状态
    prompts: state.prompts,
    loading: state.loading,
    error: state.error,
    initialized: state.initialized,

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