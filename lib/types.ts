export interface Prompt {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt?: Date;
  usedAt?: Date;
  isPinned?: boolean;
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