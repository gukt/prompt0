import { storage } from '#imports';
import { create } from 'zustand';

interface AppSidebarSetting {
  isOpen: boolean;
  pinnedTags: string[];
  isTagGroupExpanded?: boolean;
}

interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  fontSize: number;
  language: string;
  autoSave: boolean;
}

interface AppSettingsState {
  settings: AppSettings;
  loading: boolean;
  error: string | null;

  // 操作方法
  initialize: () => Promise<void>;
  updateSettings: (updates: Partial<AppSettings>) => Promise<void>;
  resetSettings: () => Promise<void>;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  fontSize: 14,
  language: 'zh-CN',
  autoSave: true,
};

const SETTINGS_STORAGE_KEY = 'local:settings';

export const useSettingsStore = create<AppSettingsState>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  loading: false,
  error: null,

  // 初始化设置
  initialize: async () => {
    set({ loading: true });
    try {
      const savedSettings = await storage.getItem<AppSettings>(SETTINGS_STORAGE_KEY);
      if (savedSettings) {
        set({ settings: { ...DEFAULT_SETTINGS, ...savedSettings }, loading: false });
      } else {
        // 如果没有保存的设置，使用默认设置并保存
        await storage.setItem(SETTINGS_STORAGE_KEY, DEFAULT_SETTINGS);
        set({ settings: DEFAULT_SETTINGS, loading: false });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '加载设置失败',
        loading: false
      });
    }
  },

  // 更新设置
  updateSettings: async (updates: Partial<AppSettings>) => {
    set({ loading: true });
    try {
      const currentSettings = get().settings;
      const newSettings = { ...currentSettings, ...updates };

      // 保存到存储
      await storage.setItem(SETTINGS_STORAGE_KEY, newSettings);

      // 更新状态
      set({ settings: newSettings, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '更新设置失败',
        loading: false
      });
    }
  },

  // 重置为默认设置
  resetSettings: async () => {
    set({ loading: true });
    try {
      await storage.setItem(SETTINGS_STORAGE_KEY, DEFAULT_SETTINGS);
      set({ settings: DEFAULT_SETTINGS, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '重置设置失败',
        loading: false
      });
    }
  },
}));
