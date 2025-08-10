export interface Prompt {
  id: string;
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date; // 新增：删除时间，用于软删除
  isDeleted?: boolean; // 新增：是否已删除
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
  isPinned?: boolean;
}

export interface SidebarMenuItem {
  id: string;
  name: string;
  icon?: React.ReactNode;
  count?: number;
  color?: string;
} 