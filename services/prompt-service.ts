import { storage } from '#imports';
import { Prompt } from '../lib/types';

// WXT 跨浏览器存储服务 - 重构为单独存储每条 prompt
export class PromptStorageService {
  private static readonly PROMPTS_PREFIX = 'prompt:';
  private static readonly PROMPTS_INDEX_KEY = 'prompts_index';

  // 获取所有提示词 ID
  private static async getPromptIds(): Promise<string[]> {
    try {
      const ids = await storage.getItem<string[]>(`local:${this.PROMPTS_INDEX_KEY}`);
      return ids || [];
    } catch (error) {
      console.error('获取提示词 ID 列表失败:', error);
      return [];
    }
  }

  // 保存提示词 ID 列表
  private static async savePromptIds(ids: string[]): Promise<void> {
    try {
      await storage.setItem(`local:${this.PROMPTS_INDEX_KEY}`, ids);
    } catch (error) {
      console.error('保存提示词 ID 列表失败:', error);
      throw error;
    }
  }

  // 获取单个提示词
  static async getPrompt(id: string): Promise<Prompt | null> {
    try {
      const prompt = await storage.getItem<Prompt>(`local:${this.PROMPTS_PREFIX}${id}`);
      return prompt || null;
    } catch (error) {
      console.error('获取提示词失败:', error);
      return null;
    }
  }

  // 保存单个提示词
  static async savePrompt(prompt: Prompt): Promise<void> {
    try {
      await storage.setItem(`local:${this.PROMPTS_PREFIX}${prompt.id}`, prompt);
    } catch (error) {
      console.error('保存提示词失败:', error);
      throw error;
    }
  }

  // 删除单个提示词
  static async deletePrompt(id: string): Promise<void> {
    try {
      await storage.removeItem(`local:${this.PROMPTS_PREFIX}${id}`);
      // 从索引中移除
      const ids = await this.getPromptIds();
      const updatedIds = ids.filter(promptId => promptId !== id);
      await this.savePromptIds(updatedIds);
    } catch (error) {
      console.error('删除提示词失败:', error);
      throw error;
    }
  }

  // 获取所有提示词
  static async getPrompts(): Promise<Prompt[]> {
    try {
      const ids = await this.getPromptIds();
      const prompts: Prompt[] = [];

      for (const id of ids) {
        const prompt = await this.getPrompt(id);
        if (prompt) {
          prompts.push(prompt);
        }
      }

      // 按创建时间倒序排列
      return prompts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error('获取所有提示词失败:', error);
      return [];
    }
  }

  // 添加单个提示词
  static async addPrompt(prompt: Omit<Prompt, 'id' | 'createdAt'>): Promise<Prompt> {
    try {
      const newPrompt: Prompt = {
        ...prompt,
        id: Date.now().toString(),
        createdAt: new Date(),
      };

      // 保存提示词
      await this.savePrompt(newPrompt);

      // 添加到索引
      const ids = await this.getPromptIds();
      ids.unshift(newPrompt.id); // 添加到开头
      await this.savePromptIds(ids);

      return newPrompt;
    } catch (error) {
      console.error('添加提示词失败:', error);
      throw error;
    }
  }

  // 更新提示词
  static async updatePrompt(id: string, updates: Partial<Prompt>): Promise<void> {
    try {
      const prompt = await this.getPrompt(id);
      if (!prompt) {
        throw new Error('提示词不存在');
      }

      const updatedPrompt: Prompt = {
        ...prompt,
        ...updates,
        updatedAt: new Date(),
      };

      await this.savePrompt(updatedPrompt);
    } catch (error) {
      console.error('更新提示词失败:', error);
      throw error;
    }
  }

