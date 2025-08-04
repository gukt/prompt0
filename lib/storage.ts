import { storage } from '#imports';
import { Prompt } from './types';

// WXT 跨浏览器存储服务
export class PromptStorageService {
  private static readonly PROMPTS_KEY = 'prompts';
  private static readonly SETTINGS_KEY = 'settings';

  // 获取所有提示词
  static async getPrompts(): Promise<Prompt[]> {
    try {
      const prompts = await storage.getItem<Prompt[]>(`local:${this.PROMPTS_KEY}`);
      return prompts || [];
    } catch (error) {
      console.error('获取提示词失败:', error);
      return [];
    }
  }

  // 保存所有提示词
  static async savePrompts(prompts: Prompt[]): Promise<void> {
    try {
      await storage.setItem(`local:${this.PROMPTS_KEY}`, prompts);
    } catch (error) {
      console.error('保存提示词失败:', error);
      throw error;
    }
  }

  // 添加单个提示词
  static async addPrompt(prompt: Omit<Prompt, 'id' | 'createdAt'>): Promise<Prompt> {
    try {
      const prompts = await this.getPrompts();
      const newPrompt: Prompt = {
        ...prompt,
        id: Date.now().toString(),
        createdAt: new Date(),
      };
      
      const updatedPrompts = [newPrompt, ...prompts];
      await this.savePrompts(updatedPrompts);
      return newPrompt;
    } catch (error) {
      console.error('添加提示词失败:', error);
      throw error;
    }
  }

  // 更新提示词
  static async updatePrompt(id: string, updates: Partial<Prompt>): Promise<void> {
    try {
      const prompts = await this.getPrompts();
      const updatedPrompts = prompts.map(prompt =>
        prompt.id === id
          ? { ...prompt, ...updates, updatedAt: new Date() }
          : prompt
      );
      await this.savePrompts(updatedPrompts);
    } catch (error) {
      console.error('更新提示词失败:', error);
      throw error;
    }
  }

  // 删除提示词
  static async deletePrompt(id: string): Promise<void> {
    try {
      const prompts = await this.getPrompts();
      const filteredPrompts = prompts.filter(prompt => prompt.id !== id);
      await this.savePrompts(filteredPrompts);
    } catch (error) {
      console.error('删除提示词失败:', error);
      throw error;
    }
  }

  // 切换置顶状态
  static async togglePin(id: string): Promise<void> {
    try {
      const prompts = await this.getPrompts();
      const prompt = prompts.find(p => p.id === id);
      if (prompt) {
        await this.updatePrompt(id, { isPinned: !prompt.isPinned });
      }
    } catch (error) {
      console.error('切换置顶状态失败:', error);
      throw error;
    }
  }

  // 批量导入提示词
  static async importPrompts(importedPrompts: Prompt[]): Promise<void> {
    try {
      const existingPrompts = await this.getPrompts();
      const existingIds = new Set(existingPrompts.map(p => p.id));
      
      // 过滤重复的 ID，为重复的提示词生成新 ID
      const uniquePrompts = importedPrompts.map(prompt => {
        if (existingIds.has(prompt.id)) {
          return {
            ...prompt,
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date(),
          };
        }
        return prompt;
      });

      const mergedPrompts = [...uniquePrompts, ...existingPrompts];
      await this.savePrompts(mergedPrompts);
    } catch (error) {
      console.error('导入提示词失败:', error);
      throw error;
    }
  }

  // 初始化默认数据
  static async initializeWithMockData(mockPrompts: Prompt[]): Promise<void> {
    try {
      const existingPrompts = await this.getPrompts();
      
      // 只有在没有数据时才初始化
      if (existingPrompts.length === 0) {
        await this.savePrompts(mockPrompts);
        console.log('已初始化默认提示词数据');
      }
    } catch (error) {
      console.error('初始化默认数据失败:', error);
      throw error;
    }
  }

  // 清空所有数据
  static async clearAll(): Promise<void> {
    try {
      await storage.removeItem(`local:${this.PROMPTS_KEY}`);
    } catch (error) {
      console.error('清空数据失败:', error);
      throw error;
    }
  }

  // 获取存储统计信息
  static async getStorageStats(): Promise<{ count: number; totalSize: number }> {
    try {
      const prompts = await this.getPrompts();
      const totalSize = JSON.stringify(prompts).length;
      return {
        count: prompts.length,
        totalSize,
      };
    } catch (error) {
      console.error('获取存储统计失败:', error);
      return { count: 0, totalSize: 0 };
    }
  }
}