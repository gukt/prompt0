import { Copy as CopyIcon, Eye as EyeIcon } from 'lucide-react';

interface Memory {
  id: string;
  content: string;
  category: string;
  createdAt: Date;
}

interface MemoryCardProps {
  memory: Memory;
  onCopy: (content: string) => void;
  onView: (memory: Memory) => void;
}

export default function MemoryCard({ memory, onCopy, onView }: MemoryCardProps) {
  return (
    <div className="rounded-lg p-3 group hover:bg-gray-750 transition-colors">
      <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">{memory.content}</p>
      <div className="flex items-center justify-between mt-2">
        <span className="inline-block bg-blue-900 text-blue-300 text-xs px-2 py-1 rounded">
          {memory.category}
        </span>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onCopy(memory.content)}
            className="text-gray-400 hover:text-white transition-colors p-1"
            title="复制"
          >
            <CopyIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onView(memory)}
            className="text-gray-400 hover:text-white transition-colors p-1"
            title="查看"
          >
            <EyeIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export type { Memory, MemoryCardProps };
