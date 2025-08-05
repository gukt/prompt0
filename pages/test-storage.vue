<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">存储功能测试</h1>
    
    <div class="space-y-4">
      <!-- 测试按钮 -->
      <div class="flex gap-4">
        <Button @click="runTest" :disabled="testing">
          {{ testing ? '测试中...' : '运行存储测试' }}
        </Button>
        <Button @click="testMigration" :disabled="testing">
          测试数据迁移
        </Button>
        <Button @click="clearAll" variant="destructive">
          清空所有数据
        </Button>
      </div>

      <!-- 测试结果 -->
      <div v-if="testResult" class="p-4 rounded-lg" :class="testResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
        <h3 class="font-semibold">{{ testResult.success ? '测试通过' : '测试失败' }}</h3>
        <p class="text-sm mt-1">{{ testResult.message }}</p>
      </div>

      <!-- 当前数据 -->
      <div class="border rounded-lg p-4">
        <h3 class="font-semibold mb-2">当前存储数据</h3>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span>提示词数量:</span>
            <span class="font-mono">{{ stats.count }}</span>
          </div>
          <div class="flex justify-between">
            <span>总大小:</span>
            <span class="font-mono">{{ stats.totalSize }} bytes</span>
          </div>
        </div>
      </div>

      <!-- 提示词列表 -->
      <div v-if="prompts.length > 0" class="border rounded-lg p-4">
        <h3 class="font-semibold mb-2">当前提示词</h3>
        <div class="space-y-2">
          <div v-for="prompt in prompts" :key="prompt.id" class="p-3 border rounded bg-gray-50">
            <div class="flex justify-between items-start">
              <div>
                <h4 class="font-medium">{{ prompt.title }}</h4>
                <p class="text-sm text-gray-600 mt-1">{{ prompt.content.substring(0, 100) }}...</p>
                <div class="flex gap-1 mt-2">
                  <Badge v-for="tag in prompt.tags" :key="tag" variant="secondary" class="text-xs">
                    {{ tag }}
                  </Badge>
                </div>
              </div>
              <div class="text-xs text-gray-500">
                {{ new Date(prompt.createdAt).toLocaleString() }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Prompt } from '@/lib/types';
import { PromptStorageService } from '@/services/prompt-service';
import { onMounted, ref } from 'vue';

const testing = ref(false);
const testResult = ref<{ success: boolean; message: string } | null>(null);
const prompts = ref<Prompt[]>([]);
const stats = ref({ count: 0, totalSize: 0 });

const runTest = async () => {
  testing.value = true;
  testResult.value = null;
  
  try {
    const success = await PromptStorageService.testStorage();
    testResult.value = {
      success,
      message: success ? '所有存储功能测试通过' : '存储功能测试失败，请查看控制台'
    };
  } catch (error) {
    testResult.value = {
      success: false,
      message: `测试失败: ${error instanceof Error ? error.message : '未知错误'}`
    };
  } finally {
    testing.value = false;
    await loadData();
  }
};

const testMigration = async () => {
  testing.value = true;
  testResult.value = null;
  
  try {
    // 创建一些旧格式的测试数据
    const oldFormatData: Prompt[] = [
      {
        id: 'test-1',
        title: '迁移测试 1',
        content: '这是迁移测试数据 1',
        tags: ['迁移', '测试'],
        createdAt: new Date(),
      },
      {
        id: 'test-2',
        title: '迁移测试 2',
        content: '这是迁移测试数据 2',
        tags: ['迁移', '测试'],
        createdAt: new Date(),
      }
    ];
    
    // 直接写入旧格式
    const { storage } = await import('#imports');
    await storage.setItem('local:prompts', oldFormatData);
    
    // 执行迁移
    await PromptStorageService.migrateFromOldFormat();
    
    testResult.value = {
      success: true,
      message: '数据迁移测试完成'
    };
  } catch (error) {
    testResult.value = {
      success: false,
      message: `迁移测试失败: ${error instanceof Error ? error.message : '未知错误'}`
    };
  } finally {
    testing.value = false;
    await loadData();
  }
};

const clearAll = async () => {
  testing.value = true;
  try {
    await PromptStorageService.clearAll();
    testResult.value = {
      success: true,
      message: '所有数据已清空'
    };
  } catch (error) {
    testResult.value = {
      success: false,
      message: `清空失败: ${error instanceof Error ? error.message : '未知错误'}`
    };
  } finally {
    testing.value = false;
    await loadData();
  }
};

const loadData = async () => {
  try {
    prompts.value = await PromptStorageService.getPrompts();
    stats.value = await PromptStorageService.getStorageStats();
  } catch (error) {
    console.error('加载数据失败:', error);
  }
};

onMounted(() => {
  loadData();
});
</script> 