  // 批量导入提示词
  static async importPrompts(importedPrompts: Prompt[]): Promise<void> {
    try {
      const existingIds = await this.getPromptIds();
      const existingIdsSet = new Set(existingIds);

      // 过滤重复的 ID，为重复的提示词生成新 ID
      const uniquePrompts = importedPrompts.map(prompt => {
        if (existingIdsSet.has(prompt.id)) {
          return {
            ...prompt,
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date(),
          };
        }
        return prompt;
      });

      // 保存每个提示词
      for (const prompt of uniquePrompts) {
        await this.savePrompt(prompt);
      }

      // 更新索引
      const newIds = uniquePrompts.map(p => p.id);
      const updatedIds = [...newIds, ...existingIds];
      await this.savePromptIds(updatedIds);
    } catch (error) {
      console.error('导入提示词失败:', error);
      throw error;
    }
  }

  // 初始化默认数据
  static async initializeWithMockData(mockPrompts: Prompt[]): Promise<void> {
    try {
      const existingIds = await this.getPromptIds();

      // 只有在没有数据时才初始化
      if (existingIds.length === 0) {
        for (const prompt of mockPrompts) {
          await this.savePrompt(prompt);
        }
        const ids = mockPrompts.map(p => p.id);
        await this.savePromptIds(ids);
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
      const ids = await this.getPromptIds();

      // 删除所有提示词
      for (const id of ids) {
        await storage.removeItem(`local:${this.PROMPTS_PREFIX}${id}`);
      }

      // 删除索引
      await storage.removeItem(`local:${this.PROMPTS_INDEX_KEY}`);
    } catch (error) {
      console.error('清空数据失败:', error);
      throw error;
    }
  }

  // 获取存储统计信息
  static async getStorageStats(): Promise<{ count: number; totalSize: number }> {
    try {
      const ids = await this.getPromptIds();
      let totalSize = 0;

      for (const id of ids) {
        const prompt = await this.getPrompt(id);
        if (prompt) {
          totalSize += JSON.stringify(prompt).length;
        }
      }

      return {
        count: ids.length,
        totalSize,
      };
    } catch (error) {
      console.error('获取存储统计失败:', error);
      return { count: 0, totalSize: 0 };
    }
  }

  // 迁移旧数据（如果需要）
  static async migrateFromOldFormat(): Promise<void> {
    try {
      // 检查是否存在旧格式的数据
      const oldPrompts = await storage.getItem<Prompt[]>(`local:prompts`);
      if (oldPrompts && oldPrompts.length > 0) {
        console.log('检测到旧格式数据，开始迁移...');

        // 保存每个提示词到新格式
        for (const prompt of oldPrompts) {
          await this.savePrompt(prompt);
        }

        // 创建索引
        const ids = oldPrompts.map(p => p.id);
        await this.savePromptIds(ids);

        // 删除旧数据
        await storage.removeItem(`local:prompts`);

        console.log('数据迁移完成');
      }
    } catch (error) {
      console.error('数据迁移失败:', error);
      throw error;
    }
  }

  // 测试方法 - 验证存储功能
  static async testStorage(): Promise<boolean> {
    try {
      // 清空测试数据
      await this.clearAll();

      // 测试添加
      const testPrompt = await this.addPrompt({
        title: '测试提示词',
        content: '这是一个测试提示词',
      });

      // 测试获取单个
      const retrieved = await this.getPrompt(testPrompt.id);
      if (!retrieved || retrieved.title !== '测试提示词') {
        throw new Error('获取单个提示词失败');
      }

      // 测试获取所有
      const allPrompts = await this.getPrompts();
      if (allPrompts.length !== 1) {
        throw new Error('获取所有提示词失败');
      }

      // 测试更新
      await this.updatePrompt(testPrompt.id, { title: '更新的测试提示词' });
      const updated = await this.getPrompt(testPrompt.id);
      if (updated?.title !== '更新的测试提示词') {
        throw new Error('更新提示词失败');
      }

      // 测试删除
      await this.deletePrompt(testPrompt.id);
      const deleted = await this.getPrompt(testPrompt.id);
      if (deleted !== null) {
        throw new Error('删除提示词失败');
      }

      // 清理
      await this.clearAll();

      console.log('存储测试通过');
      return true;
    } catch (error) {
      console.error('存储测试失败:', error);
      return false;
    }
  }
}