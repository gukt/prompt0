import { Button } from '@/components/ui/button';

interface MemoryStatsProps {
  totalMemories: number;
}

export function MemoryStats({ totalMemories }: MemoryStatsProps) {
  return (
    <div className="mb-6 p-4 bg-gray-900 text-white rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-gray-400 text-sm">Total Memories</div>
          <div className="text-2xl font-bold">{totalMemories} Memories</div>
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="bg-gray-800 hover:bg-gray-700 text-white border-gray-700"
        >
          Open Dashboard →
        </Button>
      </div>
    </div>
  );
} 