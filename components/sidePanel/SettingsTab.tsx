import { ExportButton } from '@/components/ExportButton';
import { ImportButton } from '@/components/ImportButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Clock, KeyboardIcon, Shield } from 'lucide-react';
import { useState } from 'react';

export function SettingsTab() {
  const [settings, setSettings] = useState({
    autoRecord: true,
    usePassword: false,
    password: '',
    retentionDays: '30',
    shortcut: 'Ctrl+Shift+P',
    theme: 'dark',
    platforms: {
      chatgpt: true,
      claude: true,
      grok: false,
      deepseek: true,
      kimi: false,
    },
  });

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  // 解决这里的亮度问题。白色的字太亮了
  return (
    <div className="space-y-4 overflow-y-auto">
      {/* Privacy & Security */}
      <Card className="bg-extension-card border-extension-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2 text-extension-text">
            <Shield className="h-4 w-4" />
            Privacy & Security
          </CardTitle>
          <CardDescription className="text-xs text-extension-text-muted">
            Control how your data is collected and stored
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-xs text-extension-text">Auto-record prompts</Label>
              <p className="text-xs text-extension-text-muted">
                Automatically save prompts from AI chat websites
              </p>
            </div>
            <Switch
              checked={settings.autoRecord}
              onCheckedChange={(checked) => updateSetting('autoRecord', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-xs text-extension-text">Use password protection</Label>
              <p className="text-xs text-extension-text-muted">
                Require password to access history
              </p>
            </div>
            <Switch
              checked={settings.usePassword}
              onCheckedChange={(checked) => updateSetting('usePassword', checked)}
            />
          </div>

          {settings.usePassword && (
            <div className="space-y-2">
              <Label className="text-xs text-extension-text">Password</Label>
              <Input
                type="password"
                placeholder="Enter password"
                value={settings.password}
                onChange={(e) => updateSetting('password', e.target.value)}
                className="h-8 bg-extension-bg border-extension-border text-extension-text text-xs"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="bg-extension-card border-extension-border">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2 text-extension-text">
            <Clock className="h-4 w-4" />
            Data Management
          </CardTitle>
          <CardDescription className="text-xs text-extension-text-muted">
            Configure data retention and cleanup
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 这里放置 ImportButton 和 ExportButton */}
          <div className="flex gap-2">
            {/* TODO 解决以下两个按钮的下拉框的宽度问题 */}
            <ExportButton />
            <ImportButton />
          </div>
        </CardContent>
      </Card>

      {/* Keyboard Shortcut */}
      <Card className="bg-extension-card border-extension-border">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2 text-extension-text">
            <KeyboardIcon size={16} />
            Keyboard Shortcut
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={settings.shortcut}
            onChange={(e) => updateSetting('shortcut', e.target.value)}
            placeholder="Ctrl+Shift+P"
            className="h-8 bg-extension-bg border-extension-border text-extension-text text-xs"
          />
        </CardContent>
      </Card>
    </div>
  );
}
