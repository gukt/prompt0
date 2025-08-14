import { Prompt } from './types';

// Cherry Studio Agent 数据结构
interface CherryAgent {
  id: string;
  name: string;
  emoji: string;
  group: string[];
  prompt: string;
  description: string;
}

// 将 Cherry Studio 的 agents 数据转换为项目的 Prompt 格式
export function transformAgentsToPrompts(agents: CherryAgent[]): Prompt[] {
  return agents.map((agent) => ({
    id: `cherry-${agent.id}`,
    title: agent.name,
    content: agent.prompt,
    tags: agent.group || [],
    createdAt: new Date('2024-01-01'), // 设置一个默认创建时间
    isPinned: false,
  }));
}

// 获取所有公共提示词
export function getPublicPrompts(): Prompt[] {
  try {
    // 使用 require 来导入 JSON 文件
    const agentsData = require('./agents.json') as CherryAgent[];
    return transformAgentsToPrompts(agentsData);
  } catch (error) {
    console.error('Failed to load agents data:', error);
    return [];
  }
}