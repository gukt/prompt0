import { MemoryItem } from '@/components/memory-item';
import { MemoryStats } from '@/components/memory-stats';
import { mockMemories } from '@/lib/mock-data';

export function MemoryList() {
  return (
    <div className="p-4">
      <MemoryStats totalMemories={mockMemories.length} />
      
      {/* Recent Memories Header */}
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Memories</h3>

      {/* Memory List */}
      <div className="space-y-3">
        {mockMemories.map((memory) => (
          <MemoryItem key={memory.id} memory={memory} />
        ))}
      </div>

      {/* Shortcut Info */}
      <div className="mt-8 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Shortcut: ⌃ + M
        </div>
      </div>
    </div>
  );
} 