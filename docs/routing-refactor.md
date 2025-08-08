# 路由重构文档

## 重构概述

将原本在 DashboardPage 中维护的状态管理重构为独立的路由页面，提高了代码的可维护性和组件职责的清晰度。

## 主要变更

### 1. 路由结构变更

**之前：**
```
/prompts -> DashboardPage (包含 PromptGallery 和 PromptEditor 的状态切换)
```

**现在：**
```
/prompts -> PromptGallery (显示所有 prompts)
/prompts/new -> PromptEditor (新建 prompt)
/prompts/:id/edit -> PromptEditor (编辑指定 prompt)
/docs -> DocsPage (文档页面)
/settings -> SettingsPage (设置页面)
```

### 2. 组件重构

#### PromptGallery
- **之前：** 接收 props (`activeItem`, `prompts`, `onEditPrompt`, `onAddPrompt`)
- **现在：** 独立的路由页面，使用 hooks 获取数据和处理导航
- **变更：** 集成了 Sidebar 组件，使用 `useNavigate` 进行路由导航

#### PromptEditor
- **之前：** 接收 props (`prompt`, `onSave`, `onBack`)
- **现在：** 独立的路由页面，使用 `useParams` 获取路由参数
- **变更：** 使用 `useNavigate` 进行导航，通过 URL 参数判断是新建还是编辑

#### DocsPage & SettingsPage
- **之前：** 使用 DashboardLayout 包装
- **现在：** 独立的路由页面，直接使用 Sidebar 组件
- **变更：** 移除了 props 依赖，使用内部状态管理

### 3. 删除的组件

- `DashboardPage.tsx` - 功能被分散到独立的路由页面
- `DashboardLayout.tsx` - 不再需要，各页面直接使用 Sidebar

### 4. 状态管理简化

**之前：**
```typescript
// DashboardPage 中维护复杂状态
const [currentView, setCurrentView] = useState<'list' | 'edit'>('list');
const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
const [activeItem, setActiveItem] = useState('all');
```

**现在：**
```typescript
// 每个页面独立管理自己的状态
// PromptGallery
const [activeItem, setActiveItem] = useState('all');

// PromptEditor
const { id } = useParams(); // 从 URL 获取编辑的 prompt ID
```

## 优势

1. **职责分离：** 每个页面只负责自己的功能，不再需要维护全局状态
2. **URL 可分享：** 编辑页面的 URL 可以直接分享，支持浏览器前进后退
3. **代码简化：** 移除了复杂的状态管理逻辑
4. **可维护性：** 组件职责更清晰，更容易理解和维护
5. **扩展性：** 新增页面只需要添加路由，不需要修改现有组件

## 路由导航

### 从 PromptGallery 导航
- 点击 "Add Prompt" -> `/prompts/new`
- 点击 PromptCard -> `/prompts/:id/edit`
- 点击 Sidebar 菜单项 -> 相应路由

### 从 PromptEditor 导航
- 点击 "Back" 或 "Cancel" -> `/prompts`
- 保存成功后 -> `/prompts`

## 注意事项

1. 确保所有页面都正确集成了 Sidebar 组件
2. 路由参数的正确处理（如 `:id` 参数）
3. 导航逻辑的一致性
4. 状态管理的正确性（每个页面独立管理自己的状态）
