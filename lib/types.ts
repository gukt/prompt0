export interface Prompt {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  usedAt?: Date;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
  isPinned?: boolean;
}