import { storage } from '#imports';
import { create } from 'zustand';

interface Settings {
  theme: 'light' | 'dark' | 'system';
  fontSize: number;
  language: string;
  autoSave: boolean;
  sidebarOpen: boolean;
}

interface SettingsState {
  settings: Settings;
  loading: boolean;
  error: string | null;

  // 操作方法
  initialize: () => Promise<void>;
  updateSettings: (updates: Partial<Settings>) => Promise<void>;
  resetSettings: () => Promise<void>;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => Promise<void>;
}

const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
  fontSize: 14,
  language: 'zh-CN',
  autoSave: true,
  sidebarOpen: true,
};

const SETTINGS_STORAGE_KEY = 'local:settings';

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  loading: false,
  error: null,

  // 初始化设置
  initialize: async () => {
    set({ loading: true });
    try {
      const savedSettings = await storage.getItem<Settings>(SETTINGS_STORAGE_KEY);
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
  updateSettings: async (updates: Partial<Settings>) => {
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

  // 切换侧边栏
  toggleSidebar: () => {
    const currentSettings = get().settings;
    const sidebarOpen = !currentSettings.sidebarOpen;

    // 直接更新状态，不保存到存储（临时状态）
    set({ settings: { ...currentSettings, sidebarOpen } });

    // 如果需要持久化这个设置，可以取消下面的注释
    // get().updateSettings({ sidebarOpen });
  },

  // 设置主题
  setTheme: async (theme: 'light' | 'dark' | 'system') => {
    await get().updateSettings({ theme });

    // 应用主题到 DOM
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },
}));
