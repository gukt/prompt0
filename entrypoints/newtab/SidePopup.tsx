import '@/assets/tailwind.css';
import { Prompt } from '@/backup/PromptCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Brain as BrainIcon, X as XIcon } from 'lucide-react';
import { useState } from 'react';
import { PromptsTab } from './components/PromptsTab';
import { SettingsTab } from './components/SettingsTab';

export default function App() {
  const [activeTab, setActiveTab] = useState<'prompts' | 'settings'>('prompts');
  const [prompts, setPrompts] = useState<Prompt[]>([
    {
      id: '1',
      title: '🧐 代码审查提示词',
      content: '请审查以下代码的质量、性能和安全性。关注点包括：1) 代码结构和可读性 2) 潜在的性能问题 3) 安全漏洞 4) 最佳实践的遵循情况。请提供具体的改进建议。请审查以下代码的质量、性能和安全性。关注点包括：1) 代码结构和可读性 2) 潜在的性能问题 3) 安全漏洞 4) 最佳实践的遵循情况。请提供具体的改进建议。请审查以下代码的质量、性能和安全性。关注点包括：1) 代码结构和可读性 2) 潜在的性能问题 3) 安全漏洞 4) 最佳实践的遵循情况。请提供具体的改进建议。请审查以下代码的质量、性能和安全性。关注点包括：1) 代码结构和可读性 2) 潜在的性能问题 3) 安全漏洞 4) 最佳实践的遵循情况。请提供具体的改进建议。请审查以下代码的质量、性能和安全性。关注点包括：1) 代码结构和可读性 2) 潜在的性能问题 3) 安全漏洞 4) 最佳实践的遵循情况。请提供具体的改进建议。',
      categories: ['开发', '代码审查', '质量保证'],
      createdAt: new Date(),
    },
    {
      id: '2',
      title: '📝 技术文档写作助手',
      content: '请帮我为这个 API 接口编写详细的技术文档。包括：1) 接口描述和用途 2) 请求参数和响应格式 3) 错误码说明 4) 使用示例和最佳实践。确保文档清晰易懂，便于开发者集成。',
      categories: ['文档', 'API', '技术写作'],
      createdAt: new Date(),
    },
    {
      id: '3',
      title: '🔍 产品需求分析师',
      content: '作为产品需求分析师，请帮我分析这个功能需求。从用户价值、技术可行性、资源投入、优先级等维度进行评估，并提出具体的实现方案和时间规划。',
      categories: ['产品', '需求分析', '项目管理'],
      createdAt: new Date(),
    },
    {
      id: '4',
      title: '🎨 UI/UX 设计顾问',
      content: '请为这个界面提供 UI/UX 设计建议。考虑因素包括：1) 用户体验流程优化 2) 界面布局和视觉层次 3) 交互设计最佳实践 4) 响应式设计考虑。提供具体的改进方案。',
      categories: ['设计', 'UI/UX', '用户体验'],
      createdAt: new Date(),
    },
    {
      id: '5',
      title: '🗄️ 数据库优化专家',
      content: '请分析这个数据库查询的性能问题，并提供优化建议。包括：1) 索引策略优化 2) SQL 查询改写 3) 表结构调整建议 4) 缓存策略。确保在保持数据一致性的前提下提升性能。',
      categories: ['数据库', '性能优化', '后端'],
      createdAt: new Date(),
    },
    {
      id: '6',
      title: '🏗️ 项目架构师',
      content: '请为这个项目设计技术架构方案。考虑：1) 系统边界和模块划分 2) 技术栈选型和理由 3) 可扩展性和可维护性 4) 部署和运维策略。提供详细的架构图和技术选型说明。',
      categories: ['架构', '系统设计', '技术选型'],
      createdAt: new Date(),
    },
    {
      id: '7',
      title: '⚡ 前端性能优化专家',
      content: '请分析这个前端应用的性能瓶颈，并提供优化方案。关注点：1) 首屏加载时间 2) 运行时性能 3) 内存使用优化 4) 打包体积优化。提供具体的优化策略和实施步骤。',
      categories: ['前端', '性能优化', 'Web 性能'],
      createdAt: new Date(),
    },
    {
      id: '8',
      title: '🔗 API 接口设计师',
      content: '请帮我设计这个功能的 RESTful API 接口。包括：1) 资源路径规划 2) HTTP 方法选择 3) 请求/响应数据结构 4) 错误处理机制 5) 版本控制策略。确保接口设计符合 REST 规范。',
      categories: ['API 设计', 'RESTful', '后端'],
      createdAt: new Date(),
    },
    {
      id: '9',
      title: '🚀 DevOps 运维专家',
      content: '请为这个项目设计 CI/CD 流水线和部署策略。包括：1) 自动化构建和测试 2) 部署环境管理 3) 监控和日志策略 4) 回滚机制。确保部署的可靠性和可追溯性。',
      categories: ['DevOps', 'CI/CD', '部署'],
      createdAt: new Date(),
    },
    {
      id: '10',
      title: '🛡️ 安全测试专家',
      content: '请对这个应用进行安全评估。检查项目包括：1) 常见 Web 安全漏洞 (OWASP Top 10) 2) 数据传输和存储安全 3) 身份认证和授权机制 4) 输入验证和防护措施。提供安全加固建议。',
      categories: ['安全', '测试', 'Web 安全'],
      createdAt: new Date(),
    },
  ]);
  const [isVisible, setIsVisible] = useState(true);
  const [right, setRight] = useState(0);

  const handleClose = () => {
    setRight(-600);
  };

  const handleOpenDashboard = () => {
    // 发送消息给background打开仪表板
    browser.runtime.sendMessage({
      action: 'openDashboard',
      url: 'https://mem0.ai/dashboard',
    });
  };

  const copyPrompt = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const viewPrompt = (prompt: Prompt) => {
    console.log('查看提示词:', prompt);
  };

  return (
    <div
      className="flex flex-col fixed top-15 text-base w-120 h-[85vh] max-h-[85vh] rounded-2xl border shadow-lg z-[2147483647] overflow-hidden font-sans transition-[right] duration-300 ease-in-out"
      style={{ right: `${right}px` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <BrainIcon className="w-6 h-6" />
          <h1 className="text-[20px] font-semibold">OpenPrompt</h1>
        </div>
        <button
          onClick={handleClose}
          className="text-primary/50 hover:text-primary transition-colors cursor-pointer"
        >
          <XIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="px-4 flex border-b">
        <button
          onClick={() => setActiveTab('prompts')}
          className={cn(
            'flex-1 px-4 py-3 text-sm font-medium transition-colors relative cursor-pointer',
            activeTab === 'prompts'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-white',
          )}
        >
          Recents
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={cn(
            'flex-1 px-4 py-3 text-sm font-medium transition-colors relative cursor-pointer',
            activeTab === 'settings'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-white',
          )}
        >
          Settings
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 overflow-y-auto">
        {activeTab === 'prompts' ? (
          <PromptsTab
            prompts={prompts}
            onOpenDashboard={handleOpenDashboard}
            onCopyPrompt={copyPrompt}
            onViewPrompt={viewPrompt}
          />
        ) : (
          <SettingsTab />
        )}
      </div>

      {/* Footer */}
      <div className="p-4 flex items-center justify-between">
        <Button variant="outline" size="sm" className="text-primary/50">
          Shortcut: ^ + M
        </Button>
        <Button variant="outline" size="sm">
          Logout
        </Button>
      </div>
    </div>
  );
}
