# Web App Frontend Project Description

This project uses **Vite + React + TypeScript** technologies, combined with **Tailwind CSS** and **shadcn/ui** for UI design. The website theme color uses the default "new-york" style of shadcn/ui, and is designed mobile-first to support RWD (Responsive Web Design).

There are various choices for frontend frameworks, each with its own ecosystem (such as state management, UI libraries, etc.). To facilitate future framework switching, the entire application operates APIs through the `APIServiceFactory` abstraction. The implementation details of APIs can freely use fetch, axios, or RxJS, ensuring code maintainability and

---

## Project Structure

- `src/api/`: API abstraction interfaces and implementations.
- `src/hooks/`: Shared hooks across pages.
- `src/components/`: Shared components across pages.
- `src/components/ui/`: shadcn/ui styled components.
- `src/pages/[page]/_components/`: Components used only by the specific page.
- `src/pages/`: Web pages, organized by functionality.

---

## Development Standards

- File naming uses **kebab-case**.
- Page components and shared components are managed separately.
- shadcn/ui components are all placed in `src/components/ui/`.
- Web design must support RWD and be mobile-first.
- Import order must follow project standards, grouped
