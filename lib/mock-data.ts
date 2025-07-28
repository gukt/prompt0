import { Category, Prompt } from '@/lib/types';

export const mockPrompts: Prompt[] = [
  {
    id: '1',
    title: '🧐 Code Review Assistant',
    content: 'Please review the following code for quality, performance, and security. Focus on: 1) Code structure and readability 2) Potential performance issues 3) Security vulnerabilities 4) Best practices compliance. Please provide specific improvement suggestions.',
    categories: ['Development', 'Code Review', 'Quality Assurance'],
    createdAt: new Date(2024, 0, 15),
    isPinned: true,
    isFavorite: true,
    usage: 25
  },
  {
    id: '2',
    title: '📝 Technical Documentation Writer',
    content: 'Please help me write detailed technical documentation for this API endpoint. Include: 1) Interface description and purpose 2) Request parameters and response format 3) Error code explanations 4) Usage examples and best practices. Ensure the documentation is clear and easy for developers to integrate.',
    categories: ['Documentation', 'API', 'Technical Writing'],
    createdAt: new Date(2024, 0, 14),
    isFavorite: true,
    usage: 18
  },
  {
    id: '3',
    title: '🔍 Product Requirements Analyst',
    content: 'As a product requirements analyst, please help me analyze this feature requirement. Evaluate from dimensions of user value, technical feasibility, resource investment, and priority, and propose specific implementation plans and timeline.',
    categories: ['Product', 'Requirements Analysis', 'Project Management'],
    createdAt: new Date(2024, 0, 13),
    usage: 12
  },
  {
    id: '4',
    title: '🎨 UI/UX Design Consultant',
    content: 'Please provide UI/UX design suggestions for this interface. Consider: 1) User experience flow optimization 2) Interface layout and visual hierarchy 3) Interaction design best practices 4) Responsive design considerations. Provide specific improvement recommendations.',
    categories: ['Design', 'UI/UX', 'User Experience'],
    createdAt: new Date(2024, 0, 12),
    isPinned: true,
    usage: 22
  },
  {
    id: '5',
    title: '🗄️ Database Optimization Expert',
    content: 'Please analyze the performance issues of this database query and provide optimization suggestions. Include: 1) Index strategy optimization 2) SQL query rewriting 3) Table structure adjustment recommendations 4) Caching strategies. Ensure performance improvement while maintaining data consistency.',
    categories: ['Database', 'Performance Optimization', 'Backend'],
    createdAt: new Date(2024, 0, 11),
    usage: 8
  },
  {
    id: '6',
    title: '🏗️ System Architect',
    content: 'Please design a technical architecture solution for this project. Consider: 1) System boundaries and module division 2) Technology stack selection and rationale 3) Scalability and maintainability 4) Deployment and operations strategy. Provide detailed architecture diagrams and technology selection explanations.',
    categories: ['Architecture', 'System Design', 'Technology Selection'],
    createdAt: new Date(2024, 0, 10),
    usage: 15
  },
  {
    id: '7',
    title: '⚡ Frontend Performance Expert',
    content: 'Please analyze the performance bottlenecks of this frontend application and provide optimization solutions. Focus on: 1) First screen loading time 2) Runtime performance 3) Memory usage optimization 4) Bundle size optimization. Provide specific optimization strategies and implementation steps.',
    categories: ['Frontend', 'Performance Optimization', 'Web Performance'],
    createdAt: new Date(2024, 0, 9),
    usage: 6
  },
  {
    id: '8',
    title: '🔗 API Interface Designer',
    content: 'Please help me design RESTful API interfaces for this feature. Include: 1) Resource path planning 2) HTTP method selection 3) Request/response data structure 4) Error handling mechanisms 5) Version control strategy. Ensure the interface design complies with REST specifications.',
    categories: ['API Design', 'RESTful', 'Backend'],
    createdAt: new Date(2024, 0, 8),
    usage: 10
  }
];

export const mockCategories: Category[] = [
  { id: 'development', name: 'Development', color: '#3b82f6', isPinned: true },
  { id: 'design', name: 'Design', color: '#8b5cf6', isPinned: true },
  { id: 'product', name: 'Product', color: '#10b981', isPinned: false },
  { id: 'documentation', name: 'Documentation', color: '#f59e0b', isPinned: false },
  { id: 'architecture', name: 'Architecture', color: '#ef4444', isPinned: false },
  { id: 'database', name: 'Database', color: '#06b6d4', isPinned: false },
  { id: 'marketing', name: 'Marketing', color: '#ec4899', isPinned: false },
  { id: 'sales', name: 'Sales', color: '#84cc16', isPinned: false },
  { id: 'support', name: 'Support', color: '#f97316', isPinned: false },
  { id: 'testing', name: 'Testing', color: '#6366f1', isPinned: false },
  { id: 'security', name: 'Security', color: '#dc2626', isPinned: false },
  { id: 'mobile', name: 'Mobile', color: '#059669', isPinned: false },
  { id: 'devops', name: 'DevOps', color: '#7c3aed', isPinned: false },
  { id: 'analytics', name: 'Analytics', color: '#0891b2', isPinned: false },
  { id: 'content', name: 'Content', color: '#ca8a04', isPinned: false },
  { id: 'research', name: 'Research', color: '#be123c', isPinned: false },
  { id: 'legal', name: 'Legal', color: '#374151', isPinned: false },
  { id: 'finance', name: 'Finance', color: '#065f46', isPinned: false },
  { id: 'hr', name: 'HR', color: '#7e22ce', isPinned: false },
  { id: 'operations', name: 'Operations', color: '#b45309', isPinned: false },
]; 