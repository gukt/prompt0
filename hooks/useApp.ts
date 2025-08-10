import { usePrompts } from '@/hooks/usePrompts';
import { useSettings } from '@/hooks/useSettings';
import { useEffect } from 'react';
import { mockPrompts } from '../lib/mock-data';

/**
 * 应用初始化 Hook。
 * 负责在应用启动时初始化数据和设置。
 */
export function useApp() {
  const { initialize: initializePrompts, initialized, loading, error } = usePrompts();
  const { initialize: initializeSettings } = useSettings();

  useEffect(() => {
    // 初始化设置
    initializeSettings();

    // 只在未初始化时执行
    if (!initialized && !loading) {
      initializePrompts(mockPrompts);
    }
  }, [initializePrompts, initializeSettings, initialized, loading]);

  return {
    initialized,
    loading,
    error,
  };
}