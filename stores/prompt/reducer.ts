import { PromptAction, PromptState } from './types';

export const initialState: PromptState = {
  prompts: [],
  loading: false,
  error: null,
  initialized: false,
};

/**
 * Prompt Reducer 函数
 * 
 * @param state - 当前状态
 * @param action - 动作
 * @returns 新的状态
 * @see {@link https://react.dev/learn/extracting-state-logic-into-a-reducer}
 */
export function promptReducer(state: PromptState, action: PromptAction): PromptState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };

    case 'SET_PROMPTS':
      return {
        ...state,
        prompts: action.payload,
        loading: false,
        error: null,
      };

    case 'ADD_PROMPT':
      return {
        ...state,
        prompts: [action.payload, ...state.prompts],
        error: null,
      };

    case 'UPDATE_PROMPT': {
      const { id, updates } = action.payload;
      return {
        ...state,
        prompts: state.prompts.map((prompt) =>
          prompt.id === id ? { ...prompt, ...updates, updatedAt: new Date() } : prompt,
        ),
        error: null,
      };
    }

    case 'DELETE_PROMPT':
      return {
        ...state,
        prompts: state.prompts.filter((prompt) => prompt.id !== action.payload),
        error: null,
      };

    case 'TOGGLE_PIN': {
      const promptId = action.payload;
      return {
        ...state,
        prompts: state.prompts.map((prompt) =>
          prompt.id === promptId
            ? { ...prompt, isPinned: !prompt.isPinned, updatedAt: new Date() }
            : prompt,
        ),
        error: null,
      };
    }

    case 'SET_INITIALIZED':
      return { ...state, initialized: action.payload };

    case 'CLEAR_ALL':
      return { ...initialState, initialized: true };

    default:
      return state;
  }
} 