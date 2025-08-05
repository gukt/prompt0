# 存储系统重构说明

## 重构背景

原来的存储系统将所有 prompt 保存在一个 `prompts` key 中，每次修改任何一条 prompt 都需要全量保存整个数组。这种方式存在以下问题：

1. **性能问题**: 每次修改都需要读取和保存整个数组，随着数据量增长性能会下降
2. **并发问题**: 多个操作同时进行时可能出现数据覆盖
3. **存储效率**: 即使只修改一条数据，也要保存所有数据

## 重构方案

### 新的存储结构

```
local:prompt:1234567890 -> { id: "1234567890", title: "...", content: "...", ... }
local:prompt:1234567891 -> { id: "1234567891", title: "...", content: "...", ... }
local:prompts_index -> ["1234567890", "1234567891", ...]
```

### 主要改进

1. **单独存储**: 每条 prompt 使用独立的 key 存储
2. **索引管理**: 使用 `prompts_index` 维护所有 prompt 的 ID 列表
3. **原子操作**: 每次只操作单条数据，避免全量保存
4. **向后兼容**: 提供数据迁移功能，自动将旧格式数据迁移到新格式

### API 变化

所有公共 API 保持不变，确保现有代码无需修改：

```typescript
// 这些方法的使用方式完全不变
await PromptStorageService.getPrompts();
await PromptStorageService.addPrompt(promptData);
await PromptStorageService.updatePrompt(id, updates);
await PromptStorageService.deletePrompt(id);
await PromptStorageService.togglePin(id);
```

### 新增功能

1. **单个 prompt 操作**:

   ```typescript
   // 获取单个 prompt
   const prompt = await PromptStorageService.getPrompt(id);

   // 保存单个 prompt
   await PromptStorageService.savePrompt(prompt);
   ```

2. **数据迁移**:

   ```typescript
   // 自动迁移旧格式数据
   await PromptStorageService.migrateFromOldFormat();
   ```

3. **存储测试**:
   ```typescript
   // 验证存储功能
   const success = await PromptStorageService.testStorage();
   ```

## 性能对比

### 修改单条 prompt 的性能

| 操作     | 旧方式             | 新方式         | 改进     |
| -------- | ------------------ | -------------- | -------- |
| 读取     | 读取整个数组       | 读取单条数据   | 大幅提升 |
| 保存     | 保存整个数组       | 保存单条数据   | 大幅提升 |
| 内存使用 | 加载所有数据到内存 | 只加载单条数据 | 显著减少 |

### 数据量增长的影响

假设有 1000 条 prompt，每条平均 1KB：

- **旧方式**: 每次修改需要读写 1MB 数据
- **新方式**: 每次修改只需要读写 1KB 数据
- **性能提升**: 约 1000 倍

## 数据迁移

### 自动迁移

应用启动时会自动检测并迁移旧格式数据：

1. 检查是否存在 `local:prompts` 键
2. 如果存在，读取旧格式数据
3. 将每条 prompt 保存到新的独立 key 中
4. 创建 `prompts_index` 索引
5. 删除旧格式数据

### 手动迁移

如果需要手动触发迁移：

```typescript
await PromptStorageService.migrateFromOldFormat();
```

## 测试验证

### 测试页面

访问 `/test-storage` 页面可以：

1. 运行完整的存储功能测试
2. 测试数据迁移功能
3. 查看当前存储状态
4. 清空所有数据

### 测试方法

```typescript
// 运行自动化测试
const success = await PromptStorageService.testStorage();
```

## 兼容性

- ✅ 所有现有 API 保持不变
- ✅ 自动数据迁移
- ✅ 现有组件无需修改
- ✅ 向后兼容

## 注意事项

1. **首次启动**: 如果存在旧数据，首次启动会进行迁移，可能需要稍长时间
2. **存储空间**: 新方式会占用稍多的存储空间（因为索引开销），但性能提升显著
3. **调试**: 可以在浏览器开发者工具的 Application 标签页中查看新的存储结构

## 未来优化

1. **批量操作**: 可以添加批量操作 API 来优化大量数据的处理
2. **缓存机制**: 可以添加内存缓存来进一步提升性能
3. **压缩存储**: 可以考虑对大型 prompt 内容进行压缩存储
