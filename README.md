
# Prompt Manager - 浏览器扩展提示词管理器

一个专为重度 AI 聊天用户设计的浏览器扩展，帮助用户高效管理和使用提示词，减少重复输入，提升工作效率。

## ✨ 功能特性

### 🎯 核心功能
- **提示词管理**: 创建、编辑、删除提示词，支持批量操作
- **变量系统**: 支持文本、单选、多选变量，让提示词更灵活
- **标签管理**: 预设常用标签，支持自定义标签分类
- **侧边栏检索**: 快速搜索和选择提示词，一键应用到聊天框
- **导入导出**: JSON 格式数据交换，支持批量导入导出

### 🎨 用户体验
- **现代界面**: 基于 TailwindCSS + Shadcn/ui 的暗色主题设计
- **快速响应**: 启动时间 < 500ms，搜索响应 < 200ms
- **跨浏览器**: 支持 Chrome、Firefox、Edge、Safari
- **无障碍访问**: 支持键盘导航和屏幕阅读器

### 🔧 技术特性
- **类型安全**: 基于 TypeScript 5.8+ 的严格类型检查
- **现代框架**: 使用 WXT + React 19 最新技术栈
- **性能优化**: 代码分割、虚拟化列表、懒加载
- **数据安全**: 本地存储，支持数据加密

## 🚀 快速开始

### 环境要求
- Node.js 18+
- pnpm 8+

### 安装和运行
```bash
# 克隆项目
git clone <repository-url>
cd prompt-manager

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 构建 Firefox 版本
pnpm build:firefox
```

### 开发命令
```bash
# 开发模式 (Chrome)
pnpm dev

# 开发模式 (Firefox)
pnpm dev:firefox

# 构建扩展
pnpm build

# 打包扩展
pnpm zip

# 类型检查
pnpm compile
```

## 📁 项目结构

```
├── entrypoints/          # 扩展入口点
│   ├── popup/           # 弹出窗口
│   ├── sidebar/         # 侧边栏
│   └── content/         # 内容脚本
├── components/          # React 组件
│   ├── ui/             # 基础 UI 组件 (Shadcn)
│   ├── features/       # 功能组件
│   └── shared/         # 共享组件
├── hooks/              # 自定义 React Hooks
├── composables/        # 组合式函数
├── utils/              # 工具函数
├── types/              # TypeScript 类型定义
├── constants/          # 常量定义
├── assets/             # 静态资源
├── PROJECT_RULES.md    # 项目规则文档
├── DEVELOPMENT_GUIDE.md # 开发指南
└── README.md           # 项目说明
```

## 🎯 使用场景

### 目标用户
- 经常在不同 AI 平台间切换的用户
- 需要重复使用特定提示词的专业人士
- 希望统一管理提示词库的用户

### 典型使用流程
1. **创建提示词**: 在侧边栏中创建新的提示词，设置变量和标签
2. **管理标签**: 使用预设标签或自定义标签对提示词进行分类
3. **快速检索**: 通过搜索或标签筛选快速找到需要的提示词
4. **一键应用**: 点击提示词直接应用到当前页面的聊天框
5. **数据同步**: 导入导出功能支持数据备份和迁移

## 🔧 技术栈

### 核心技术
- **框架**: WXT (Web Extension Toolkit) + React 19
- **语言**: TypeScript 5.8+
- **样式**: TailwindCSS + Shadcn/ui
- **状态管理**: React Hooks
- **存储**: Chrome Storage API

### 开发工具
- **包管理器**: pnpm
- **代码规范**: ESLint + Prettier
- **类型检查**: TypeScript strict mode
- **构建工具**: WXT 内置构建系统

## 📊 数据模型

### 提示词结构
```typescript
interface Prompt {
  id: string;
  title: string;
  content: string;
  variables: Variable[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  version: number;
  metadata: {
    author?: string;
    source?: string;
    description?: string;
  };
}
```

### 变量类型
- **文本变量**: 自由输入文本
- **单选变量**: 从预设选项中选择
- **多选变量**: 可选择多个选项

### 预设标签
职业、商业、工具、语言、办公、通用、写作、编程、情感、教育、差异、学术、设计、艺术、娱乐、生活、翻译、文案

## 🚀 开发指南

详细的开发指南请查看 [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)

### 开发规范
- 使用 TypeScript 严格模式
- 遵循 React Hooks 最佳实践
- 使用 TailwindCSS 进行样式开发
- 遵循组件化开发原则

### 测试策略
- 单元测试覆盖核心逻辑
- 组件测试验证 UI 交互
- E2E 测试覆盖关键用户流程

## 📦 发布流程

### 构建扩展
```bash
# 构建 Chrome 版本
pnpm build

# 构建 Firefox 版本
pnpm build:firefox

# 打包扩展
pnpm zip
```

### 浏览器商店发布
1. 构建生产版本
2. 压缩扩展文件
3. 提交到各浏览器扩展商店
4. 等待审核通过

## 🤝 贡献指南

### 开发环境设置
1. Fork 项目
2. 创建功能分支
3. 提交代码变更
4. 创建 Pull Request

### 代码规范
- 使用 Conventional Commits
- 遵循 TypeScript 严格模式
- 添加必要的测试用例
- 更新相关文档

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](./LICENSE) 文件了解详情。

## 🙏 致谢

- [WXT](https://wxt.dev/) - 优秀的浏览器扩展开发框架
- [Shadcn/ui](https://ui.shadcn.com/) - 精美的 UI 组件库
- [TailwindCSS](https://tailwindcss.com/) - 实用的 CSS 框架

---

**Prompt Manager** - 让提示词管理变得简单高效 🚀
