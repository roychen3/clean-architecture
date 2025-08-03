---
applyTo: '**'
---

# Project Overview

This project is a [The Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html). implementation that follows the principles of separation of concerns, maintainability, and testability. It is structured into several layers, each with its own responsibilities.

## Folder Structure

- `/core`: Contains core business logic, entities, and errors.
- `/application`: Contains use cases and application services.

## Coding Standards

- The system architecture must follow Clean Architecture principles.
- Must comply with the SOLID principles.
- The code style of this project must be consistent.
- Code must be readable and maintainable.
- Only add comments when the code cannot clearly express its purpose.
- Always use English to write code, unless there are special circumstances.
- Import statements must follow the order below, with an empty line between each group:
  ```typescript
  import { ... } from 'third-party-library';
  // need empty line here
  import { ... } from '@ca/core';
  import { ... } from '@ca/application';
  // need empty line here
  import { ... } from '../../relative-path';
  import { ... } from '../relative-path';
  import { ... } from './relative-path';
  import { ... } from './children/relative-path';
  import { ... } from './children/children/relative-path';
  ```
