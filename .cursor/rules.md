# Cursor Project Rules

## Language & Style

- Use TypeScript everywhere
- Use ES6+ only
- Use arrow functions only (no function declarations)
- Prefer const over let
- No var

## React & Next.js

- Use React Server Components by default
- Mark client components explicitly with "use client"
- Components must be small, reusable, and testable
- One component per file
- No inline styles

## Architecture

- Shared utilities go in /lib
- Reusable UI goes in /components
- Validation schemas go in /schemas
- Types go in /types
- No business logic inside UI components

## Forms & Validation

- Use react-hook-form with Zod
- No validation logic in JSX
- No uncontrolled inputs

## General

- Avoid over-engineering
- Prefer clarity over cleverness
- Follow existing project patterns
