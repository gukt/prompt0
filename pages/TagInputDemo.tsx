import { TagInput } from '@/components/TagInput';
import { Card } from '@/components/ui/card';
import { useState } from 'react';

export function TagInputDemo() {
  const [tags1, setTags1] = useState<string[]>(['Development', 'React']);
  const [tags2, setTags2] = useState<string[]>([]);
  const [tags3, setTags3] = useState<string[]>(['Design', 'UI/UX', 'Product']);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">TagInput 组件演示</h1>
        <p className="text-muted-foreground">
          类似 macOS 提醒事项 app 的标签输入体验，支持键盘导航、智能建议和复杂的删除逻辑。
        </p>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">基础用法</h2>
            <p className="text-sm text-muted-foreground">已有部分标签，演示添加和删除功能</p>
            <TagInput value={tags1} onChange={setTags1} placeholder="添加标签..." />
            <div className="text-sm">
              <strong>当前标签：</strong> {JSON.stringify(tags1)}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">空状态</h2>
            <p className="text-sm text-muted-foreground">
              无标签状态，首次聚焦时会显示最近常用的 3 个标签
            </p>
            <TagInput value={tags2} onChange={setTags2} placeholder="点击输入框查看建议标签..." />
            <div className="text-sm">
              <strong>当前标签：</strong> {JSON.stringify(tags2)}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">多标签状态</h2>
            <p className="text-sm text-muted-foreground">
              多个标签的显示和管理，测试退格键删除逻辑
            </p>
            <TagInput value={tags3} onChange={setTags3} placeholder="继续添加标签..." />
            <div className="text-sm">
              <strong>当前标签：</strong> {JSON.stringify(tags3)}
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">功能说明</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <Card className="p-4">
            <h3 className="font-medium mb-2">键盘操作</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>
                • <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Space</kbd> - 创建标签
              </li>
              <li>
                • <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Enter</kbd> /{' '}
                <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Tab</kbd> - 选择建议
              </li>
              <li>
                • <kbd className="px-1 py-0.5 bg-muted rounded text-xs">↑</kbd> /{' '}
                <kbd className="px-1 py-0.5 bg-muted rounded text-xs">↓</kbd> - 导航建议
              </li>
              <li>
                • <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Backspace</kbd> - 删除标签
              </li>
              <li>
                • <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Escape</kbd> - 关闭建议
              </li>
            </ul>
          </Card>

          <Card className="p-4">
            <h3 className="font-medium mb-2">特殊功能</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>• 首次聚焦显示常用标签</li>
              <li>• 智能过滤和排序建议</li>
              <li>• 避免重复标签</li>
              <li>• 复杂的退格删除逻辑</li>
              <li>• 支持中文输入法</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
