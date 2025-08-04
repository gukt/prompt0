# React 19 状态管理重构总结

## 重构概述

本次重构将原有的基于 `useState` 的分散状态管理升级为基于 React 19 最佳实践的统一状态管理系统，使用 WXT 跨浏览器存储 API 替代内存存储，实现数据持久化。

## 技术架构

### 1. 状态管理架构

采用 **Context + useReducer + Custom Hooks** 模式：

```
PromptProvider (Context)
├── promptReducer (Reducer)
├── PromptStorageService (Storage)
└── usePrompts (Custom Hook)
```

### 2. 核心文件结构

```
lib/
├── storage.ts                    # WXT 跨浏览器存储服务
├── store/
│   └── promptStore.tsx          # React 状态管理 (Context + Reducer)
└── hooks/
    ├── useAppInitialization.ts  # 应用初始化 Hook
    └── useImportExport.ts       # 导入导出功能 Hook
```

## 核心组件

### 1. PromptStorageService (`lib/storage.ts`)

使用 WXT 的 `storage` API 实现跨浏览器兼容的本地存储：

**主要功能：**

- ✅ 获取/保存所有提示词
- ✅ 添加/更新/删除单个提示词
- ✅ 切换置顶状态
- ✅ 批量导入提示词（自动处理 ID 冲突）
- ✅ 初始化默认数据（仅在首次启动时）
- ✅ 清空所有数据
- ✅ 存储统计信息

**技术特点：**

- 使用 `storage.getItem/setItem` 替代 `chrome.storage.*`
- 自动错误处理和异常捕获
- 支持复杂数据类型的序列化/反序列化

### 2. PromptStore (`lib/store/promptStore.tsx`)

基于 React 19 的状态管理系统：

**状态结构：**

```typescript
interface PromptState {
  prompts: Prompt[];
  loading: boolean;
  error: string | null;
  initialized: boolean;
}
```

**Action 类型：**

- `SET_LOADING` - 设置加载状态
- `SET_ERROR` - 设置错误信息
- `SET_PROMPTS` - 设置提示词列表
- `ADD_PROMPT` - 添加提示词
- `UPDATE_PROMPT` - 更新提示词
- `DELETE_PROMPT` - 删除提示词
- `TOGGLE_PIN` - 切换置顶状态
- `SET_INITIALIZED` - 设置初始化状态
- `CLEAR_ALL` - 清空所有数据

**高级功能：**

- 自动错误处理
- 乐观更新（先更新 UI，再同步存储）
- 加载状态管理
- 初始化状态跟踪

### 3. usePrompts Hook

提供完整的 Prompt 操作接口：

```typescript
const {
  // 状态
  prompts,
  loading,
  error,
  initialized,

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
} = usePrompts();
```

### 4. useAppInitialization Hook (`lib/hooks/useAppInitialization.ts`)

负责应用启动时的数据初始化：

**功能：**

- 检查是否已初始化
- 首次启动时插入 mock 数据
- 提供初始化状态反馈

### 5. useImportExport Hook (`lib/hooks/useImportExport.ts`)

重构后的导入导出功能：

**导出格式：**

- ✅ JSON - 标准格式，包含元数据
- ✅ HTML - 可读性强的网页格式
- ✅ Markdown - 适合文档分享
- ✅ CSV - 表格格式，支持中文 BOM

**导入格式：**

- ✅ JSON - 支持多种 JSON 结构
- ✅ CSV - 自动解析和验证

**特点：**

- 自动数据验证和清理
- 重复 ID 处理
- 错误提示和用户反馈
- 文件类型检查

## 组件更新

### 1. SidePanel 组件重构

**之前：**

```typescript
const [prompts, setPrompts] = useState<Prompt[]>(mockPrompts);
```

**现在：**

```typescript
<PromptProvider>
  <SidePanelContent />
</PromptProvider>
```

### 2. PromptsTab 组件重构

**之前：** 通过 props 接收 prompts 数据

**现在：** 直接使用 `usePrompts()` Hook

```typescript
const { prompts, loading, error, togglePin, deletePrompt } = usePrompts();
```

### 3. SettingsTab 组件重构

