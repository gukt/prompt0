import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface DocsPageProps {
  activeItem?: string;
  onItemChange?: (itemId: string) => void;
}

export function DocsPage({ activeItem = 'all', onItemChange = () => {} }: DocsPageProps) {
  return (
    <DashboardLayout activeItem={activeItem} onItemChange={onItemChange}>
      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto space-y-8">
        {/* 产品说明 */}
        <div className="space-y-4">
          <div className="space-y-3">
            <h3 className="text-lg font-medium">什么是 Prompt 管理器？</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Prompt 管理器是一个专为 AI
              对话设计的提示词管理工具。它帮助您组织、存储和快速访问常用的 AI 提示词， 提高您与 AI
              助手的交互效率。
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-medium">核心功能</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span>智能分类：按标签和类别组织您的提示词</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span>快速搜索：通过关键词快速找到需要的提示词</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span>一键复制：轻松复制提示词到剪贴板</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span>导入导出：支持多种格式的数据导入导出</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span>置顶收藏：将常用提示词置顶以便快速访问</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 常见问题 - 使用 Accordion */}
        <div className="space-y-4">
          <div>
            <h2 className="text-[20px] leading-[25px] font-semibold">FAQ</h2>
          </div>
          <Accordion type="single" className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Product Information</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>
                  Our flagship product combines cutting-edge technology with sleek design. Built
                  with premium materials, it offers unparalleled performance and reliability.
                </p>
                <p>
                  Key features include advanced processing capabilities, and an intuitive user
                  interface designed for both beginners and experts.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Shipping Details</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>
                  We offer worldwide shipping through trusted courier partners. Standard delivery
                  takes 3-5 business days, while express shipping ensures delivery within 1-2
                  business days.
                </p>
                <p>
                  All orders are carefully packaged and fully insured. Track your shipment in
                  real-time through our dedicated tracking portal.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Return Policy</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>
                  We stand behind our products with a comprehensive 30-day return policy. If
                  you&apos;re not completely satisfied, simply return the item in its original
                  condition.
                </p>
                <p>
                  Our hassle-free return process includes free return shipping and full refunds
                  processed within 48 hours of receiving the returned item.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* 提示词写作技巧 */}
        <div className="space-y-4">
          <div>
            <h2 className="text-[20px] leading-[25px] font-semibold">提示词写作技巧</h2>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              这里为你整理了一些主流大模型（如 OpenAI、Claude
              等）的官方提示词文档，帮助你更好地编写高质量的 prompt：
            </p>
            <ul className="list-disc pl-5 space-y-3 text-sm">
              <li>
                <a
                  href="https://platform.openai.com/docs/guides/prompt-engineering"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline hover:opacity-80"
                >
                  OpenAI Prompt Engineering 官方文档
                </a>
              </li>
              <li>
                <a
                  href="https://help.anthropic.com/en/articles/6814422-prompt-engineering-best-practices"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline hover:opacity-80"
                >
                  Anthropic Claude Prompt Engineering 指南
                </a>
              </li>
              <li>
                <a
                  href="https://platform.openai.com/docs/guides/gpt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline hover:opacity-80"
                >
                  OpenAI GPT 使用指南
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/f/awesome-chatgpt-prompts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline hover:opacity-80"
                >
                  Awesome ChatGPT Prompts（社区精选）
                </a>
              </li>
              <li>
                <a
                  href="https://docs.cohere.com/docs/prompt-engineering"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline hover:opacity-80"
                >
                  Cohere Prompt Engineering 文档
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
