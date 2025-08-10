import { useSettingsStore } from '@/stores/settingsStore';

/**
 * 提供完整的设置操作的 Hook
 */
export function useSettings() {
  const {
    settings,
    loading,
    error,
    initialize,
    updateSettings,
    resetSettings,
    toggleSidebar,
    setTheme,
  } = useSettingsStore();

  return {
    // 状态
    settings,
    loading,
    error,

    // 主题相关
    theme: settings.theme,
    isDarkMode: settings.theme === 'dark' ||
      (settings.theme === 'system' && typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches),

    // 侧边栏状态
    sidebarOpen: settings.sidebarOpen,

    // 其他设置
    fontSize: settings.fontSize,
    language: settings.language,
    autoSave: settings.autoSave,

    // 操作方法
    initialize,
    updateSettings,
    resetSettings,
    toggleSidebar,
    setTheme,
  };
}
