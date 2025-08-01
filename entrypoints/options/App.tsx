import '@/assets/tailwind.css';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TooltipProvider } from '@/components/ui/tooltip';
import { mockPrompts } from '@/lib/mock-data';
import { Prompt } from '@/lib/types';
import { cn } from '@/lib/utils';
import { BrainIcon, LogOutIcon } from 'lucide-react';
import { useState } from 'react';
import { ContactDialog } from './components/ContactDialog';
import { ContentArea } from './components/ContentArea';
import { Sidebar } from './components/Sidebar';
import { DiscoverPage } from './pages/DiscoverPage';
import { DocsPage } from './pages/DocsPage';
import { PromptEditPage } from './pages/PromptEditPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  const [activeItem, setActiveItem] = useState('all');
  const [activeMenuItem, setActiveMenuItem] = useState('all');
  const [prompts, setPrompts] = useState<Prompt[]>(mockPrompts);
  const [currentPage, setCurrentPage] = useState<'main' | 'edit'>('main');
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const handleAddPrompt = () => {
    setEditingPrompt(null);
    setCurrentPage('edit');
  };

  const handleEditPrompt = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setCurrentPage('edit');
  };
  const handleBackToMain = () => {
    setCurrentPage('main');
    setEditingPrompt(null);
  };

  const handleDeletePrompt = (promptId: string) => {
    setPrompts((prev) => prev.filter((p) => p.id !== promptId));
  };

  const handleSavePrompt = (promptData: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingPrompt) {
      // 编辑现有提示词
      setPrompts((prev) =>
        prev.map((p) =>
          p.id === editingPrompt.id
            ? {
                ...p,
                ...promptData,
                updatedAt: new Date(),
              }
            : p,
        ),
      );
    } else {
      // 新增提示词
      const newPrompt: Prompt = {
        ...promptData,
        id: Date.now().toString(),
        createdAt: new Date(),
      };
      setPrompts((prev) => [newPrompt, ...prev]);
    }
  };

  const handleImportPrompts = (importedPrompts: Prompt[]) => {
    // 过滤掉重复的 ID，避免冲突
    const existingIds = new Set(prompts.map((p) => p.id));
    const uniquePrompts = importedPrompts.filter((p) => !existingIds.has(p.id));

    // 将导入的提示词添加到现有列表的开头
    setPrompts((prev) => [...uniquePrompts, ...prev]);
  };

  const handleItemChange = (itemId: string) => {
    if (itemId === 'contact') {
      setContactDialogOpen(true);
    } else {
      setActiveItem(itemId);
    }
  };

  const renderMainContent = () => {
    if (currentPage === 'edit') {
      return (
        <PromptEditPage
          prompt={editingPrompt}
          onSave={handleSavePrompt}
          onBack={handleBackToMain}
        />
      );
    }

    // 如果是 Discover 页面，显示不同的布局
    if (activeMenuItem === 'discover') {
      return (
        <DiscoverPage
          onImportPrompt={(prompt: Prompt) => {
            setPrompts((prev) => [prompt, ...prev]);
          }}
        />
      );
    }

    switch (activeItem) {
      case 'settings':
        return <SettingsPage prompts={prompts} onImportPrompts={handleImportPrompts} />;
      case 'docs':
        return <DocsPage />;
      default:
        return (
          <ContentArea
            activeItem={activeItem}
            prompts={prompts}
            searchQuery=""
            sidebarVisible={true}
            onEditPrompt={handleEditPrompt}
            onDeletePrompt={handleDeletePrompt}
            onAddPrompt={handleAddPrompt}
            onToggleSidebar={() => {}}
            onImportPrompts={handleImportPrompts}
          />
        );
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-base">
        <div>
          {/* 顶部导航栏 */}
          <header className="grid grid-cols-3 items-center px-16 w-full h-16 mt-4 mb-16 ">
            <BrainIcon />
            {/* Dashboard & Discover Tabs */}
            <div className="flex items-center justify-center gap-8 ">
              <div
                onClick={() => setActiveMenuItem('dashboard')}
                className={cn(
                  'cursor-pointer hover:text-primary',
                  activeMenuItem === 'dashboard' ? '' : 'text-muted-foreground',
                )}
              >
                Dashboard
              </div>
              <div
                onClick={() => setActiveMenuItem('discover')}
                className={cn(
                  'cursor-pointer hover:text-primary',
                  activeMenuItem === 'discover' ? '' : 'text-muted-foreground',
                )}
              >
                Discover
              </div>
            </div>
            <div className="ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>G</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 text-sm" align="end">
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    gukaitong@gmail.com
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex justify-between">
                    Logout <LogOutIcon />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* 主要内容区域 */}
          <div className="flex min-h-[calc(100vh-80px)] max-w-6xl mx-auto">
            {/* 左侧边栏 - 只在 dashboard 页面显示 */}
            {activeMenuItem === 'dashboard' && (
              <div className="w-76">
                <Sidebar activeItem={activeItem} onItemChange={handleItemChange} />
              </div>
            )}

            {/* 右侧内容区域 */}
            <div className={`flex-1 ${activeMenuItem === 'dashboard' ? 'ml-12' : ''}`}>
              {renderMainContent()}
            </div>
          </div>
        </div>

        {/* Contact Us 对话框 */}
        <ContactDialog open={contactDialogOpen} onOpenChange={setContactDialogOpen} />
      </div>
    </TooltipProvider>
  );
}
