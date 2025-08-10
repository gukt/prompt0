import { storage } from '#imports';
import { create } from 'zustand';

interface SidebarState {
  isOpen: boolean;
  pinnedTags: string[];
  isTagGroupExpanded: boolean;
}

interface SidebarStore {
  // 状态
  sidebar: SidebarState;
  loading: boolean;
  error: string | null;

  // 操作方法
  initialize: () => Promise<void>;
  toggle: () => void;
  setOpen: (open: boolean) => Promise<void>;
  updatePinnedTags: (tags: string[]) => Promise<void>;
  toggleTagGroup: () => Promise<void>;
  reset: () => Promise<void>;
}

const DEFAULT_SIDEBAR_STATE: SidebarState = {
  isOpen: true,
  pinnedTags: [],
  isTagGroupExpanded: false,
};

const SIDEBAR_STORAGE_KEY = 'local:sidebar';

export const useSidebarStore = create<SidebarStore>((set, get) => ({
  sidebar: DEFAULT_SIDEBAR_STATE,
  loading: false,
  error: null,

  initialize: async () => {
    set({ loading: true });
    try {
      const savedSidebar = await storage.getItem<SidebarState>(SIDEBAR_STORAGE_KEY);
      if (savedSidebar) {
        set({ sidebar: { ...DEFAULT_SIDEBAR_STATE, ...savedSidebar }, loading: false });
      } else {
        await storage.setItem(SIDEBAR_STORAGE_KEY, DEFAULT_SIDEBAR_STATE);
        set({ sidebar: DEFAULT_SIDEBAR_STATE, loading: false });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '加载侧边栏设置失败',
        loading: false
      });
    }
  },

  toggle: () => {
    const currentSidebar = get().sidebar;
    const newState = { ...currentSidebar, isOpen: !currentSidebar.isOpen };
    set({ sidebar: newState });
    // 异步保存到存储
    get().setOpen(newState.isOpen);
  },

  setOpen: async (open: boolean) => {
    set({ loading: true });
    try {
      const currentSidebar = get().sidebar;
      const newSidebar = { ...currentSidebar, isOpen: open };
      await storage.setItem(SIDEBAR_STORAGE_KEY, newSidebar);
      set({ sidebar: newSidebar, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '更新侧边栏状态失败',
        loading: false
      });
    }
  },

  updatePinnedTags: async (tags: string[]) => {
    set({ loading: true });
    try {
      const currentSidebar = get().sidebar;
      const newSidebar = { ...currentSidebar, pinnedTags: tags };
      await storage.setItem(SIDEBAR_STORAGE_KEY, newSidebar);
      set({ sidebar: newSidebar, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '更新固定标签失败',
        loading: false
      });
    }
  },

  toggleTagGroup: async () => {
    set({ loading: true });
    try {
      const currentSidebar = get().sidebar;
      const newSidebar = {
        ...currentSidebar,
        isTagGroupExpanded: !currentSidebar.isTagGroupExpanded
      };
      await storage.setItem(SIDEBAR_STORAGE_KEY, newSidebar);
      set({ sidebar: newSidebar, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '切换标签组状态失败',
        loading: false
      });
    }
  },

  reset: async () => {
    set({ loading: true });
    try {
      await storage.setItem(SIDEBAR_STORAGE_KEY, DEFAULT_SIDEBAR_STATE);
      set({ sidebar: DEFAULT_SIDEBAR_STATE, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '重置侧边栏设置失败',
        loading: false
      });
    }
  },
}));