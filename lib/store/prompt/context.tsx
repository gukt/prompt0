import { createContext, ReactNode, useContext, useReducer } from 'react';
import { initialState, promptReducer } from './reducer';
import { PromptContextType } from './types';

// 创建 Context
const PromptContext = createContext<PromptContextType | null>(null);

// Provider 组件
interface PromptProviderProps {
  children: ReactNode;
}

export function PromptProvider({ children }: PromptProviderProps) {
  const [state, dispatch] = useReducer(promptReducer, initialState);

  return <PromptContext.Provider value={{ state, dispatch }}>{children}</PromptContext.Provider>;
}

export function usePromptContext(): PromptContextType {
  const context = useContext(PromptContext);
  if (!context) {
    throw new Error('usePromptContext 必须在 PromptProvider 内部使用');
  }
  return context;
}
