import { Prompt } from '@/lib/types';

export interface PromptState {
  prompts: Prompt[];
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

export type PromptAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PROMPTS'; payload: Prompt[] }
  | { type: 'ADD_PROMPT'; payload: Prompt }
  | { type: 'UPDATE_PROMPT'; payload: { id: string; updates: Partial<Prompt> } }
  | { type: 'DELETE_PROMPT'; payload: string }
  | { type: 'TOGGLE_PIN'; payload: string }
  | { type: 'SET_INITIALIZED'; payload: boolean }
  | { type: 'CLEAR_ALL' };

export interface PromptContextType {
  state: PromptState;
  dispatch: React.Dispatch<PromptAction>;
} 