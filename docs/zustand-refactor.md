# Zustand 状态管理重构

## 重构概述

本次重构将原有的基于 Context + useReducer 的状态管理升级为基于 Zustand 的统一状态管理系统，同时保持了原有的 API 兼容性，使现有组件能够平滑过渡。

## 技术架构

### 1. 状态管理架构

采用 **Zustand + Custom Hooks** 模式：

```
zustand store
├── promptStore (Zustand store)
├── settingsStore (Zustand store)
└── Custom Hooks (兼容层)
    ├── usePrompts
    └── useSettings
```

### 2. 核心文件结构

```
stores/
├── promptStore.ts      # Prompt 相关状态管理
└── settingsStore.ts    # 设置相关状态管理
hooks/
├── usePrompts.ts       # Prompt 操作 Hook (兼容层)
└── useSettings.ts      # 设置操作 Hook
```

## 重构优势

1. **性能优化**
   - 减少不必要的重渲染
   - 更细粒度的状态订阅
   - 更高效的状态更新

2. **开发体验**
   - 简化的 API，无需 Context 和 Reducer
   - 内置的状态选择器
   - TypeScript 友好的类型推导

3. **代码简化**
   - 移除了大量样板代码
   - 统一的状态管理模式
   - 更直观的状态访问方式

4. **可维护性**
   - 集中式状态管理
   - 清晰的状态更新逻辑
   - 易于调试和测试

## 使用示例

### 1. 在组件中使用 Zustand store

```tsx
import { usePromptStore } from '@/stores/promptStore';

function MyComponent() {
  // 直接从 store 中获取状态和方法
  const { prompts, addPrompt } = usePromptStore();
  
  return (
    <div>
      {prompts.map(prompt => (
        <div key={prompt.id}>{prompt.title}</div>
      ))}
      <button onClick={() => addPrompt({ title: '新提示词', content: '内容', tags: [] })}>
        添加提示词
      </button>
    </div>
  );
}
```

### 2. 使用兼容层 Hook

```tsx
import { usePrompts } from '@/hooks/usePrompts';

function MyComponent() {
  // 使用兼容层 Hook，API 与之前相同
  const { prompts, addPrompt } = usePrompts();
  
  return (
    <div>
      {prompts.map(prompt => (
        <div key={prompt.id}>{prompt.title}</div>
      ))}
      <button onClick={() => addPrompt({ title: '新提示词', content: '内容', tags: [] })}>
        添加提示词
      </button>
    </div>
  );
}
```

### 3. 使用选择器优化性能

```tsx
import { usePromptStore } from '@/stores/promptStore';

function PinnedPrompts() {
  // 只订阅置顶的提示词，其他状态变化不会触发重渲染
  const pinnedPrompts = usePromptStore(state => 
    state.prompts.filter(prompt => prompt.isPinned)
  );
  
  return (
    <div>
      <h2>置顶提示词</h2>
      {pinnedPrompts.map(prompt => (
        <div key={prompt.id}>{prompt.title}</div>
      ))}
    </div>
  );
}
```

## 迁移指南

1. 对于新组件，推荐直接使用 Zustand store：
   ```tsx
   import { usePromptStore } from '@/stores/promptStore';
   import { useSettingsStore } from '@/stores/settingsStore';
   ```

2. 对于现有组件，可以继续使用兼容层 Hook：
   ```tsx
   import { usePrompts } from '@/hooks/usePrompts';
   import { useSettings } from '@/hooks/useSettings';
   ```

3. 不再需要 Context Provider：
   - 移除了 `<PromptProvider>` 包装
   - 应用启动时自动初始化状态

## 未来展望

1. **持久化中间件**
   - 可以添加 Zustand 持久化中间件，进一步简化存储逻辑

2. **开发工具集成**
   - 集成 Redux DevTools 进行状态调试

3. **状态分片**
   - 根据功能模块进一步拆分状态
   - 实现更细粒度的状态管理
