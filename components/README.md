# 组件库

## 导入导出按钮组件

### ExportButton

导出按钮组件，支持多种格式导出。

#### 使用方法

```tsx
import { ExportButton } from '@/components/ExportButton';

// 基本使用
<ExportButton />

// 自定义样式
<ExportButton 
  variant="outline" 
  size="sm" 
  className="w-full" 
/>
```

#### 支持的导出格式

- JSON
- HTML
- Markdown
- CSV

#### Props

- `className?: string` - 自定义 CSS 类名
- `variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive'` - 按钮样式变体
- `size?: 'default' | 'sm' | 'lg' | 'icon'` - 按钮大小

### ImportButton

导入按钮组件，支持多种格式导入。

#### 使用方法

```tsx
import { ImportButton } from '@/components/ImportButton';

// 基本使用
<ImportButton />

// 自定义样式
<ImportButton 
  variant="outline" 
  size="sm" 
  className="w-full" 
/>
```

#### 支持的导入格式

- JSON
- CSV

#### Props

- `className?: string` - 自定义 CSS 类名
- `variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive'` - 按钮样式变体
- `size?: 'default' | 'sm' | 'lg' | 'icon'` - 按钮大小

## 特性

- 🎨 完全可定制的样式
- 📱 响应式设计
- ♿ 无障碍访问支持
- 🎯 类型安全
- 🔧 易于集成

## 依赖

- React 19+
- Lucide React (图标)
- Tailwind CSS
- Shadcn/ui 组件库 