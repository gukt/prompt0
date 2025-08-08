import { createContext, ReactNode, useContext, useReducer } from 'react';
import { initialState, promptReducer } from './reducer';
import { PromptContextType } from './types';

const PromptContext = createContext<PromptContextType | null>(null);

interface PromptProviderProps {
  children: ReactNode;
}

export function PromptProvider({ children }: PromptProviderProps) {
  const [state, dispatch] = useReducer(promptReducer, initialState);

  // New Context providers can use <Context> and we will be publishing a codemod to convert existing providers.
  // In future versions we will deprecate <Context.Provider>.
  // https://react.dev/blog/2024/12/05/react-19#context-as-a-provider
  return <PromptContext value={{ state, dispatch }}>{children}</PromptContext>;
}

export function usePromptContext(): PromptContextType {
  const context = useContext(PromptContext);
  if (!context) {
    throw new Error('usePromptContext 必须在 PromptProvider 内部使用');
  }
  return context;
}
