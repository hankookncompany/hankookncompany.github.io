# Technology Stack

## Current Setup
- **Frontend Framework**: Next.js 15+ (React-based)
- **UI Library**: React 19+
- **Styling**: Tailwind CSS
- **Component Library**: shadcn/ui
- **Language**: TypeScript (recommended)
- **Package Manager**: npm/yarn/pnpm

## Development Guidelines
- Use Next.js App Router for new features
- Leverage shadcn/ui components for consistent design
- Follow Tailwind CSS utility-first approach
- Implement responsive design patterns
- Use TypeScript for type safety
- Follow React best practices and hooks patterns

## Common Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking

# shadcn/ui components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input

# Tailwind
npm run build-css    # Build Tailwind CSS
```

## Dependencies
- Keep dependencies minimal and well-justified
- Pin versions for reproducible builds
- Regular security updates and maintenance