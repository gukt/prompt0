import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Prompt } from '@/lib/types';
import { useRef, useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';

interface SettingsPageProps {
  prompts?: Prompt[];
  onImportPrompts?: (prompts: Prompt[]) => void;
  activeItem?: string;
  onItemChange?: (itemId: string) => void;
}

export function SettingsPage({
  prompts = [],
  onImportPrompts,
  activeItem = 'all',
  onItemChange = () => {},
}: SettingsPageProps) {
  const [autoComplete, setAutoComplete] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState('zh-CN');
  const [autoBackup, setAutoBackup] = useState(true);
  const [apiKey, setApiKey] = useState('');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showImportMenu, setShowImportMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  return (
    <DashboardLayout activeItem={activeItem} onItemChange={onItemChange}>
      <section className="flex-1 p-6 overflow-y-auto space-y-8">
        {/* 基本设置 */}
        <section className="space-y-4">
          <div>
            <h2 className="text-[20px] leading-[25px] font-semibold ">Basic</h2>
            <p className="text-sm text-muted-foreground">Manage your basic preferences</p>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Auto Complete</div>
                <p className="text-sm text-muted-foreground">Enable auto-complete feature</p>
              </div>
              <Switch
                checked={autoComplete}
                onCheckedChange={(checked) => setAutoComplete(checked)}
              />
            </div>

            <Separator className="my-2" />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Notifications</div>
                <p className="text-sm text-muted-foreground">
                  Receive updates and important notifications
                </p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={(checked) => setNotifications(checked)}
              />
            </div>

            <Separator className="my-2" />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Dark Mode</div>
                <p className="text-sm text-muted-foreground">Enable dark mode</p>
              </div>
              <Switch checked={darkMode} onCheckedChange={(checked) => setDarkMode(checked)} />
            </div>

            <Separator className="my-2" />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Language</div>
                <p className="text-sm text-muted-foreground">Select the interface language</p>
              </div>
            </div>
          </div>
        </section>

        {/* 数据管理 */}
        <section className="space-y-4">
          <div>
            <h2 className="text-[20px] leading-[25px] font-semibold ">Data</h2>
            <p className="text-sm text-muted-foreground">Manage your prompt data</p>
          </div>
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">自动备份</div>
                  <p className="text-sm text-muted-foreground">定期自动备份您的提示词数据</p>
                </div>
                <Switch
                  checked={autoBackup}
                  onCheckedChange={(checked) => setAutoBackup(checked)}
                />
              </div>

              <div className="border-t border-border my-4"></div>
            </CardContent>
          </Card>
        </section>

        {/* 快捷键 */}
        <section className="space-y-4">
          <div>
            <h2 className="text-[20px] leading-[25px] font-semibold ">Keyboard Shortcuts</h2>
            <p className="text-sm text-muted-foreground">View and manage keyboard shortcuts</p>
          </div>
          <Card>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-sm">Open Prompt Panel</span>
                <div className="px-2 py-1 bg-muted rounded text-xs font-mono">
                  ⌘ + M (or Ctrl + M)
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between items-center">
                <span className="text-sm">Quick Search</span>
                <div className="px-2 py-1 bg-muted rounded text-xs font-mono">
                  ⌘ + K (or Ctrl + K)
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 关于 */}
        <section className="space-y-4">
          <div>
            <h2 className="text-[20px] leading-[25px] font-semibold ">About</h2>
            <p className="text-sm text-muted-foreground">Application information</p>
          </div>
          <Card>
            <CardContent>
              <div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">版本</span>
                  <span className="text-sm">1.0.0</span>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">作者</span>
                  <span className="text-sm">Gu Kaitong</span>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">联系邮箱</span>
                  <span className="text-sm">gukaitong@gmail.com</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </section>
    </DashboardLayout>
  );
}
