---
applyTo: 'ui/web-app/**'
---

# Project Overview

This project is a frontend web project.

## Coding Standards

- Use Vite + React + TypeScript.
- Style uses Tailwind CSS + shadcn/ui.
- The website theme color uses the default "new-york" style of shadcn/ui.
- shadcn/ui components should be placed in the `ui/web-app/src/components/ui` folder.
- File naming should consistently use kebab-case.
- The whole app call API services through the `APIServiceFactory`.
- Always define API Interfaces and DTOs (Data Transfer Objects) in the `ui/web-app/src/services/api` folder.
- Web pages must follow RWD and be designed mobile-first.
- Components shared across different pages should be placed in the `components` folder.
  For example: If `ExampleComponent.tsx` is used in both `ui/web-app/src/pages/a/*` and `ui/web-app/src/pages/b/*`, it should be placed in `ui/web-app/src/components/ExampleComponent.tsx`.
- If `AnotherComponent.tsx` is only used in `ui/web-app/src/pages/a/*`, it should be placed in `ui/web-app/src/pages/a/_components/AnotherComponent.tsx`.
