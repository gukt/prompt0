export interface Prompt {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt?: Date;
  usedAt?: Date;
  isPinned?: boolean;
  isFavorite?: boolean;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
  isPinned?: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  icon?: string;
  count?: number;
  color?: string;
} 