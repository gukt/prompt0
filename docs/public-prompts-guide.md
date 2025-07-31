# Public Prompt Library（公共提示词库）功能让您可以探索和使用来自 功能使用指南

## 概述

Public Prompt Library（公共提示词库）功能让您可以探索和使用来自 [Cherry Studio](https://github.com/CherryHQ/cherry-studio) 的精选提示词库。这个功能提供了一个无侧边栏的全屏浏览体验，专注于提示词的发现和管理。

## 功能特性

### 1. 浏览提示词库

- 包含 12+ 个精选的专业提示词
- 涵盖职业、商业、技术、设计等多个领域
- 每个提示词都有详细的角色定义和使用说明

### 2. 搜索和筛选

- **全文搜索**：在标题、内容和标签中搜索关键词
- **标签筛选**：按照不同的分类标签筛选提示词
- **实时统计**：显示当前筛选结果的数量

### 3. 提示词操作

- **复制**：一键复制提示词内容到剪贴板
- **导入**：将提示词导入到您的个人提示词库
- **预览**：查看提示词的部分内容和标签

### 4. 数据导入

- **导入完整数据**：支持从 Cherry Studio 的 agents.json 文件导入完整的提示词库
- **动态更新**：导入后立即更新界面显示

## 使用方法

### 访问 Prompt Library 页面

1. 在顶部导航栏中点击 "Prompt Library" 标签
2. 页面会切换到无侧边栏的全屏布局
3. 开始浏览和搜索提示词

### 搜索提示词

1. 在搜索框中输入关键词
2. 系统会实时筛选匹配的提示词
3. 搜索范围包括标题、内容和标签

### 使用标签筛选

1. 在标签区域点击感兴趣的标签
2. 只显示包含该标签的提示词
3. 再次点击标签可以取消筛选

### 复制和导入提示词

1. **复制**：点击 "复制" 按钮将提示词内容复制到剪贴板
2. **导入**：点击 "导入" 按钮将提示词添加到您的个人库中
3. 导入后的提示词会出现在 Dashboard 的 "all" 分类中

### 导入完整数据

1. 点击页面右上角的 "导入完整数据" 按钮
2. 选择 Cherry Studio 的 agents.json 文件
3. 系统会自动解析并显示所有提示词

## 数据来源

提示词数据来源于 [Cherry Studio](https://github.com/CherryHQ/cherry-studio) 项目的 agents.json 文件：

- **项目地址**：https://github.com/CherryHQ/cherry-studio
- **数据文件**：resources/data/agents.json
- **许可证**：遵循 Cherry Studio 项目的开源许可证

## 技术实现

### 数据结构转换

```typescript
// Cherry Studio 原始格式
interface CherryAgent {
  id: string;
  name: string;
  emoji: string;
  group: string[];
  prompt: string;
  description: string;
}

// 转换为项目的 Prompt 格式
interface Prompt {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  isPinned?: boolean;
}
```

### 文件结构

```
lib/
├── sample-agents.ts     # 示例提示词数据
├── agents-data.ts       # 数据转换逻辑（备用）
└── agents.json         # 完整的 agents 数据文件

entrypoints/newtab/components/
└── PublicPromptsPage.tsx # 主要组件
```

## 注意事项

1. **初始数据**：页面默认加载 12 个示例提示词
2. **完整数据**：需要手动导入 agents.json 文件来获取完整的提示词库
3. **数据持久化**：导入的数据仅在当前会话中有效，刷新页面会恢复到示例数据
4. **兼容性**：支持现代浏览器的文件选择和 JSON 解析功能

## 未来计划

- [ ] 添加提示词收藏功能
- [ ] 支持自定义标签
- [ ] 添加提示词评分和评论
- [ ] 支持多语言提示词
- [ ] 集成在线提示词库更新
