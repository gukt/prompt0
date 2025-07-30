# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a browser extension called "Prompt Manager" (提示词管理器) built with WXT and React 19. It's designed to help users efficiently manage and use AI prompts across different chat platforms.

## Common Development Commands

### Development

```bash
# Start development server (Chrome)
pnpm dev

# Start development server (Firefox)
pnpm dev:firefox

# Type checking
pnpm compile
```

### Build & Deploy

```bash
# Build for production (Chrome)
pnpm build

# Build for Firefox
pnpm build:firefox

# Create zip packages
pnpm zip
pnpm zip:firefox
```

## Architecture

### Framework Stack

- **WXT** - Modern web extension framework with built-in React support
- **React 19** - Latest React with concurrent features
- **TypeScript** - Strict type checking enabled
- **TailwindCSS + Shadcn/ui** - Modern UI with dark theme support
- **Radix UI** - Headless UI components for accessibility

### Entry Points

- `entrypoints/newtab/` - Main new tab page with chat interface
- `entrypoints/background.ts` - Background service worker
- `entrypoints/popup.html` - Extension popup (minimal)

### Core Features

- **@-triggered prompt search** - Type @ in any textarea to search prompts
- **Smart dropdown positioning** - Automatically positions dropdown based on available space
- **Keyboard navigation** - Arrow keys to navigate, Enter to select, Escape to cancel
- **Real-time prompt filtering** - Search by title, content, or categories

### Key Components

- `App.tsx` - Main chat interface with prompt search functionality
- `components/ui/` - Shadcn/ui components (Dialog, DropdownMenu, Tabs, etc.)
- `lib/types.ts` - TypeScript interfaces for Prompt, Category, MenuItem
- `lib/utils.ts` - Utility functions (clsx + tailwind-merge)

### Data Models

```typescript
interface Prompt {
  id: string;
  title: string;
  content: string;
  categories: string[];
  createdAt: Date;
  updatedAt?: Date;
  isPinned?: boolean;
  isFavorite?: boolean;
  usage?: number;
}
```

### State Management

- Uses React hooks for local state
- No external state management library
- Mock data in `lib/mock-data.ts` for development

### Styling

- TailwindCSS with custom configuration
- Shadcn/ui components with consistent design system
- CSS variables for theming
- Responsive design patterns

### Browser Extension Architecture

- Background script handles extension actions
- Content script injection for sidebar functionality
- Chrome Storage API for data persistence
- Cross-browser compatibility (Chrome, Firefox, Edge, Safari)

## Development Notes

### Key Implementation Details

- The @-trigger search is implemented in `App.tsx:103-204`
- Dropdown positioning logic calculates available viewport space
- Keyboard navigation supports arrow keys, Enter, and Escape
- Click-outside handling for dropdown dismissal
- Text measurement using canvas API for accurate positioning

### Testing Strategy

- Type checking with TypeScript strict mode
- No testing framework currently configured
- Consider adding React Testing Library for component tests

### Build Configuration

- WXT handles manifest generation and bundling
- Vite with TailwindCSS plugin for styling
- Automatic browser extension packaging
- Development hot reload with HMR
