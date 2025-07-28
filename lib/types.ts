export interface Prompt {
  id: string;
  title: string;
  content: string;
  categories: string[];
  createdAt: Date;
  updatedAt?: Date;
  isPinned?: boolean;
  isFavorite?: boolean;
  usage?: number;
}

export interface Category {
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