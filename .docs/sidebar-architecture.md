# Sidebar 架构文档

## 📁 文件结构

重新组织后的 Sidebar 功能遵循了与 popup 目录相同的结构和命名规范：

### 入口点文件 (`entrypoints/sidebar-ui/`)

```
entrypoints/sidebar-ui/
├── App.tsx          # 主应用组件，导入并使用 @/components 中的组件
├── main.tsx         # React 应用入口点，包含 ReactDOM 渲染逻辑
├── App.css          # 应用特定样式
└── style.css        # 全局样式定义
```

### HTML 入口点

```
entrypoints/
└── sidebar-ui.html  # Sidebar 的 HTML 入口文件
```

### Content Script

```
entrypoints/sidebar.content/
└── index.ts         # 负责在页面中注入 sidebar 的 content script
```

### React 组件 (`components/`)

```
components/
├── sidebar-app.tsx      # 主 Sidebar 应用组件
├── sidebar-header.tsx   # Sidebar 头部组件
├── sidebar-tabs.tsx     # 标签页切换组件
├── prompt-list.tsx      # 提示词列表组件
├── prompt-item.tsx      # 单个提示词项组件
├── prompt-stats.tsx     # 提示词统计组件
└── sidebar-settings.tsx # 设置页面组件
```

### 类型定义和数据 (`lib/`)

```
lib/
├── types.ts         # TypeScript 类型定义
└── mock-data.ts     # 模拟数据
```

## 🏗️ 组件架构

### 组件层次结构

```
SidebarApp (主容器)
├── SidebarHeader (头部)
├── SidebarTabs (标签页)
├── PromptList (提示词列表)
│   ├── PromptStats (统计信息)
│   └── PromptItem[] (提示词项列表)
└── SidebarSettings (设置页面)
```

### 数据流

1. **mock-data.ts** 提供模拟数据
2. **types.ts** 定义数据类型
3. 组件通过 props 传递数据
4. 状态管理在 SidebarApp 中集中处理

## 🎨 样式组织

### CSS 文件分工

- **style.css**: 全局样式、重置样式、基础布局
- **App.css**: 应用特定样式、工具类样式
- **Tailwind CSS**: 组件内联样式，通过 `@/assets/tailwind.css` 导入

### 样式优先级

1. Tailwind CSS 工具类（最高优先级）
2. App.css 中的自定义样式
3. style.css 中的全局样式

## 🔧 技术选型

### 核心技术

- **WXT**: 跨浏览器扩展开发框架
- **React 19**: UI 组件库
- **TypeScript**: 类型安全
- **Tailwind CSS**: 样式框架
- **shadcn/ui**: UI 组件库

### 构建优化

- 组件模块化减少了包体积：从 720.14 kB 减少到 271.77 kB
- 按需导入避免了不必要的代码
- TypeScript 提供了更好的开发体验

## 🚀 使用方式

### 开发模式

```bash
pnpm run dev
```

### 构建生产版本

```bash
pnpm run build
```

### 加载扩展

1. 打开浏览器扩展管理页面
2. 启用开发者模式
3. 加载 `.output/chrome-mv3` 目录

## 🎯 功能特性

### 用户交互

- ✅ 点击扩展图标切换显示/隐藏
- ✅ 快捷键 `Ctrl/Cmd + M` 切换
- ✅ `ESC` 键关闭
- ✅ 点击遮罩层关闭
- ✅ 点击关闭按钮关闭

### 界面功能

- ✅ Recent Prompts 和 Settings 两个标签页
- ✅ 提示词的展示和交互
- ✅ 统计信息显示
- ✅ 设置页面的各种配置选项

### 技术特性

- ✅ 全页面支持 (`<all_urls>`)
- ✅ 跨浏览器兼容
- ✅ 响应式设计
- ✅ 类型安全
- ✅ 组件化架构

## 📋 对比优势

### 相比之前的实现

1. **更好的代码组织**: 遵循了与 popup 相同的结构
2. **更小的包体积**: 通过模块化减少了 62% 的体积
3. **更好的可维护性**: 组件分离，职责清晰
4. **更好的类型安全**: TypeScript 类型定义
5. **更好的开发体验**: 组件热更新，快速开发

### 遵循的最佳实践

1. **关注点分离**: UI 组件、业务逻辑、样式分离
2. **可重用性**: 组件可在其他地方复用
3. **类型安全**: 完整的 TypeScript 类型定义
4. **一致性**: 与项目其他部分保持一致的结构
