# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
npm run dev          # Start dev server (port 8080)
npm run build        # Production build
npm run build:dev    # Development build
npm run lint         # ESLint check
npm run preview      # Preview production build
```

## Architecture

This is a React + TypeScript landing page for "WM Tyres" (tire service company for construction machinery). Built with Vite, uses shadcn/ui components and Tailwind CSS.

### Path Aliases
- `@/` maps to `src/` (configured in vite.config.ts and tsconfig.json)

### Project Structure
- `src/pages/` - Route pages (Index, NotFound)
- `src/components/` - Custom components (Header, Hero, Services, Realizations, About, ContactForm, Footer)
- `src/components/ui/` - shadcn/ui primitives
- `src/hooks/` - Custom hooks (use-toast, use-mobile)
- `src/lib/utils.ts` - `cn()` utility for merging Tailwind classes
- `src/integrations/supabase/` - Supabase client and auto-generated types

### Key Patterns
- Uses React Router for routing (add routes in `App.tsx` above the catch-all `*` route)
- Supabase client: `import { supabase } from "@/integrations/supabase/client"`
- Toast notifications via `sonner` and custom `useToast` hook
- TanStack Query for server state management
- Form handling with react-hook-form + zod validation

### Styling
- Tailwind CSS with CSS variables for theming (defined in `src/index.css`)
- Custom fonts: "Bebas Neue" (display), "Inter" (sans)
- shadcn/ui style: "default" with slate base color

### Environment Variables
Required in `.env`:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
