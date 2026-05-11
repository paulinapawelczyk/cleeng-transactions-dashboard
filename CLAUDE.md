# Project context for Claude Code

## What this is
Recruitment task for Cleeng (Senior Frontend role). Transactions
management dashboard. Mock data, no real backend.

## Stack constraints
- Next.js 15 App Router, TypeScript strict mode
- TanStack Query for server state
- MSW for API mocking (NOT inline setTimeout)
- Tailwind for styling, sonner for toasts
- Vitest + Testing Library + MSW for tests

## Code conventions
- No `any` types ever. Use `unknown` + narrowing if needed.
- Discriminated unions over boolean flags for state machines
- Prefer `Intl.NumberFormat` / `Intl.DateTimeFormat` over manual formatting
- Server Components by default; 'use client' only when needed (state, effects, browser APIs)
- Component files: PascalCase. Hooks: camelCase with `use` prefix.
- Tests colocated: `Component.tsx` + `Component.test.tsx`

## What NOT to do
- No Zustand (overkill for one page)
- No Clerk, no Prisma, no DB – this is mock-only
- No premature abstractions (DRY only after 3rd repetition)
- No console.log in committed code
- No comments explaining WHAT – only WHY when non-obvious

## Critical requirements from task
1. Concurrent retries with Promise.allSettled (NOT Promise.all)
2. Per-row independent loading state during retry
3. 20% failure rate simulation for retries
4. Random 1-4s delay per retry call
5. 2s "generating PDF" simulation for download
6. Checkbox only on rows with status='failed'