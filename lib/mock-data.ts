import { Prompt } from '@/lib/types';

export const mockPrompts: Prompt[] = [
  {
    id: 1,
    title: "代码审查提示词",
    category: "development",
    content: "请审查以下代码的质量、性能和安全性。关注点包括：1) 代码结构和可读性 2) 潜在的性能问题 3) 安全漏洞 4) 最佳实践的遵循情况。请提供具体的改进建议。",
    timestamp: "2 小时前"
  },
  {
    id: 2,
    title: "技术文档写作助手",
    category: "documentation", 
    content: "请帮我为这个 API 接口编写详细的技术文档。包括：1) 接口描述和用途 2) 请求参数和响应格式 3) 错误码说明 4) 使用示例和最佳实践。确保文档清晰易懂，便于开发者集成。",
    timestamp: "3 小时前"
  },
  {
    id: 3,
    title: "产品需求分析师",
    category: "product",
    content: "作为产品需求分析师，请帮我分析这个功能需求。从用户价值、技术可行性、资源投入、优先级等维度进行评估，并提出具体的实现方案和时间规划。",
    timestamp: "4 小时前"
  },
  {
    id: 4,
    title: "UI/UX 设计顾问",
    category: "design",
    content: "请为这个界面提供 UI/UX 设计建议。考虑因素包括：1) 用户体验流程优化 2) 界面布局和视觉层次 3) 交互设计最佳实践 4) 响应式设计考虑。提供具体的改进方案。",
    timestamp: "6 小时前"
  },
  {
    id: 5,
    title: "数据库优化专家",
    category: "database",
    content: "请分析这个数据库查询的性能问题，并提供优化建议。包括：1) 索引策略优化 2) SQL 查询改写 3) 表结构调整建议 4) 缓存策略。确保在保持数据一致性的前提下提升性能。",
    timestamp: "1 天前"
  },
  {
    id: 6,
    title: "项目架构师",
    category: "architecture",
    content: "请为这个项目设计技术架构方案。考虑：1) 系统边界和模块划分 2) 技术栈选型和理由 3) 可扩展性和可维护性 4) 部署和运维策略。提供详细的架构图和技术选型说明。",
    timestamp: "1 天前"
  }
]; 