**之前：** 本地实现导入导出逻辑

**现在：** 使用 `useImportExport()` Hook

```typescript
const { exportToJSON, handleJSONImport, ... } = useImportExport();
```

### 4. Options 页面重构

**主要变化：**

- 移除本地状态管理逻辑
- 使用 `PromptProvider` 包装
- 简化组件接口

## 数据流

### 1. 应用启动流程

```
App 启动
├── PromptProvider 初始化
├── useAppInitialization 执行
├── 检查本地存储
├── 首次启动 → 插入 mock 数据
└── 加载现有数据
```

### 2. 用户操作流程

```
用户操作 (如：添加提示词)
├── 组件调用 addPrompt()
├── dispatch ADD_PROMPT action
├── UI 立即更新 (乐观更新)
├── 调用 PromptStorageService.addPrompt()
├── 数据持久化到本地存储
└── 错误处理 (如有)
```

## 性能优化

### 1. React 19 特性应用

- ✅ **自动批处理** - 多个状态更新自动合并
- ✅ **并发特性** - 使用 useReducer 支持并发更新
- ✅ **错误边界** - 统一错误处理机制

### 2. 内存优化

- ✅ **单一数据源** - 避免数据重复
- ✅ **按需更新** - 只更新变化的部分
- ✅ **自动清理** - 组件卸载时清理副作用

### 3. 存储优化

- ✅ **批量操作** - 减少存储 I/O
- ✅ **数据压缩** - JSON 序列化优化
- ✅ **错误恢复** - 存储失败时的回退机制

## 兼容性

### 1. 浏览器支持

- ✅ **Chrome** - 完全支持
- ✅ **Firefox** - 完全支持
- ✅ **Edge** - 完全支持
- ✅ **Safari** - 完全支持

### 2. WXT 框架集成

- ✅ 使用 WXT 的 `storage` API
- ✅ 支持 Manifest V2 和 V3
- ✅ 跨浏览器兼容性自动处理

## 测试建议

### 1. 单元测试

```typescript
// 测试 PromptStorageService
describe('PromptStorageService', () => {
  test('should save and retrieve prompts', async () => {
    // 测试存储和读取
  });
});

// 测试 promptReducer
describe('promptReducer', () => {
  test('should handle ADD_PROMPT action', () => {
    // 测试 reducer 逻辑
  });
});
```

### 2. 集成测试

```typescript
// 测试完整的数据流
describe('Prompt Management Flow', () => {
  test('should add prompt and persist to storage', async () => {
    // 测试从 UI 操作到数据持久化的完整流程
  });
});
```

## 迁移指南

### 1. 现有组件迁移

**步骤：**

1. 移除本地 `useState` 状态
2. 添加 `PromptProvider` 包装
3. 使用 `usePrompts()` Hook
4. 更新组件接口

### 2. 数据迁移

**自动处理：**

- 首次启动时自动插入 mock 数据
- 现有数据自动迁移到新格式
- 兼容旧版本数据结构

## 未来扩展

### 1. 可能的增强功能

- 🔄 **数据同步** - 支持云端同步
- 🔍 **全文搜索** - 基于索引的快速搜索
- 📊 **使用统计** - 提示词使用频率分析
- 🏷️ **智能标签** - AI 驱动的自动标签
- 📱 **离线支持** - PWA 离线功能

### 2. 性能优化方向

- 🚀 **虚拟化列表** - 大量数据时的性能优化
- 💾 **增量同步** - 只同步变更的数据
- 🗜️ **数据压缩** - 存储空间优化
- ⚡ **懒加载** - 按需加载数据

## 总结

本次重构成功实现了：

1. ✅ **统一状态管理** - 使用 React 19 最佳实践
2. ✅ **数据持久化** - WXT 跨浏览器存储
3. ✅ **完整 CRUD** - 增删改查和导入导出
4. ✅ **自动初始化** - mock 数据自动插入
5. ✅ **错误处理** - 完善的异常处理机制
6. ✅ **性能优化** - 乐观更新和批量操作
7. ✅ **类型安全** - 完整的 TypeScript 支持

重构后的系统更加健壮、可维护，为后续功能扩展奠定了坚实基础。
