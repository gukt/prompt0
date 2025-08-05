import { usePrompts } from '@/lib/hooks/prompt/usePrompts';
import { useEffect } from 'react';
import { mockPrompts } from '../lib/mock-data';

/**
 * 应用初始化 Hook。
 * 负责在应用启动时初始化数据和设置。
 */
export function useApp() {
  const { initialize, initialized, loading, error } = usePrompts();

  useEffect(() => {
    // 只在未初始化时执行
    if (!initialized && !loading) {
      initialize(mockPrompts);
    }
  }, [initialize, initialized, loading]);

  return {
    initialized,
    loading,
    error,
  };
}