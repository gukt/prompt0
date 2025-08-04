import { createContext, Dispatch, ReactNode, useContext, useReducer } from 'react';
import { PromptStorageService } from '../storage';
import { Prompt } from '../types';

// 状态接口
export interface PromptState {
  prompts: Prompt[];
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

// Action 类型
export type PromptAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PROMPTS'; payload: Prompt[] }
  | { type: 'ADD_PROMPT'; payload: Prompt }
  | { type: 'UPDATE_PROMPT'; payload: { id: string; updates: Partial<Prompt> } }
  | { type: 'DELETE_PROMPT'; payload: string }
  | { type: 'TOGGLE_PIN'; payload: string }
  | { type: 'SET_INITIALIZED'; payload: boolean }
  | { type: 'CLEAR_ALL' };

// 初始状态
const initialState: PromptState = {
  prompts: [],
  loading: false,
  error: null,
  initialized: false,
};

// Reducer 函数
function promptReducer(state: PromptState, action: PromptAction): PromptState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };

    case 'SET_PROMPTS':
      return {
        ...state,
        prompts: action.payload,
        loading: false,
        error: null,
      };

    case 'ADD_PROMPT':
      return {
        ...state,
        prompts: [action.payload, ...state.prompts],
        error: null,
      };

    case 'UPDATE_PROMPT': {
      const { id, updates } = action.payload;
      return {
        ...state,
        prompts: state.prompts.map((prompt) =>
          prompt.id === id ? { ...prompt, ...updates, updatedAt: new Date() } : prompt,
        ),
        error: null,
      };
    }

    case 'DELETE_PROMPT':
      return {
        ...state,
        prompts: state.prompts.filter((prompt) => prompt.id !== action.payload),
        error: null,
      };

    case 'TOGGLE_PIN': {
      const promptId = action.payload;
      return {
        ...state,
        prompts: state.prompts.map((prompt) =>
          prompt.id === promptId
            ? { ...prompt, isPinned: !prompt.isPinned, updatedAt: new Date() }
            : prompt,
        ),
        error: null,
      };
    }

    case 'SET_INITIALIZED':
      return { ...state, initialized: action.payload };

    case 'CLEAR_ALL':
      return { ...initialState, initialized: true };

    default:
      return state;
  }
}

// Context 接口
interface PromptContextType {
  state: PromptState;
  dispatch: Dispatch<PromptAction>;
}

// 创建 Context
const PromptContext = createContext<PromptContextType | null>(null);

// Provider 组件
interface PromptProviderProps {
  children: ReactNode;
}

export function PromptProvider({ children }: PromptProviderProps) {
  const [state, dispatch] = useReducer(promptReducer, initialState);

  return <PromptContext.Provider value={{ state, dispatch }}>{children}</PromptContext.Provider>;
}

// Hook 来使用 Context
export function usePromptContext(): PromptContextType {
  const context = useContext(PromptContext);
  if (!context) {
    throw new Error('usePromptContext 必须在 PromptProvider 内部使用');
  }
  return context;
}

// 高级 Hook - 提供完整的 Prompt 操作
export function usePrompts() {
  const { state, dispatch } = usePromptContext();

  // 初始化数据
  const initialize = async (mockData?: Prompt[]) => {
    if (state.initialized) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
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
