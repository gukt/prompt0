import { Prompt } from '@/lib/types';
import { PromptStorageService } from '@/services/prompt-service';
import { create } from 'zustand';

interface PromptState {
  prompts: Prompt[];
  deletedPrompts: Prompt[]; // 新增：已删除的提示词
  loading: boolean;
  error: string | null;
  initialized: boolean;

  // 操作方法
  initialize: (mockData?: Prompt[]) => Promise<void>;
  refresh: () => Promise<void>;
  addPrompt: (promptData: Omit<Prompt, 'id' | 'createdAt'>) => Promise<void>;
  updatePrompt: (id: string, updates: Partial<Prompt>) => Promise<void>;
  deletePrompt: (id: string) => Promise<void>; // 改为软删除
  restorePrompt: (id: string) => Promise<void>; // 新增：恢复提示词
  permanentlyDeletePrompt: (id: string) => Promise<void>; // 新增：永久删除
  togglePin: (id: string) => Promise<void>;
  importPrompts: (importedPrompts: Prompt[]) => Promise<void>;
  clearAll: () => Promise<void>;
  getStorageStats: () => Promise<{ count: number; totalSize: number }>;
  clearError: () => void;
}

export const usePromptStore = create<PromptState>((set, get) => ({
  prompts: [],
  deletedPrompts: [], // 新增
  loading: false,
  error: null,
  initialized: false,

  // 初始化数据
  initialize: async (mockData?: Prompt[]) => {
    if (get().initialized) return;

    set({ loading: true });
    try {
      // 先尝试迁移旧格式数据
      await PromptStorageService.migrateFromOldFormat();

      // 如果提供了 mock 数据，先初始化
      if (mockData && mockData.length > 0) {
        await PromptStorageService.initializeWithMockData(mockData);
      }

      const prompts = await PromptStorageService.getPrompts();
      set({ prompts, loading: false, initialized: true });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '初始化失败',
        loading: false
      });
    }
  },

  // 刷新数据
  refresh: async () => {
    set({ loading: true });
    try {
      const prompts = await PromptStorageService.getPrompts();
      set({ prompts, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '刷新失败',
        loading: false
      });
    }
  },

  // 添加提示词
  addPrompt: async (promptData: Omit<Prompt, 'id' | 'createdAt'>) => {
    set({ loading: true });
    try {
      const newPrompt = await PromptStorageService.addPrompt(promptData);
      set(state => ({
        prompts: [newPrompt, ...state.prompts],
        loading: false,
        error: null
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '添加失败',
        loading: false
      });
    }
  },

  // 更新提示词
  updatePrompt: async (id: string, updates: Partial<Prompt>) => {
    set({ loading: true });
    try {
      await PromptStorageService.updatePrompt(id, updates);
      set(state => ({
        prompts: state.prompts.map((prompt) =>
          prompt.id === id ? { ...prompt, ...updates, updatedAt: new Date() } : prompt
        ),
        loading: false,
        error: null
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '更新失败',
        loading: false
      });
    }
  },

  // 修改删除方法为软删除
  deletePrompt: async (id: string) => {
    set({ loading: true });
    try {
      const prompt = get().prompts.find(p => p.id === id);
      if (!prompt) return;

      // 软删除：标记为已删除并设置删除时间
      const deletedPrompt = {
        ...prompt,
        isDeleted: true,
        deletedAt: new Date(),
        updatedAt: new Date()
      };

      await PromptStorageService.updatePrompt(id, {
        isDeleted: true,
        deletedAt: new Date()
      });

      set(state => ({
        prompts: state.prompts.filter((prompt) => prompt.id !== id),
        deletedPrompts: [deletedPrompt, ...state.deletedPrompts],
        loading: false,
        error: null
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '删除失败',
        loading: false
      });
    }
  },

  // 新增：恢复提示词
  restorePrompt: async (id: string) => {
    set({ loading: true });
    try {
      const deletedPrompt = get().deletedPrompts.find(p => p.id === id);
      if (!deletedPrompt) return;

      // 恢复：移除删除标记
      const restoredPrompt = {
        ...deletedPrompt,
        isDeleted: false,
        deletedAt: undefined,
        updatedAt: new Date()
      };

      await PromptStorageService.updatePrompt(id, {
        isDeleted: false,
        deletedAt: undefined
      });

      set(state => ({
        deletedPrompts: state.deletedPrompts.filter((prompt) => prompt.id !== id),
        prompts: [restoredPrompt, ...state.prompts],
        loading: false,
        error: null
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '恢复失败',
        loading: false
      });
    }
  },

  // 新增：永久删除
  permanentlyDeletePrompt: async (id: string) => {
    set({ loading: true });
    try {
      await PromptStorageService.deletePrompt(id);
      set(state => ({
        deletedPrompts: state.deletedPrompts.filter((prompt) => prompt.id !== id),
        loading: false,
        error: null
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '永久删除失败',
        loading: false
      });
    }
  },

  // 切换置顶
  togglePin: async (id: string) => {
    try {
      await PromptStorageService.togglePin(id);
      set(state => ({
        prompts: state.prompts.map((prompt) =>
          prompt.id === id
            ? { ...prompt, isPinned: !prompt.isPinned, updatedAt: new Date() }
            : prompt
        ),
        error: null
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '操作失败' });
    }
  },

  // 导入提示词
  importPrompts: async (importedPrompts: Prompt[]) => {
    set({ loading: true });
    try {
      await PromptStorageService.importPrompts(importedPrompts);
      // 重新加载数据以确保同步
      const prompts = await PromptStorageService.getPrompts();
      set({ prompts, loading: false, error: null });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '导入失败',
        loading: false
      });
    }
  },

  // 清空所有数据
  clearAll: async () => {
    set({ loading: true });
    try {
      await PromptStorageService.clearAll();
      set({ prompts: [], loading: false, error: null, initialized: true });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '清空失败',
        loading: false
      });
    }
  },

  // 获取存储统计
  getStorageStats: async () => {
    try {
      return await PromptStorageService.getStorageStats();
    } catch (error) {
      console.error('获取存储统计失败:', error);
      return { count: 0, totalSize: 0 };
    }
  },

  // 清除错误
  clearError: () => {
    set({ error: null });
  },
}));
