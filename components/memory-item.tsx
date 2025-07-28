import { Memory } from '@/lib/types';
import { MessageSquare, Star } from 'lucide-react';

interface MemoryItemProps {
  memory: Memory;
}

export function MemoryItem({ memory }: MemoryItemProps) {
  return (
    <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-gray-900 text-sm leading-snug">
          {memory.title}
        </h4>
        <div className="flex gap-1 ml-2">
          <button className="p-1 hover:bg-gray-200 rounded">
            <MessageSquare className="h-3 w-3 text-gray-500" />
          </button>
          <button className="p-1 hover:bg-gray-200 rounded">
            <Star className="h-3 w-3 text-gray-500" />
          </button>
        </div>
      </div>
      <p className="text-gray-600 text-xs mb-2 line-clamp-2">
        {memory.content}
      </p>
      <div className="flex items-center gap-2">
        <span className="inline-block px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">
          {memory.category}
        </span>
        <span className="text-xs text-gray-500">
          {memory.timestamp}
        </span>
      </div>
    </div>
  );
} 